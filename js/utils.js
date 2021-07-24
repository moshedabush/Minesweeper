'use strict'

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className}" oncontextmenu="cellFlag(${i},${j});return false;" onclick=
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

function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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
    var elBtnTimer = document.querySelector('.timer');
    elBtnTimer.innerHTML =
    (min > 9 ? min + ':' : min > 0 ? '0' + min + ':' : '') +
    (sec > 9 ? sec : '0' + sec) + '.' +
    (ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms);
    gBestResTimer = `${min}.${sec}`;
}, 100);
}