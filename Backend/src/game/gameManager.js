const activeGames = new Map();   // gameId → game object
const userToGame = new Map();   // username → gameId

function createGame(gameId, player1, player2, isBotGame = false) {
    const game = {
        gameId,
        board: createEmptyBoard(),
        players: [player1, player2],
        currentTurn: player1,
        isBotGame,
        moves: [],
        startedAt: Date.now(),
        reconnectTimers: {} // username → timeout
    };

    activeGames.set(gameId, game);
    userToGame.set(player1, gameId);
    userToGame.set(player2, gameId);

    return game;
}

function getGame(gameId) {
    return activeGames.get(gameId);
}

function removeGame(gameId) {
    const game = activeGames.get(gameId);
    if (!game) return;

    game.players.forEach(p => userToGame.delete(p));
    activeGames.delete(gameId);
}

module.exports = {
    activeGames,
    userToGame,
    createGame,
    getGame,
    removeGame
};

const { createEmptyBoard } = require("./boardLogic");
