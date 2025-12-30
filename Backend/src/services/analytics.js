const { getProducer } = require("../config/kafka");

async function sendGameEvent(type, game, winner) {
    const producer = getProducer();
    if (!producer) return; // Kafka disabled or not connected

    try {
        await producer.send({
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
    } catch (err) {
        console.error("Failed to send analytics event:", err);
    }
}

module.exports = { sendGameEvent };
