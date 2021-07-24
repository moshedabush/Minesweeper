'use strict'

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';
const audioWin = new Audio('sound/win.wav');
const audioLose = new Audio('sound/lose.wav');

var gBoard;
var gMinesLeft;
var gIntervalID;
var gBestResTimer;
var gFirstClick = true;
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
    var cell = gBoard[i][j];
    if (cell.isShown || cell.isMarked) return;
    if (gFirstClick) {
        createMines(i, j);
        timer();
        gFirstClick = false;
    }
    elCell.classList.add('selected');
    if (cell.isMine) {
        renderCell(i, j, MINE);
        elCell.classList.add('mine');
        cell.isShown = true;
        checkLifes(elCell);
        if (!gGame.isOn) return;
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

function checkLifes(elCell) {
    gLevel.lives--;
    gMinesLeft--;
    gGame.markedCount++;
    var elBtnLives = document.querySelector('.livesbtn');
    if (!gLevel.lives) elBtnLives.innerHTML = "💔";
    else elBtnLives.innerHTML = `${gLevel.lives}💜`;
    var elBtnMines = document.querySelector('.minesbtn');
    elBtnMines.innerHTML = `${gMinesLeft}💣`;
    if (!gLevel.lives) {
        elCell.classList.add('mine');
        renderMines(gLevel.mines, MINE)
        clearInterval(gIntervalID);
        var elBtnReset = document.querySelector('.resetbtn');
        elBtnReset.innerHTML = '😵';
        audioLose.play();
        gGame.isOn = false;
    }
}

function checkGameOver() {
    if (gGame.shownCount === gWin &&
        gLevel.mines === gGame.markedCount) {
        var elBtnReset = document.querySelector('.resetbtn');
        elBtnReset.innerHTML = '🥳';
        audioWin.play();
        clearInterval(gIntervalID);
        gGame.isOn = false;
        bestTime();
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
    if (gLevel.size === 12) gLevel.lives = 3; {
        var elBtnReset = document.querySelector('.resetbtn');
        elBtnReset.innerHTML = '🙂';
    }
    if (gLevel.size === 4) logo(1);
    var elBtnLives = document.querySelector('.livesbtn');
    elBtnLives.innerHTML = `${gLevel.lives}💜`;
    var elBtnMines = document.querySelector('.minesbtn');
    elBtnMines.innerHTML = `${gLevel.mines}💣`;
    var elBtnTimer = document.querySelector('.timer');
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

function cellFlag(i, j) {
    if (!gGame.isOn) return;
    var cellFlag = gBoard[i][j];
    if (cellFlag.isShown) {
        return;
    }
    if (cellFlag.isMarked) {
        gGame.markedCount--;
        cellFlag.isMarked = false;
        renderCell(i, j, EMPTY);
        return;
    }
    cellFlag.isMarked = true;
    gGame.markedCount++;
    renderCell(i, j, FLAG);
    checkGameOver();
}

function levels(size, mines) {
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
    var isMineCount = gLevel.mines;
    for (var d = 0; d < isMineCount; d++) {
        var cell = gBoard[getRandomIntInt(0, gBoard.length - 1)]
        [getRandomIntInt(0, gBoard.length - 1)];
        if (cell.isMine || cell === gBoard[i][j]) {
            isMineCount ++;
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

function renderMines(minesNum, value) {
    var countMines = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.innerHTML = value;
                countMines++;
                if (countMines === minesNum) return;
            }
        }
    }
}

function bestTime() {
    var elBestEasy = document.querySelector('.easy');
    var elBestMedium = document.querySelector('.medium');
    var elBestPro = document.querySelector('.pro');
    if (gLevel.size === 4) {
        if (localStorage.getItem("easy") === null) localStorage.setItem('easy', gBestResTimer);
        if (parseFloat(localStorage.getItem('easy')) > parseFloat(gBestResTimer)) localStorage.setItem('easy', gBestResTimer);
        elBestEasy.innerHTML = `Easy    ${localStorage.getItem('easy')}`;
    }
    if (gLevel.size === 8) {
        if (localStorage.getItem("medium") === null) localStorage.setItem('medium', gBestResTimer);
        if (parseFloat(localStorage.getItem('medium')) > parseFloat(gBestResTimer)) localStorage.setItem('medium', gBestResTimer);
        elBestMedium.innerHTML = `Medium    ${localStorage.getItem('medium')}`;
    }
    if (gLevel.size === 12) {
        if (localStorage.getItem("pro") === null) localStorage.setItem('pro', gBestResTimer);
        if (parseFloat(localStorage.getItem('pro')) > parseFloat(gBestResTimer)) localStorage.setItem('pro', gBestResTimer);
        elBestPro.innerHTML = `Pro    ${localStorage.getItem('pro')}`;
    }
}

function logo(num) {
    var elLogo = document.querySelector('.logo');
    if (num === 1) {
        elLogo.innerHTML = "<img src=\"img/easy.PNG\" width=\"11%\" height=\"11%\" opacity=\"0.95\";>"
    }
    if (num === 2) {
        elLogo.innerHTML = "<img src=\"img/med.PNG\" width=\"11%\" height=\"11%\" opacity=\"0.95\";>"
    }
    if (num === 3) {
        elLogo.innerHTML = "<img src=\"img/pro.PNG\" width=\"11%\" height=\"11%\" opacity=\"0.95\";>"
    }
}