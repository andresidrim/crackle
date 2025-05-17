package ws

import (
	"encoding/json"
	"log"
)

func SendJSON(player *Player, msgType string, data any) {
	out := OutgoingMessage{
		Type: msgType,
		Data: data,
	}

	msg, err := json.Marshal(out)
	if err != nil {
		log.Println("Error marshalling message:", err)
		return
	}

	player.Send <- msg
}
