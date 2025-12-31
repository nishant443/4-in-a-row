import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000
});


export function connectSocket(username) {
  if (!socket.connected) {
    socket.connect();
    socket.once("connect", () => {
      socket.emit("JOIN", { username });
    });
  } else {
    socket.emit("JOIN", { username });
  }
}

export function sendMove(gameId, col) {
  socket.emit("MOVE", { gameId, col });
}
