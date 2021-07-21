'use strict';
const readline = require('readline');

const display = require('./display');
const { getBoard } = require('./util/board');

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Runs a single turn of an input player:
 *  - asks the player for a move
 *  - moves the piece to the requested space
 *  - updates the board array with the move and prints it
 * 
 * Errors such as an invalid coordinate are handled by printing the error message and
 *  restarting the turn
 * 
 * @param {string} player 
 */
async function turn(player) {
    let waiting = true;
    while (waiting) {
        try {
            const move = await askPlayer(player);
            const piece = getBoard(move[0]);
            if (piece.colour === player) {
                // Check the piece can move there and set its position
                piece.setCoords(move[1], player);
                display.drawBoard();
                waiting = false;
            } else {
                console.log('Not one of your pieces');
            }
        } catch (err) {
            console.log(err.message);
        }
    } 
}

/**
 * Asynchronous wrapper to readline interface question function: takes an input letter/num
 *  coordinate and checks if it is syntactically valid.
 * 
 * @param {string} player 
 * @returns {string}
 */
async function askPlayer(player) {
    return new Promise((res, rej) => {
        reader.question(`${player}'s turn:\n`, move => {
            if (move.length === 5) {
                try {
                    res(move.split(' '));
                } catch {
                    rej(new Error('Invalid move'));
                }
            } else {
                rej(new Error('Invalid move'));
            }
        });
    });
}

module.exports = {
    turn: turn
};
