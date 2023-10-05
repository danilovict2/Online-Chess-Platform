import { board } from '../../stores/board.js';

export default class Referee {
    isValidMove() {
        throw new Error('isValidMove method should not be called from Referee class!');
    }

    isOccupied(tile) {
        return Boolean(board.pieces.find(piece => piece.x === tile.x && piece.y === tile.y));
    }
};