import { protocol } from "@/utils/getProtocol";

export async function verifyPassword(roomID: string, password: string) {
  try {
    const res = await fetch(
      `${protocol}://${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomID}/verify-password`,
      {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await res.json();

    return {
      success: res.ok && data.success,
      message: data.message || "Something went wrong",
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error or invalid response",
    };
  }
}
