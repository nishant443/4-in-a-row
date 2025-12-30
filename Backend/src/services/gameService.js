const Game = require("../models/Game");

async function saveGame(game, winner) {
    await Game.create({
        gameId: game.gameId,
        player1: game.players[0],
        player2: game.players[1],
        winner,
        moves: game.moves.map((m, i) => ({
            player: m.player,
            column: m.col,
            moveNumber: i + 1
        })),
        totalMoves: game.moves.length,
        duration: Math.floor((Date.now() - game.startedAt) / 1000),
        isBotGame: game.isBotGame,
        endedAt: new Date()
    });
}

module.exports = { saveGame };
