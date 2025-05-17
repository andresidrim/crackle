"use client";

import { useEffect, useState } from "react";
import { Button, Input, GameLog } from "../atoms";
import Container from "../Container";
import { useGameSocket } from "@/hooks/useGameSocket";
import { cn } from "@/utils/className";

export default function GameClient({
  roomID,
  playerID,
}: {
  roomID: string;
  playerID: string;
}) {
  const [inputValue, setInputValue] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);

  const {
    messages,
    yourTurn,
    gameStarted,
    gameOver,
    sendSecret,
    sendGuess,
    sendReset,
  } = useGameSocket(playerID, roomID);

  useEffect(() => {
    if (inputValue.length === 4 || inputValue.length === 0) {
      setHasError(false);
    } else {
      setHasError(true);
    }
  }, [inputValue]);

  function copyRoomURL() {
    navigator.clipboard.writeText(`${window.location.origin}/join/${roomID}`);
  }

  return (
    <section className="min-h-screen flex items-center justify-center">
      <Container className="gap-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-sm">
            <span className="font-medium text-[#A78BFA]">Room:</span> {roomID}
            <Button onClick={copyRoomURL} className="ml-2 text-xs px-3 py-1">
              Copy Link
            </Button>
          </p>
          <p className="text-white text-sm">
            <span className="font-medium text-[#A78BFA]">Player:</span>{" "}
            {playerID}
          </p>
        </div>

        <h1
          className={cn(
            "text-3xl font-bold text-center",
            !gameStarted
              ? "text-white"
              : yourTurn
                ? "text-[#4ADE80]"
                : "text-[#F87171]",
          )}
        >
          {!gameStarted
            ? "Set your secret"
            : yourTurn
              ? "Your Turn"
              : "Opponent's Turn"}
        </h1>

        <Input
          className="max-w-md"
          placeholder="Enter 4-digit code"
          maxLength={4}
          pattern="^\d*$"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value.trim();
            if (!/^\d*$/.test(val)) return;
            setInputValue(val);
          }}
          hasError={hasError}
          errorText={"Must be exactly 4 digits"}
          disabled={(!yourTurn && gameStarted) || gameOver}
        />

        {!gameStarted ? (
          <Button
            disabled={inputValue.length !== 4}
            onClick={() => {
              sendSecret(inputValue);
              setInputValue("");
            }}
          >
            Send Secret
          </Button>
        ) : (
          <>
            <Button
              disabled={!yourTurn || gameOver || inputValue.length !== 4}
              onClick={() => {
                sendGuess(inputValue);
                setInputValue("");
              }}
            >
              Submit Guess
            </Button>
            {gameOver && <Button onClick={sendReset}>Play Again</Button>}
          </>
        )}

        <GameLog messages={messages} />
      </Container>
    </section>
  );
}
