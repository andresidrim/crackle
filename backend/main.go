package main

import (
	"github.com/andresidrim/guess-pin-game/ws"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/ws/:roomID/:playerID", ws.HandleWebSocket)
	r.GET("/rooms/:roomID/players/:playerID/exists", ws.CheckPlayerExists)
	r.POST("/rooms/:roomID/verify-password", ws.CheckRoomPassword)
	r.POST("/rooms", ws.CreateRoomHandler)
	r.GET("/rooms/:roomID/has-password", ws.RoomHasPassword)

	r.Run("0.0.0.0:8080")
}
