"use client";

import { useState } from "react";
import { Button, Input, Form } from "../atoms";
import Container from "../Container";
import { verifyPassword } from "@/lib/verifyPassword";
import { useRouter } from "next/navigation";
import { setCanJoin } from "@/utils/setCanJoin";
import { isNameTaken } from "@/lib/isNameTaken";
import { savePlayerID } from "@/utils/savePlayerID";

export default function JoinRoom({
  roomID,
  hasPassword,
}: {
  roomID: string;
  hasPassword: boolean;
}) {
  const [step, setStep] = useState<"username" | "password">("username");
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <section className="min-h-screen flex items-center justify-center">
      <Container>
        {step === "username" ? (
          <Form
            action={async (formData) => {
              setIsLoading(true);
              const name = String(formData.get("playerID")).trim();

              if (!name) {
                setErrorMsg("Username is required");
                setHasError(true);
                setIsLoading(false);
                return;
              }

              const taken = await isNameTaken(roomID, name);
              if (!taken) {
                savePlayerID(name);
                if (!hasPassword) {
                  setCanJoin(roomID);
                  router.push(`/play/${roomID}`);
                } else {
                  setStep("password");
                }
              } else {
                setErrorMsg("Username is taken");
                setHasError(true);
              }
              setIsLoading(false);
            }}
          >
            <Input
              name="playerID"
              placeholder="Enter your username"
              hasError={hasError}
              errorText={errorMsg}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Continue
            </Button>
          </Form>
        ) : (
          <Form
            action={async (formData) => {
              setIsLoading(true);
              const password = String(formData.get("roomPassword")).trim();

              const { success, message } = await verifyPassword(
                roomID,
                password,
              );
              if (success) {
                setCanJoin(roomID);
                router.push(`/play/${roomID}`);
              } else {
                setErrorMsg(message);
                setHasError(true);
              }
              setIsLoading(false);
            }}
          >
            <Input
              name="roomPassword"
              placeholder="Room password"
              hasError={hasError}
              errorText={errorMsg}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Join Room
            </Button>
          </Form>
        )}
      </Container>
    </section>
  );
}
