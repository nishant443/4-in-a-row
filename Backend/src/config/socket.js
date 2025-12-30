const { Server } = require("socket.io");
const { handleJoin, handleMove } = require("../sockets/game.socket");
const { onDisconnect, onReconnect } = require("../sockets/player.socket");

function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", socket => {
        socket.on("JOIN", data => handleJoin(socket, data, io));
        socket.on("MOVE", data => handleMove(socket, data, io));
        socket.on("RECONNECT", data => onReconnect(socket, data.username));
        socket.on("disconnect", () => onDisconnect(socket));
    });
}

module.exports = { initSocket };
