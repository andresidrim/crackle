export function getProtocol() {
  const websocket = window.location.protocol === "https:" ? "wss" : "ws";
  const http = window.location.protocol;

  return {
    websocket,
    http,
  };
}
