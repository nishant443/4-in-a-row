const express = require("express");
const Player = require("../models/Player");
const router = express.Router();

router.get("/", async (req, res) => {
    const leaderboard = await Player.find()
        .sort({ wins: -1 })
        .limit(10);

    res.json(leaderboard);
});

module.exports = router;
