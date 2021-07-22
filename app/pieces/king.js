'use strict';
const { GenericPiece } = require('./piece');

class King extends GenericPiece {
    constructor(x, y, colour) {
        super(x, y, colour);
        this.symbol = this.colour === 'Black' ? '\u2654' : '\u265A';
        this.name = 'king';
        this.firstMove = true;
    }

    moveAllowed(x, y) {
        if (this.sameColour(x, y)) {
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
