import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(BACKEND_URL, {
  transports: ["websocket"],
});

export function connectSocket(username) {
    socket.connect();
    socket.emit("JOIN", { username });
}

export function sendMove(gameId, col) {
    socket.emit("MOVE", { gameId, col });
}
