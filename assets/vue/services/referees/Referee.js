import { BOARD_DIMENSION } from '../../common/constants.js';
import { board } from '../../stores/board.js';

export default class Referee {
    isValidMove(startTile, toMoveTile, team) {
        throw new Error('isValidMove method should not be called from Referee class!');
    }

    occupiedBy(tile) {
        return board.pieces.find(piece => piece.x === tile.x && piece.y === tile.y);
    }

    isOccupied(tile) {
        return Boolean(this.occupiedBy(tile));
    }

    isEnPassant() {
        return false;
    }

    getPossibleMoves(piece) {
        let possibleMoves = [];
        for (let j = BOARD_DIMENSION; j >= 1; --j) {
            for (let i = 1; i <= BOARD_DIMENSION; ++i) {
                if (this.isValidMove({x: piece.x, y: piece.y}, {x: i, y: j}, piece.team)) {
                    possibleMoves.push({x: i, y: j});
                }
            }
        }
        return possibleMoves;
    }
};