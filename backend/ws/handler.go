package ws

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
)

type CreateRoomPayload struct {
	RoomID   string `json:"roomID"`
	Password string `json:"password"`
	PlayerID string `json:"playerID"`
}

type CheckPasswordPayload struct {
	Password string `json:"password"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func CheckRoomPassword(c *gin.Context) {
	roomID := c.Param("roomID")

	var payload CheckPasswordPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request"})
		return
	}

	room, exists := GetRoom(roomID)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Room not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(room.Password), []byte(payload.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Incorrect password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Correct password"})
}

func RoomHasPassword(c *gin.Context) {
	roomID := c.Param("roomID")

	room, exists := GetRoom(roomID)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "hasPassword": false})
		return
	}

	hasPassword := len(room.Password) > 0

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"hasPassword": hasPassword,
	})
}

func HandleWebSocket(c *gin.Context) {
	roomID := c.Param("roomID")
	playerID := c.Param("playerID")

	log.Printf("Incoming WS connection: room=%s, player=%s", roomID, playerID)

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error when upgrading to websocket:", err)
		return
	}

	room, exists := GetRoom(roomID)
	if !exists {
		log.Println("Room not found:", roomID)
		conn.WriteMessage(websocket.TextMessage, []byte(`{"type":"error","data":{"message":"Room not found"}}`))
		conn.Close()
		return
	}

	room.Mutex.Lock()
	if len(room.Players) > 2 {
		room.Mutex.Unlock()
		log.Println("Room is full:", roomID)
		conn.WriteMessage(websocket.TextMessage, []byte(`{"type":"error","data":{"message":"Room is full"}}`))
		conn.Close()
		return
	}

	player := &Player{
		ID:      playerID,
		Guesses: make(map[string]bool),
		Send:    make(chan []byte, 256),
	}

	room.Players[playerID] = player
	room.Mutex.Unlock()

	go readPump(conn, player, room)
	go writePump(conn, player)
}

func readPump(conn *websocket.Conn, player *Player, room *Room) {
	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error when reading message:", err)
			break
		}
		log.Printf("Message received from %s: %s", player.ID, message)

		var msg IncomingMessage
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Println("Invalid message format:", err)
			continue
		}

		handleMessage(msg, player, room)
	}
}

func writePump(conn *websocket.Conn, player *Player) {
	defer conn.Close()
	for msg := range player.Send {
		err := conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			log.Println("Error sending message:", err)
			break
		}
	}
}

func handleMessage(msg IncomingMessage, player *Player, room *Room) {
	switch msg.Type {
	case "set_secret":
		room.Mutex.Lock()
		player.Secret = msg.Secret
		room.Mutex.Unlock()
		room.TryStartGame()
	case "guess":
		processGuess(msg.Guess, player, room)
	case "reset_game":
		resetGame(room)
	}
}

func processGuess(guess string, player *Player, room *Room) {
	room.Mutex.Lock()
	defer room.Mutex.Unlock()

	if room.CurrentTurn != player.ID {
		SendJSON(player, "error", ErrorMessage{Message: "It's not your turn"})
		return
	}

	if player.Guesses[guess] {
		SendJSON(player, "error", ErrorMessage{Message: "Guess already used"})
		return
	}

	player.Guesses[guess] = true

	var opponent *Player
	for _, p := range room.Players {
		if p.ID != player.ID {
			opponent = p
			break
		}
	}
	if opponent == nil || opponent.Secret == "" {
		SendJSON(player, "error", ErrorMessage{Message: "Opponent not ready"})
		return
	}

	if guess == opponent.Secret {
		SendJSON(player, "game_over", GameOverPayload{Winner: "you"})
		SendJSON(opponent, "game_over", GameOverPayload{Winner: player.ID})
	} else {
		correctDigits := getCorrectDigits(guess, opponent.Secret)
		SendJSON(player, "guess_result", GuessResultPayload{
			Correct:       false,
			Guess:         guess,
			CorrectDigits: correctDigits,
		})
		BroadcastToOpponent(player, room, "opponent_guessed", OpponentGuessedPayload{
			Guess:         guess,
			CorrectDigits: correctDigits,
		})
		room.CurrentTurn = opponent.ID
		SendJSON(opponent, "your_turn", nil)
	}
}

func getCorrectDigits(guess, secret string) uint8 {
	var correctDigits uint8
	for i, digit := range guess {
		if byte(digit) == secret[i] {
			correctDigits++
		}
	}
	return correctDigits
}
func CheckPlayerExists(c *gin.Context) {
	roomID := c.Param("roomID")
	playerID := c.Param("playerID")

	room, exists := GetRoom(roomID)

	if exists == false {
		return
	}

	room.Mutex.Lock()
	defer room.Mutex.Unlock()

	if _, exists := room.Players[playerID]; exists {
		c.JSON(http.StatusOK, gin.H{"exists": true})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exists": false})
}

func CreateRoomHandler(c *gin.Context) {
	var payload CreateRoomPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request"})
		return
	}

	if _, exists := GetRoom(payload.RoomID); exists {
		c.JSON(http.StatusConflict, gin.H{"success": false, "message": "Room already exists"})
		return
	}

	CreateRoom(payload.RoomID, payload.Password, payload.PlayerID)
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Room " + payload.RoomID + " created by " + payload.PlayerID})
}

func resetGame(room *Room) {
	room.Mutex.Lock()
	defer room.Mutex.Unlock()

	for _, player := range room.Players {
		player.Secret = ""
		player.Guesses = make(map[string]bool)
	}

	room.CurrentTurn = ""

	for _, p := range room.Players {
		SendJSON(p, "game_reset", gin.H{
			"message": "Game has been reset",
		})
	}
}
