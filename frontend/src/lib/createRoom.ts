import { protocol } from "@/utils/getProtocol";

export async function createRoom(
  roomID: string,
  password: string,
  playerID: string,
) {
  const res = await fetch(
    `${protocol}://${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms`,
    {
      method: "POST",
      body: JSON.stringify({ roomID, password, playerID }),
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to create room: ${await res.text()}`);
  }

  const data: { success: boolean; message: string } = await res.json();
  return {
    success: data.success,
    message: data.message,
  };
}
