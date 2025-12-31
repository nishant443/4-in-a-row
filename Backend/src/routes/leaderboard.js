const express = require("express");
const Player = require("../models/Player");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const leaderboard = await Player.find()
            .sort({ wins: -1 })
            .limit(10);

        res.status(200).json(leaderboard);
    } catch (err) {
        console.error("Leaderboard fetch failed:", err);
        res.status(500).json({ message: "Failed to load leaderboard" });
    }
});

module.exports = router;
