import CreateRoomPage from "@/components/organisms/CreateRoom";

export default async function CreateRoom({
  params,
}: {
  params: Promise<{ roomID: string }>;
}) {
  const { roomID } = await params;

  return <CreateRoomPage roomID={roomID} />;
}
