'use strict';
const { GenericPiece } = require('./piece');
const { getPieces } = require('../util/board');

class King extends GenericPiece {
    constructor(x, y, colour) {
        super(x, y, colour);
        this.symbol = this.colour === 'Black' ? '\u2654' : '\u265A';
        this.name = 'king';
        this.firstMove = true;
    }

    check(x=this._x, y=this._y) {
        const enemyColour = this.colour === 'Black' ? 'White' : 'Black';
        const enemyPieces = getPieces(enemyColour);
        for (const piece of enemyPieces) {
            if (piece.moveAllowed(x, y)) {
                return true;
            }
        }
        return false;
    }

    checkmate() {
        const max_x = (this._x === 7) ? 7 : this._x + 1;
        const min_x = (this._x === 0) ? 0 : this._x - 1;
        const max_y = (this._y === 7) ? 7 : this._y + 1;
        const min_y = (this._y === 0) ? 0 : this._y - 1;
        // Check nowhere to move 
        for (let y = min_y; y <= max_y; y++) {
            for (let x = min_x; x <= max_x; x++) {
                if (this.moveAllowed(x, y)) {
                    return false;
                }
            }
        }
        // TODO: check if piece holding check can be taken
        return true;
    }

    moveAllowed(x, y) {
        if (this.sameColour(x, y)) {
            return false;
        }
        if (this.check(x, y)) {
            return false;
        }
        // King can only move to adjacent squares
        if (Math.abs(x-this._x) <=1 &&Math.abs(y-this._y) <= 1) {
            return true;
        }
        return false;
    }

}

module.exports = {
    King: King
};
