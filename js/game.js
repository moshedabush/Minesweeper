'use strict'

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';

var gBoard;
var gWin = 14;
var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    gGame.isOn = true;
    resetGameStats();
}

function resetGameStats() {
    elBtnReset.innerHTML = '🙂';
    gWin = (gLevel.size * gLevel.size) - gLevel.mines;
    gFirstClick = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    if (gFirstClick) {
        createMines(i, j);
        gFirstClick = false;
    }
    var cell = gBoard[i][j];
    elCell.classList.add('selected');
    if (cell.isMine) {
        elCell.classList.add('gameOver');
        renderMines(gLevel.mines, MINE)
        elBtnReset.innerHTML = '😵';
        gGame.isOn = false;
        return;
    }
    gGame.shownCount++;
    cell.isShown = true;
    cell.isMarked = false;
    if (checkGameOver()) return;
    var minesAround = setMinesNegsCount(i, j);
    if (!minesAround) {
        // expandShown(elCell, i, j);
        return;
    }
    cell.minesAroundCount = minesAround;
    renderCell(i, j, minesAround);
}

function checkGameOver() {
    if (gGame.shownCount === gWin &&
        gLevel.mines === gGame.markedCount) {
        elBtnReset.innerHTML = '🥳';
        gGame.isOn = false;
        return true;
    }
}

function buildBoard() {
    var size = gLevel.size;
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    return board;
}

function flags(elFlag, i, j) {
    var flag = gBoard[i][j];
    if (flag.isShown) {
        return;
    }
    if (flag.isMarked) {
        gGame.markedCount--;
        flag.isMarked = false;
        renderCell(i, j, EMPTY);
        return;
    }
    flag.isMarked = true;
    gGame.markedCount++;
    renderCell(i, j, FLAG);
    checkGameOver();
}

function selectedLevel(size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;
    gWin = (size * size) - mines;
    initGame();
}

function setMinesNegsCount(cellI, cellJ) {
    var nearMinesCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) nearMinesCount++;
        }
    }
    return nearMinesCount;
}

function createMines(i, j) {
    var minesNum = gLevel.mines;
    for (var d = 0; d < minesNum; d++) {
        var cell = gBoard[getRandomIntInt(0, gBoard.length - 1)]
        [getRandomIntInt(0, gBoard.length - 1)];
        if (cell.isMine || cell === gBoard[i][j]) {
            d--;
            continue;
        }
        cell.isMine = true;
    }
}

// function expandShown(elCell, cellI, cellJ) {

//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         var nearMinesCount = 0;
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >= gBoard[i].length) continue;
//             if (i === cellI && j === cellJ) continue;
//             if (gBoard[i][j].isMine) nearMinesCount++;
//             if(!nearMinesCount){
//                  cellClicked(elCell, i, j);

//             }
//         }
//     }
// }