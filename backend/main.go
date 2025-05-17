package main

import (
	"os"
	"time"

	"github.com/andresidrim/guess-pin-game/ws"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/ws/:roomID/:playerID", ws.HandleWebSocket)
	r.GET("/rooms/:roomID/players/:playerID/exists", ws.CheckPlayerExists)
	r.POST("/rooms/:roomID/verify-password", ws.CheckRoomPassword)
	r.POST("/rooms", ws.CreateRoomHandler)
	r.GET("/rooms/:roomID/has-password", ws.RoomHasPassword)

	r.Run("0.0.0.0:8080")
}
