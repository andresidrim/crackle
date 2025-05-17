import Game from "@/components/organisms/Game";
import { roomHasPassword } from "@/lib/roomHasPassword";

export default async function GamePage({
  params,
}: {
  params: Promise<{ roomID: string }>;
}) {
  const { roomID } = await params;
  const hasPassword = await roomHasPassword(roomID);

  return <Game roomID={roomID} hasPassword={hasPassword} />;
}
