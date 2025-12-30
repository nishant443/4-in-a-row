import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
    autoConnect: false
});

export function connectSocket(username) {
    socket.connect();
    socket.emit("JOIN", { username });
}

export function sendMove(gameId, col) {
    socket.emit("MOVE", { gameId, col });
}
