"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Form } from "../atoms";
import Container from "../Container";
import { createRoom } from "@/lib/createRoom";
import { getPlayerID } from "@/utils/getPlayerID";
import { setCanJoin } from "@/utils/setCanJoin";

export default function CreateRoom({ roomID }: { roomID: string }) {
  const [playerID, setPlayerID] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const pid = getPlayerID();
    if (!pid) return router.push("/");
    setPlayerID(pid);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center">
      <Container>
        <Form
          action={async (formData) => {
            setIsLoading(true);
            const password = String(formData.get("roomPassword")).trim();

            try {
              const { success, message } = await createRoom(
                roomID,
                password,
                playerID,
              );
              if (success) {
                setCanJoin(roomID);
                router.push(`/play/${roomID}`);
              } else {
                setErrorMsg(message);
                setHasError(true);
              }
            } catch {
              setErrorMsg("Unexpected error. Try again.");
              setHasError(true);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <Input
            name="roomPassword"
            placeholder="Room password (optional)"
            hasError={hasError}
            errorText={errorMsg}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Room"}
          </Button>
        </Form>
      </Container>
    </section>
  );
}
