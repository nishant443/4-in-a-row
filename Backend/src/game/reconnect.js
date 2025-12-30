const { activeGames, removeGame } = require("./gameManager");

function handleDisconnect(gameId, username, onForfeit) {
    const game = activeGames.get(gameId);
    if (!game) return;

    game.reconnectTimers[username] = setTimeout(() => {
        const winner = game.players.find(p => p !== username);
        onForfeit(game, winner);
        removeGame(gameId);
    }, 30000);
}

function handleReconnect(gameId, username) {
    const game = activeGames.get(gameId);
    if (!game) return;

    if (game.reconnectTimers[username]) {
        clearTimeout(game.reconnectTimers[username]);
        delete game.reconnectTimers[username];
    }
}

module.exports = { handleDisconnect, handleReconnect };
