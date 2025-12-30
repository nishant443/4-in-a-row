const { dropDisc, checkWin } = require("./boardLogic");

function getBotMove(board, bot, human) {
    for (let col = 0; col < 7; col++) {
        const clone = cloneBoard(board);
        const row = dropDisc(clone, col, bot);
        if (row !== -1 && checkWin(clone, row, col, bot)) return col;
    }

    for (let col = 0; col < 7; col++) {
        const clone = cloneBoard(board);
        const row = dropDisc(clone, col, human);
        if (row !== -1 && checkWin(clone, row, col, human)) return col;
    }

    return getBestColumn(board);
}

function getBestColumn(board) {
    const center = 3;
    if (board[0][center] === null) return center;

    for (let i = 0; i < 7; i++) {
        if (board[0][i] === null) return i;
    }
}

function cloneBoard(board) {
    return board.map(r => [...r]);
}

module.exports = { getBotMove };
