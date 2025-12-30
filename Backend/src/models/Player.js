const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },

    gamesPlayed: {
        type: Number,
        default: 0
    },

    wins: {
        type: Number,
        default: 0
    },

    losses: {
        type: Number,
        default: 0
    },

    draws: {
        type: Number,
        default: 0
    },

    winRate: {
        type: Number,
        default: 0
    },

    lastPlayed: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Player", playerSchema);
