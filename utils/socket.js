import { io } from "socket.io-client";

const HOST = "thanh.bhieu.com";
const SITE_NAME = "frontend";
const SOCKETIO_PORT = 9000;
const USE_HTTPS = true;

export function initSocket() {
  const protocol = USE_HTTPS ? "https" : "http";
  const port = SOCKETIO_PORT ? `:${SOCKETIO_PORT}` : "";
  const url = `${protocol}://${HOST}${port}/${SITE_NAME}`;

  const socket = io(url, {
    withCredentials: true,
    reconnectionAttempts: 5,
    transports: ["websocket"],
  });

  //   const socket = io(url, {
  //     query: { token: "c72@gmail.com:Longyin123@" }, // hoặc session cookie
  //   });

  socket.on("new_message", (data) => {
    console.log("🔔 new_message:", data);
  });

  return socket;
}
