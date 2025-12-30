const mongoose = require("mongoose");

const moveSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true
    },
    column: {
        type: Number,
        required: true
    },
    moveNumber: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const gameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true
    },

    player1: {
        type: String,
        required: true
    },

    player2: {
        type: String,
        required: true
    },

    winner: {
        type: String, // username or "DRAW"
        default: null
    },

    moves: [moveSchema],

    totalMoves: {
        type: Number,
        default: 0
    },

    duration: {
        type: Number // seconds
    },

    isBotGame: {
        type: Boolean,
        default: false
    },

    startedAt: {
        type: Date,
        default: Date.now
    },

    endedAt: {
        type: Date
    }
});

module.exports = mongoose.model("Game", gameSchema);
