const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true
    },

    gameId: {
        type: String
    },

    player: {
        type: String
    },

    opponent: {
        type: String
    },

    winner: {
        type: String
    },

    duration: {
        type: Number
    },

    moveCount: {
        type: Number
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Analytics", analyticsSchema);
