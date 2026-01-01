const { dropDisc, checkWin, isDraw } = require("./boardLogic");

const MAX_COLS = 7;
const MAX_ROWS = 6;

function getBotMove(board, bot, human) {
    // Try immediate win/block first (fast tactical checks)
    for (let col = 0; col < MAX_COLS; col++) {
        const clone = cloneBoard(board);
        const row = dropDisc(clone, col, bot);
        if (row !== -1 && checkWin(clone, row, col, bot)) return col;
    }

    for (let col = 0; col < MAX_COLS; col++) {
        const clone = cloneBoard(board);
        const row = dropDisc(clone, col, human);
        if (row !== -1 && checkWin(clone, row, col, human)) return col;
    }

    // Use minimax with alpha-beta for deeper planning
    const DEPTH = 4; // reasonable depth for responsiveness
    const { column } = minimax(board, DEPTH, -Infinity, Infinity, true, bot, human);
    if (column !== null && column !== undefined) return column;

    // fallback
    return getBestColumn(board);
}

function minimax(board, depth, alpha, beta, maximizingPlayer, bot, human) {
    const validCols = getValidMoves(board);
    const isTerminal = isTerminalNode(board, bot, human, validCols);

    if (depth === 0 || isTerminal) {
        const score = evaluateBoard(board, bot, human);
        return { score, column: null };
    }

    if (maximizingPlayer) {
        let value = -Infinity;
        let bestCol = validCols[0] || null;
        for (const col of validCols) {
            const clone = cloneBoard(board);
            const row = dropDisc(clone, col, bot);
            if (row === -1) continue;
            if (checkWin(clone, row, col, bot)) return { score: 1000000, column: col };
            const newScore = minimax(clone, depth - 1, alpha, beta, false, bot, human).score;
            if (newScore > value) {
                value = newScore;
                bestCol = col;
            }
            alpha = Math.max(alpha, value);
            if (alpha >= beta) break;
        }
        return { score: value, column: bestCol };
    } else {
        let value = Infinity;
        let bestCol = validCols[0] || null;
        for (const col of validCols) {
            const clone = cloneBoard(board);
            const row = dropDisc(clone, col, human);
            if (row === -1) continue;
            if (checkWin(clone, row, col, human)) return { score: -1000000, column: col };
            const newScore = minimax(clone, depth - 1, alpha, beta, true, bot, human).score;
            if (newScore < value) {
                value = newScore;
                bestCol = col;
            }
            beta = Math.min(beta, value);
            if (alpha >= beta) break;
        }
        return { score: value, column: bestCol };
    }
}

function isTerminalNode(board, bot, human, validCols) {
    // Terminal if someone has a connect or no valid moves
    if (validCols.length === 0) return true;
    // quick check: test if any immediate win exists for either
    for (const col of validCols) {
        const clone1 = cloneBoard(board);
        const r1 = dropDisc(clone1, col, bot);
        if (r1 !== -1 && checkWin(clone1, r1, col, bot)) return true;
        const clone2 = cloneBoard(board);
        const r2 = dropDisc(clone2, col, human);
        if (r2 !== -1 && checkWin(clone2, r2, col, human)) return true;
    }
    return false;
}

function getValidMoves(board) {
    const moves = [];
    for (let c = 0; c < MAX_COLS; c++) {
        if (board[0][c] === null) moves.push(c);
    }
    // Prefer center-out ordering to improve pruning
    const center = Math.floor(MAX_COLS / 2);
    moves.sort((a, b) => Math.abs(center - a) - Math.abs(center - b));
    return moves;
}

function evaluateBoard(board, bot, human) {
    let score = 0;

    // center column preference
    const centerCol = Math.floor(MAX_COLS / 2);
    for (let r = 0; r < MAX_ROWS; r++) {
        if (board[r][centerCol] === bot) score += 3;
        else if (board[r][centerCol] === human) score -= 3;
    }

    // score windows of 4
    const WINDOW_SIZE = 4;
    for (let r = 0; r < MAX_ROWS; r++) {
        for (let c = 0; c < MAX_COLS - 3; c++) {
            const window = [board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]];
            score += evaluateWindow(window, bot, human);
        }
    }

    // vertical
    for (let c = 0; c < MAX_COLS; c++) {
        for (let r = 0; r < MAX_ROWS - 3; r++) {
            const window = [board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]];
            score += evaluateWindow(window, bot, human);
        }
    }

    // diag right
    for (let r = 0; r < MAX_ROWS - 3; r++) {
        for (let c = 0; c < MAX_COLS - 3; c++) {
            const window = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
            score += evaluateWindow(window, bot, human);
        }
    }

    // diag left
    for (let r = 0; r < MAX_ROWS - 3; r++) {
        for (let c = 3; c < MAX_COLS; c++) {
            const window = [board[r][c], board[r+1][c-1], board[r+2][c-2], board[r+3][c-3]];
            score += evaluateWindow(window, bot, human);
        }
    }

    return score;
}

function evaluateWindow(window, bot, human) {
    const botCount = window.filter(x => x === bot).length;
    const humanCount = window.filter(x => x === human).length;
    const emptyCount = window.filter(x => x === null).length;
    if (botCount > 0 && humanCount > 0) return 0; // contested window

    if (botCount === 4) return 100000;
    if (botCount === 3 && emptyCount === 1) return 100;
    if (botCount === 2 && emptyCount === 2) return 10;

    if (humanCount === 4) return -100000;
    if (humanCount === 3 && emptyCount === 1) return -100;
    if (humanCount === 2 && emptyCount === 2) return -10;

    return 0;
}

function getBestColumn(board) {
    const center = Math.floor(MAX_COLS / 2);
    if (board[0][center] === null) return center;
    for (let i = 0; i < MAX_COLS; i++) {
        if (board[0][i] === null) return i;
    }
    return 0;
}

function cloneBoard(board) {
    return board.map(r => [...r]);
}

module.exports = { getBotMove };
