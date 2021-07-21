'use strict';
const { Empty } = require('../pieces/empty');
const { str_to_index } = require('./mappings');

let board = [];
let notification = '';

/**
 * Returns the piece object at an input letter coordinate
 * @param {string} coord 
 */
function getBoard(coord) {
    if (typeof coord === 'string') {
        const [letter, num] = coord.split('');
        return board[str_to_index.Y_MAP(num)][str_to_index.X_MAP(letter)];
    } else {
        return board[coord.y][coord.x];
    } 
}

/**
 * Moves a pieces from a starting coord (x.from, y.from) to a new one (x.to, y.to)
 *  Updates the notification if a piece was taken
 * 
 * @param {Object} coord 
 */
function setBoard({x, y}) {
    const space = board[y.to][x.to];
    board[y.to][x.to] = board[y.from][x.from];

    if (space instanceof Empty) {
        board[y.from][x.from] = space;
    } else {
        setNotification(`${space.colour}'s ${space.name} was taken`);
        board[y.from][x.from] = new Empty();
    }
}

/**
 * Print current stored notification to console if there is one
 */
function showNotification () {
    if (notification !== '') {
        console.log(notification);
    }
}

/**
 * Setter for the notification, exposed as an export
 */
function setNotification(msg) {
    notification = msg;
}

module.exports = {
    board: board,
    showNotification: showNotification,
    setNotification: setNotification,
    getBoard: getBoard,
    setBoard: setBoard,
};
