const { Server } = require("socket.io");
const { handleJoin, handleMove } = require("../sockets/game.socket");
const { onDisconnect, onReconnect } = require("../sockets/player.socket");

function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" },
        pingInterval: 25000,   // send heartbeat every 25s
        pingTimeout: 60000    // wait 60s before disconnect
    });

    io.on("connection", socket => {
        socket.on("JOIN", data => handleJoin(socket, data, io));
        socket.on("MOVE", data => handleMove(socket, data, io));
        socket.on("RECONNECT", data => onReconnect(socket, data.username));
        socket.on("disconnect", () => onDisconnect(socket));
    });
}

module.exports = { initSocket };
