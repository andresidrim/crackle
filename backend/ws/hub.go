package ws

import (
	"log"
	"sync"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type Player struct {
	ID      string
	Secret  string
	Guesses map[string]bool
	Send    chan []byte
}

type Room struct {
	ID          string
	Players     map[string]*Player
	Mutex       sync.Mutex
	CurrentTurn string
	Password    string
	Creator     string
}

var rooms = make(map[string]*Room)
var roomsMutex sync.Mutex

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func GetRoom(id string) (*Room, bool) {
	roomsMutex.Lock()
	defer roomsMutex.Unlock()
	room, exists := rooms[id]
	return room, exists
}

func CreateRoom(id, password, playerID string) *Room {
	hashedPassword, _ := hashPassword(password)
	room := &Room{
		ID:       id,
		Players:  make(map[string]*Player),
		Password: hashedPassword,
		Creator:  playerID,
	}
	roomsMutex.Lock()
	rooms[id] = room
	roomsMutex.Unlock()
	log.Printf("🏠 Room %s created by %s", id, playerID)
	return room
}

func BroadcastToOpponent(sender *Player, room *Room, msgType string, data any) {
	for _, p := range room.Players {
		if p.ID != sender.ID {
			SendJSON(p, msgType, data)
		}
	}
}

func (r *Room) TryStartGame() {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	if len(r.Players) < 2 {
		return
	}

	ready := 0
	for _, p := range r.Players {
		if p.Secret != "" {
			ready++
		}
	}

	if ready == 2 && r.CurrentTurn == "" {
		for id := range r.Players {
			r.CurrentTurn = id
			log.Printf("🎲 Game started in room %s. First turn: %s", r.ID, r.CurrentTurn)
			break
		}

		for _, p := range r.Players {
			SendJSON(p, "game_started", gin.H{
				"yourTurn": p.ID == r.CurrentTurn,
			})
		}
	}
}
