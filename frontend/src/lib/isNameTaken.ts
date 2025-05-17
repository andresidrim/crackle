import { getProtocol } from "@/utils/getProtocol";

export async function isNameTaken(roomID: string, playerID: string) {
  const res = await fetch(
    `${getProtocol().http}://${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomID}/players/${playerID}/exists`,
  );

  if (!res.ok) {
    throw new Error(`Failed to check if name is taken: ${await res.text()}`);
  }

  const data: { exists: boolean } = await res.json();
  return data.exists;
}
