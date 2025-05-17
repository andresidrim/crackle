import JoinRoom from "@/components/organisms/JoinRoom";
import { roomHasPassword } from "@/lib/roomHasPassword";

export default async function JoinRoomPage({
  params,
}: {
  params: Promise<{ roomID: string }>;
}) {
  const { roomID } = await params;
  const hasPassword = await roomHasPassword(roomID);

  return <JoinRoom roomID={roomID} hasPassword={hasPassword} />;
}
