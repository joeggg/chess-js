'use strict';
const readline = require('readline');

const display = require('./display');
const { Rook } = require('./pieces/rook');
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
                // Handle castling
                if (move[1] === 'castle') {
                    if (piece instanceof Rook) {
                        piece.castle();
                    } else {
                        throw new Error('Piece not a rook');
                    }
                } else {
                    // Check the piece can move there and set its position
                    piece.setCoords(move[1], player);
                }
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
            try {
                const [from, to] = move.split(' ');
                if (from.length === 2 && (to.length === 2 || to === 'castle')) {
                    res([from, to]);
                } else {
                    rej(new Error('Invalid move'));
                }
            } catch {
                rej(new Error('Invalid move'));
            }
        });
    });
}

module.exports = {
    turn: turn
};
