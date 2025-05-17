export function getProtocol() {
  const isHttps = window.location.protocol === "https:";
  return {
    websocket: isHttps ? "wss" : "ws",
    http: isHttps ? "https" : "http", // removido os dois-pontos
  };
}
