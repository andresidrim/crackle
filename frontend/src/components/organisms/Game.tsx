"use client";

import { useEffect, useState } from "react";
import { getPlayerID } from "@/utils/getPlayerID";
import { getCanJoin } from "@/utils/getCanJoin";
import { useRouter } from "next/navigation";
import GameClient from "./GameClient";

export default function Game({
  roomID,
  hasPassword,
}: {
  roomID: string;
  hasPassword: boolean;
}) {
  const [playerID, setPlayerID] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const pid = getPlayerID();
    const canJoinRoom = getCanJoin() === roomID;

    if (!pid || (!canJoinRoom && hasPassword)) {
      router.push(`/join/${roomID}`);
      return;
    }

    setPlayerID(pid);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center w-full text-center mt-10">
        Loading...
      </div>
    );
  }

  return <GameClient roomID={roomID} playerID={playerID} />;
}
