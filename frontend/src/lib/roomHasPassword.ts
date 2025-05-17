export async function roomHasPassword(roomID: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL_HTTP}/rooms/${roomID}/has-password`,
  );

  if (!res.ok) {
    throw new Error(
      `Failed to check if room has password: ${await res.text()}`,
    );
  }

  const data: { success: boolean; hasPassword: boolean } = await res.json();
  return data.hasPassword;
}
