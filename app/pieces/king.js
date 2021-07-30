'use strict';
const { GenericPiece } = require('./piece');
const { getPieces, getChecking } = require('../util/board');

class King extends GenericPiece {
    constructor(x, y, colour) {
        super(x, y, colour);
        this.symbol = this.colour === 'Black' ? '\u2654' : '\u265A';
        this.name = 'king';
    }

    check(x=this._x, y=this._y) {
        const enemyPieces = getPieces(this.enemyColour);
        for (const piece of enemyPieces) {
            // console.log(piece.name);
            if (piece.alive && piece.moveAllowed(x, y)) {
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
        console.log('done move check');
        // Check if piece holding check can be taken
        const checking = getChecking();
        console.log(checking);
        for (const piece of getPieces(this.colour)) {
            if (piece.alive && piece.moveAllowed(checking._x, checking._y)) {
                return false;
            }
        }
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
