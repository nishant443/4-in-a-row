const { v4: uuid } = require("uuid");
const { enqueuePlayer, removeFromQueue } = require("../matchmaking/queue");
const { createGame, getGame, removeGame, userToGame } = require("../game/gameManager");
const { dropDisc, checkWin, isDraw } = require("../game/boardLogic");
const { getBotMove } = require("../game/botEngine");
const { sendGameEvent } = require("../services/analytics");
const { updateLeaderboard } = require("../services/leaderboard");
const GameModel = require("../models/Game");


const userSockets = new Map();

/* ============================
   HELPERS
============================ */

function emitToUser(username, event, payload) {
    const socket = userSockets.get(username);
    if (socket) socket.emit(event, payload);
}

function emitToPlayers(game, event, payload) {
    game.players.forEach(p => {
        if (p !== "BOT") emitToUser(p, event, payload);
    });
}

/* JOIN & MATCHMAKING */

function handleJoin(socket, data, io) {
    const { username } = data;

    socket.username = username;
    userSockets.set(username, socket);

    const opponent = enqueuePlayer(username, (player) => {
        startBotGame(player, io);
    });

    if (opponent) {
        startGame(username, opponent, io);
    }
}

/* GAME START*/

function startGame(p1, p2, io, isBotGame = false) {
    const gameId = uuid();
    const game = createGame(gameId, p1, p2, isBotGame);

    emitToUser(p1, "MATCH_FOUND", { gameId, opponent: p2 });
    if (p2 !== "BOT") emitToUser(p2, "MATCH_FOUND", { gameId, opponent: p1 });

    emitToPlayers(game, "GAME_UPDATE", game);
}

function startBotGame(player, io) {
    startGame(player, "BOT", io, true);
}

/* PLAYER MOVE */

async function handleMove(socket, data, io) {
    const { gameId, col } = data;
    const username = socket.username;

    const game = getGame(gameId);
    if (!game || game.currentTurn !== username) return;

    const row = dropDisc(game.board, col, username);
    if (row === -1) return;

    game.moves.push({ player: username, col, row });
    game.currentTurn = game.players.find(p => p !== username);

    if (checkWin(game.board, row, col, username)) {
        await finishGame(game, username);
        return;
    }

    if (isDraw(game.board)) {
        await finishGame(game, "DRAW");
        return;
    }

    emitToPlayers(game, "GAME_UPDATE", game);

    if (game.isBotGame && game.currentTurn === "BOT") {
        const botCol = getBotMove(game.board, "BOT", username);
        setTimeout(() => handleMoveBot(game.gameId, botCol), 300);
    }
}

/* BOT MOVE*/

async function handleMoveBot(gameId, col) {
    const game = getGame(gameId);
    if (!game) return;

    const row = dropDisc(game.board, col, "BOT");
    if (row === -1) return;

    game.moves.push({ player: "BOT", col, row });
    game.currentTurn = game.players.find(p => p !== "BOT");

    if (checkWin(game.board, row, col, "BOT")) {
        await finishGame(game, "BOT");
        return;
    }

    if (isDraw(game.board)) {
        await finishGame(game, "DRAW");
        return;
    }

    emitToPlayers(game, "GAME_UPDATE", game);
}

/* FINISH GAME */

async function finishGame(game, winner) {
    emitToPlayers(game, "GAME_UPDATE", game);
    emitToPlayers(game, "GAME_OVER", { winner });

    try {
        await GameModel.create({
            gameId: game.gameId,
            player1: game.players[0],
            player2: game.players[1],
            winner,
            moves: game.moves,
            totalMoves: game.moves.length,
            duration: Math.floor((Date.now() - game.startedAt) / 1000),
            isBotGame: game.isBotGame,
            endedAt: new Date()
        });

        sendGameEvent("GAME_END", game, winner).catch(() => { });
        updateLeaderboard(game.players[0], game.players[1], winner).catch(() => { });
    } catch (e) {
        console.error("Game save failed", e);
    }

    removeGame(game.gameId);
}

/* DISCONNECT CLEANUP */

function onDisconnect(socket) {
    if (socket.username) {
        userSockets.delete(socket.username);
        removeFromQueue(socket.username);
    }
}

module.exports = { handleJoin, handleMove, onDisconnect };
