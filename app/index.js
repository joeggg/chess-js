'use strict';
const display = require('./display');
const player = require('./player');

// Program entry point, sets up the initial board and starts the game
function launch() {
    display.setupBoard();
    display.drawBoard();
    run();
}

// Main game loop, 2 player only currently
async function run() {
    while (true) {
        try {
            await player.turn('White');
            // await player.turn('Black');
        } catch(err) {
            console.log(err.stack);
        }
    }
}

launch();
