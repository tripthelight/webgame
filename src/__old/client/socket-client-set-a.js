import io from "socket.io-client";

export const socket = io("http://localhost:3000", {
  transports: ["websocket"], // WebSocket만 사용하도록 강제
});
