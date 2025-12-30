const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const leaderboardRoute = require("./routes/leaderboard");
app.use("/leaderboard", leaderboardRoute);

app.get("/", (req, res) => res.send({ ok: true }));

module.exports = app;
