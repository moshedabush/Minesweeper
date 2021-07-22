'use strict'
var bombsLocation = [];
var elBtnReset = document.querySelector('.reset');
var gFirstClick = true;

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className}" oncontextmenu="flags(this, ${i},${j});return false;" onclick=
            "cellClicked(this, ${i}, ${j})"</td>`;
            // strHTML += `<td class="${className}" onclick=
            // "cellClicked(this, ${i}, ${j})"</td>`;
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