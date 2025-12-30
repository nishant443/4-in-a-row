function createEmptyBoard() {
    return Array.from({ length: 6 }, () => Array(7).fill(null));
}

function dropDisc(board, col, player) {
    for (let r = 5; r >= 0; r--) {
        if (!board[r][col]) {
            board[r][col] = player;
            return r;
        }
    }
    return -1;
}

function checkWin(board, row, col, player) {
    return (
        checkDirection(board, row, col, player, 0, 1) ||  // horizontal
        checkDirection(board, row, col, player, 1, 0) ||  // vertical
        checkDirection(board, row, col, player, 1, 1) ||  // diagonal
        checkDirection(board, row, col, player, 1, -1)
    );
}

function checkDirection(board, r, c, p, dr, dc) {
    let count = 1;

    count += countDiscs(board, r, c, p, dr, dc);
    count += countDiscs(board, r, c, p, -dr, -dc);

    return count >= 4;
}

function countDiscs(board, r, c, p, dr, dc) {
    let i = 1;
    let cnt = 0;

    while (
        r + dr * i >= 0 &&
        r + dr * i < 6 &&
        c + dc * i >= 0 &&
        c + dc * i < 7 &&
        board[r + dr * i][c + dc * i] === p
    ) {
        cnt++;
        i++;
    }

    return cnt;
}

function isDraw(board) {
    return board[0].every(cell => cell !== null);
}

module.exports = { createEmptyBoard, dropDisc, checkWin, isDraw };
