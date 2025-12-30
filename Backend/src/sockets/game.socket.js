const { v4: uuid } = require("uuid");
const { enqueuePlayer, removeFromQueue } = require("../matchmaking/queue");
const { createGame, getGame, removeGame, userToGame } = require("../game/gameManager");
const { dropDisc, checkWin, isDraw } = require("../game/boardLogic");
const { getBotMove } = require("../game/botEngine");
const { handleDisconnect } = require("../game/reconnect");
const { sendGameEvent } = require("../services/analytics");
const { updateLeaderboard } = require("../services/leaderboard");
const GameModel = require("../models/Game");

const socketUsers = new Map(); // socket.id → username

function getSocketId(username) {
    for (const [id, name] of socketUsers.entries()) {
        if (name === username) return id;
    }
    return null;
}

async function finishGame(io, game, winner) {
    // emit final game state to players, then send game over with winner
    emitToPlayers(io, game, "GAME_UPDATE", game);
    emitToPlayers(io, game, "GAME_OVER", { winner, game });

    // persist finished game
    try {
        const saved = await GameModel.create({
            gameId: game.gameId,
            player1: game.players[0],
            player2: game.players[1],
            winner: winner === "DRAW" ? "DRAW" : winner,
            moves: game.moves.map((m, i) => ({ player: m.player, column: m.col, moveNumber: i + 1 })),
            totalMoves: game.moves.length,
            duration: Math.floor((Date.now() - game.startedAt) / 1000),
            isBotGame: !!game.isBotGame,
            startedAt: new Date(game.startedAt),
            endedAt: new Date()
        });

        // analytics
        sendGameEvent("GAME_END", game, winner).catch(e => console.error(e));

        // leaderboard updates (ignore bot as a player record)
        updateLeaderboard(game.players[0], game.players[1], winner).catch(e => console.error(e));
    } catch (err) {
        console.error("Error saving finished game:", err);
    }

    removeGame(game.gameId);
}

function emitToPlayers(io, game, event, payload) {
    game.players.forEach(p => {
        if (p === "BOT") return;
        const id = getSocketId(p);
        if (id) io.to(id).emit(event, payload);
    });
}

function handleJoin(socket, data, io) {
    const { username } = data;
    socket.username = username;
    socketUsers.set(socket.id, username);

    const opponent = enqueuePlayer(username, (player) => {
        startBotGame(player, io);
    });

    if (opponent) {
        startGame(username, opponent, io);
    }
}

function startGame(p1, p2, io, isBotGame = false) {
    const gameId = uuid();
    const game = createGame(gameId, p1, p2, isBotGame);

    // send match found to both players (if not bot)
    const id1 = getSocketId(p1);
    if (id1) io.to(id1).emit("MATCH_FOUND", { gameId, opponent: p2 });
    const id2 = getSocketId(p2);
    if (id2) io.to(id2).emit("MATCH_FOUND", { gameId, opponent: p1 });

    emitToPlayers(io, game, "GAME_UPDATE", game);
}

function startBotGame(player, io) {
    startGame(player, "BOT", io, true);
}

async function handleMove(socket, data, io) {
    const { gameId, col, row: requestedRow } = data;
    const username = socketUsers.get(socket.id);
    const game = getGame(gameId);

    if (!game || game.currentTurn !== username) return;
    let row = -1;

    if (typeof requestedRow === 'number') {
        // place at requested row if empty and within bounds
        if (requestedRow < 0 || requestedRow >= game.board.length) return;
        if (col < 0 || col >= game.board[0].length) return;
        if (game.board[requestedRow][col]) return; // occupied
        game.board[requestedRow][col] = username;
        row = requestedRow;
    } else {
        row = dropDisc(game.board, col, username);
        if (row === -1) return;
    }

    game.moves.push({ player: username, col, row });
    game.currentTurn = game.players.find(p => p !== username);

    if (checkWin(game.board, row, col, username)) {
        await finishGame(io, game, username);
        return;
    }

    if (isDraw(game.board)) {
        await finishGame(io, game, "DRAW");
        return;
    }

    emitToPlayers(io, game, "GAME_UPDATE", game);

    if (game.isBotGame && game.currentTurn === "BOT") {
        const botCol = getBotMove(game.board, "BOT", username);
        // small delay to simulate thinking
        setTimeout(() => handleMoveBot(game.gameId, botCol, io, username), 300);
    }
}

async function handleMoveBot(gameId, col, io, human) {
    const game = getGame(gameId);
    if (!game) return;

    const row = dropDisc(game.board, col, "BOT");
    if (row === -1) return;

    game.moves.push({ player: "BOT", col, row });
    game.currentTurn = game.players.find(p => p !== "BOT");

    if (checkWin(game.board, row, col, "BOT")) {
        await finishGame(io, game, "BOT");
        return;
    }

    if (isDraw(game.board)) {
        await finishGame(io, game, "DRAW");
        return;
    }

    emitToPlayers(io, game, "GAME_UPDATE", game);
}

module.exports = { handleJoin, handleMove };
