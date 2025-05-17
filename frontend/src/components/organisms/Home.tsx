"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input, Button, Form } from "../atoms";
import Container from "../Container";
import { savePlayerID } from "@/utils/savePlayerID";
import { useClearLocalStorage } from "@/hooks/useClearLocalStorage";

export default function Home() {
  useClearLocalStorage();
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <Container className="gap-6">
        <h1 className="text-5xl text-white font-bold text-center">Crackle</h1>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const playerID = String(formData.get("playerID")).trim();

            if (!playerID) {
              setErrorMsg("Username is required");
              setHasError(true);
              return;
            }

            savePlayerID(playerID);
            const roomID = Date.now();
            router.push(`/create/${roomID}`);
          }}
        >
          <Input
            name="playerID"
            placeholder="Enter your username"
            hasError={hasError}
            errorText={errorMsg}
          />
          <Button type="submit">Create Room</Button>
        </Form>
      </Container>
    </section>
  );
}
