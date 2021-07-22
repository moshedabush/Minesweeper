'use strict'
var bombsLocation = [];
var elBtnReset = document.querySelector('.resetbtn');
var elBtnLives = document.querySelector('.livesbtn');
var elBtnMines = document.querySelector('.minesbtn');
var elBtnTimer = document.querySelector('.timer');
var elBestEasy = document.querySelector('.easy');
var elBestMedium = document.querySelector('.medium');
var elBestPro = document.querySelector('.pro');
var gFirstClick = true;
var gIntervalID;
var gMinesLeft;
var gBestResTimer;

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className}" oncontextmenu="flags(this, ${i},${j});return false;" onclick=
            "cellClicked(this, ${i}, ${j})"</td>`;
        }
        strHTML += '</tr>';
    }
    document.querySelector('.board').innerHTML = strHTML;
}

function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerHTML = value;
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

function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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

function timer() {
    var start = Date.now();
    gBestResTimer = null;
    gIntervalID = setInterval(function () {
    var currentTime = new Date();
    var timeElapsed = new Date(currentTime - start);
    var min = timeElapsed.getUTCMinutes();
    var sec = timeElapsed.getUTCSeconds();
    gGame.secsPassed = sec;
    var ms = timeElapsed.getUTCMilliseconds();
    elBtnTimer.innerHTML =
    (min > 9 ? min + ':' : min > 0 ? '0' + min + ':' : '') +
    (sec > 9 ? sec : '0' + sec) + '.' +
    (ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms);
    gBestResTimer = `${min}.${sec}`;
}, 15);
}