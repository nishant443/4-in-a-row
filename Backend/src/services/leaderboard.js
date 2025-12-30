const Player = require("../models/Player");

async function updateLeaderboard(player1, player2, winner) {
    await updatePlayer(player1, winner === player1);
    await updatePlayer(player2, winner === player2);
}

async function updatePlayer(username, isWinner) {
    const player = await Player.findOneAndUpdate(
        { username },
        {
            $inc: {
                gamesPlayed: 1,
                wins: isWinner ? 1 : 0,
                losses: isWinner ? 0 : 1
            },
            lastPlayed: new Date()
        },
        { upsert: true, new: true }
    );

    player.winRate = (player.wins / player.gamesPlayed) * 100;
    await player.save();
}

module.exports = { updateLeaderboard };
