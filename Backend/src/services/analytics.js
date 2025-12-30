const { kafkaProducer } = require("../config/kafka");

async function sendGameEvent(type, game, winner) {
    await kafkaProducer.send({
        topic: "game.analytics",
        messages: [
            {
                value: JSON.stringify({
                    eventType: type,
                    gameId: game.gameId,
                    player1: game.players[0],
                    player2: game.players[1],
                    winner,
                    moveCount: game.moves.length,
                    duration: Math.floor((Date.now() - game.startedAt) / 1000),
                    timestamp: new Date()
                })
            }
        ]
    });
}

module.exports = { sendGameEvent };
