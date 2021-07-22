'use strict'

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';

var gBoard;
var gWin = 14;
var gLevel = {
    size: 4,
    mines: 2,
    lives: 1
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

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    if (gFirstClick) {
        createMines(i, j);
        timer();
        gFirstClick = false;
    }
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    elCell.classList.add('selected');
    if (cell.isMine) {
        renderCell(i, j, MINE);
        elCell.classList.add('mine');
        cell.isShown = true;
        gLevel.lives--;
        gMinesLeft--;
        gGame.markedCount++;
        if (!gLevel.lives) elBtnLives.innerHTML = "💔";
        else elBtnLives.innerHTML = `${gLevel.lives}💜`;
        elBtnMines.innerHTML = `${gMinesLeft}💣`;
        if (!gLevel.lives) {
            elCell.classList.add('mine');
            renderMines(gLevel.mines, MINE)
            clearInterval(gIntervalID);
            elBtnReset.innerHTML = '😵';
            gGame.isOn = false;
            return;
        }
    } else {
        var minesAround = setMinesNegsCount(i, j);
    }
    gGame.shownCount++;
    cell.isShown = true;
    cell.isMarked = false;
    if (checkGameOver()) return;
    if (!minesAround) {
        if (!cell.isMine) return expandShown(elCell, i, j);
    } else {
        cell.minesAroundCount = minesAround;
        renderCell(i, j, minesAround);
    }
}

function checkGameOver() {
    if (gGame.shownCount === gWin &&
        gLevel.mines === gGame.markedCount) {
        elBtnReset.innerHTML = '🥳';
        clearInterval(gIntervalID);
        if (gLevel.size === 4) elBestEasy.innerHTML = `Easy    ${gBestResTimer}`;
        if (gLevel.size === 8) elBestMedium.innerHTML = `Medium    ${gBestResTimer}`;
        if (gLevel.size === 12) elBestPro.innerHTML = `Pro   ${gBestResTimer}`;
        gGame.isOn = false;
        return true;
    }
}

function resetGameStats() {
    gWin = (gLevel.size * gLevel.size) - gLevel.mines;
    gFirstClick = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    clearInterval(gIntervalID);
    if (gLevel.size === 4) gLevel.lives = 1;
    if (gLevel.size === 8) gLevel.lives = 2;
    if (gLevel.size === 12) gLevel.lives = 3;
    elBtnReset.innerHTML = '🙂';
    if (gLevel.size === 4) logo(1);
    elBtnLives.innerHTML = `${gLevel.lives}💜`;
    elBtnMines.innerHTML = `${gLevel.mines}💣`;
    elBtnTimer.innerHTML = "00.000";
    gMinesLeft = gLevel.mines;
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

function expandShown(elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (!gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                if (gBoard[i][j].isShown) continue;
                if (gBoard[i][j].isMine) continue;
                if (gBoard[i][j].minesAroundCount === 0) cellClicked(elCell, i, j);
            }
        }
    }
}