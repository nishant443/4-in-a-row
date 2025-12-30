const { userToGame } = require("../game/gameManager");
const { handleDisconnect, handleReconnect } = require("../game/reconnect");
const { updateLeaderboard } = require("../services/leaderboard");
const { sendGameEvent } = require("../services/analytics");

function onDisconnect(socket) {
    const username = socket.username;
    const gameId = userToGame.get(username);

    if (gameId) {
        handleDisconnect(gameId, username, (game, winner) => {
            console.log(`${username} forfeited, ${winner} wins`);
            // update persistent stats and analytics
            updateLeaderboard(game.players[0], game.players[1], winner).catch(e => console.error(e));
            sendGameEvent("GAME_FORFEIT", game, winner).catch(e => console.error(e));
        });
    }
}

function onReconnect(socket, username) {
    // attach username to socket for future disconnects
    socket.username = username;
    const gameId = userToGame.get(username);
    if (gameId) {
        handleReconnect(gameId, username);
        socket.emit("RECONNECTED", { gameId });
    }
}

module.exports = { onDisconnect, onReconnect };
