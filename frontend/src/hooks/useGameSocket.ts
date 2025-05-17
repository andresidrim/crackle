import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { protocol } from "@/utils/getProtocol";

export type MessageType =
  | "game_started"
  | "your_turn"
  | "guess_result"
  | "opponent_guessed"
  | "game_over"
  | "error"
  | "game_reset";

export type OutgoingMessage =
  | { type: "set_secret"; secret: string }
  | { type: "guess"; guess: string }
  | { type: "reset_game" };

export type IncomingMessage = {
  type: MessageType;
  data?: any;
};

export type LogMessage = {
  text: string;
  sender?: "you" | "opponent" | "system";
  timestamp?: number;
};

export function useGameSocket(playerID: string, roomID: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<LogMessage[]>([]);
  const [yourTurn, setYourTurn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const hasErrorRef = useRef(false);
  const reconnectingRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    let reconnectAttempts = 0;
    let isUnmounted = false;

    function connect() {
      if (hasErrorRef.current || isUnmounted) return;

      const socket = new WebSocket(
        `${protocol}://${process.env.NEXT_PUBLIC_BACKEND_URL}/ws/${roomID}/${playerID}`,
      );
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttempts = 0;
        reconnectingRef.current = false;
      };

      socket.onmessage = (event) => {
        const msg: IncomingMessage = JSON.parse(event.data);

        const now = Date.now();

        switch (msg.type) {
          case "game_started":
            setGameStarted(true);
            setYourTurn(msg.data?.yourTurn);
            setMessages((prev) => [
              ...prev,
              {
                text: "Game started",
                sender: "system",
                timestamp: now,
              },
            ]);
            break;

          case "your_turn":
            setYourTurn(true);
            setMessages((prev) => [
              ...prev,
              {
                text: "It's your turn",
                sender: "system",
                timestamp: now,
              },
            ]);
            break;

          case "guess_result":
            setMessages((prev) => [
              ...prev,
              {
                text: `Your guess ${msg.data.guess} was ${
                  msg.data.correct
                    ? "correct"
                    : `wrong. You got ${msg.data.correctDigits} digit${
                        msg.data.correctDigits > 1 ? "s" : ""
                      } right`
                }`,
                sender: "you",
                timestamp: now,
              },
            ]);
            setYourTurn(false);
            break;

          case "opponent_guessed":
            setMessages((prev) => [
              ...prev,
              {
                text: `Opponent guessed ${msg.data.guess}. They got ${msg.data.correctDigits} digit${
                  msg.data.correctDigits > 1 ? "s" : ""
                } right`,
                sender: "opponent",
                timestamp: now,
              },
            ]);
            break;

          case "game_over":
            setGameOver(true);
            setMessages((prev) => [
              ...prev,
              {
                text: `Game Over. Winner: ${msg.data.winner}`,
                sender: "system",
                timestamp: now,
              },
            ]);
            break;

          case "game_reset":
            setGameStarted(false);
            setGameOver(false);
            setYourTurn(false);
            setMessages([
              {
                text: "Game has been reset",
                sender: "system",
                timestamp: now,
              },
            ]);
            break;

          case "error":
            alert(msg.data.message);
            if (msg.data.message === "Room is full") {
              hasErrorRef.current = true;
              socket.close(4000, "Room is full");
              router.push("/");
            }
            break;
        }
      };

      socket.onerror = (e) => {
        console.error("WebSocket error:", e);
      };

      socket.onclose = () => {
        if (!isUnmounted && !hasErrorRef.current && reconnectAttempts < 3) {
          reconnectAttempts++;
          reconnectingRef.current = true;
          const delay = 1000 * reconnectAttempts;
          setTimeout(connect, delay);
        }
      };
    }

    connect();

    return () => {
      isUnmounted = true;
      const socket = socketRef.current;
      if (socket) {
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        try {
          if (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
          ) {
            socket.close();
          }
        } catch (err) {
          console.warn("Error while closing socket:", err);
        }
      }
    };
  }, [roomID, playerID]);

  function send(msg: OutgoingMessage) {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    }
  }

  return {
    messages,
    yourTurn,
    gameStarted,
    gameOver,
    sendSecret: (secret: string) => send({ type: "set_secret", secret }),
    sendGuess: (guess: string) => send({ type: "guess", guess }),
    sendReset: () => send({ type: "reset_game" }),
  };
}
