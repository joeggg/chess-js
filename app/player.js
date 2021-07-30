'use strict';
const readline = require('readline');

const display = require('./display');
const { Empty } = require('./pieces/empty');
const { Rook } = require('./pieces/rook');
const { getBoard, getPieces, setChecking } = require('./util/board');

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let check = {
    White: false,
    Black: false
};

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
    let piece = null;
    while (waiting) {
        try {
            const move = await askPlayer(player);
            piece = getBoard(move[0]);
            if (piece.colour === player) {
                // Handle castling
                if (move[1] === 'castle') {
                    if (piece instanceof Rook) {
                        piece.castle();
                    } else {
                        throw new Error('Piece not a rook');
                    }
                } 
                // Handle regular move
                else {
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
    handleChecks(player, piece);
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

/**
 * Checks for the changing of a check status this move
 */
function handleChecks(player, piece) {
    // Handle new check on enemy
    const enemyColour = piece.enemyColour;
    if (getPieces(enemyColour)[4].check()) {    // 4 = king
        setChecking(piece);
        if (getPieces(enemyColour)[4].checkmate()) {
            throw new Error(`Checkmate ${enemyColour}!`);
        }
        console.log(`${enemyColour} in check!`);
        check[enemyColour] = true;
    }
    // Handle leaving check
    if (!(getPieces(player)[4].check())) {
        check[player] = false;
    }
}

module.exports = {
    turn: turn
};
