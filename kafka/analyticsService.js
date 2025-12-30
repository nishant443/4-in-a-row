const mongoose = require("mongoose");
const Analytics = require("../Backend/src/models/Analytics");

mongoose.connect(process.env.MONGO_URI);

async function saveAnalytics(event) {
    await Analytics.create({
        eventType: event.eventType,
        gameId: event.gameId,
        player: event.player1,
        opponent: event.player2,
        winner: event.winner,
        duration: event.duration,
        moveCount: event.moveCount
    });

    console.log("Analytics event saved:", event.eventType);
}

module.exports = { saveAnalytics };
