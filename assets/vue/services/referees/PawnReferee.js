import Referee from "./Referee.js";
import { board } from "../../stores/board.js";

export default class PawnReferee extends Referee {
    isValidMove(startTile, toMoveTile, team) {
        const direction = (team === 'w') ? 1 : -1;
        const specialRow = (team === 'w') ? 2 : 7;

        // Movement Logic
        if (startTile.x === toMoveTile.x && !this.isOccupied(toMoveTile)) {
            if (toMoveTile.y - startTile.y === direction) {
                return true;
            } else if (toMoveTile.y - startTile.y === 2 * direction &&
                startTile.y === specialRow &&
                !this.isOccupied({ x: toMoveTile.x, y: startTile.y + direction })
            ) {
                return true;
            }
        }

        // Attacking logic
        if (toMoveTile.y - startTile.y === direction && this.isOccupied(toMoveTile) && this.occupiedBy(toMoveTile).team !== team) {
            if (startTile.x - toMoveTile.x === -1 || startTile.x - toMoveTile.x === 1) {
                return true;
            }
        }
        
        return this.isEnPassant(startTile, toMoveTile, team);
    }

    isEnPassant(startTile, toMoveTile, team) {
        const direction = (team === 'w') ? 1 : -1;
        if (toMoveTile.y - startTile.y === direction) {
            if (toMoveTile.x - startTile.x === -1 || toMoveTile.x - startTile.x === 1) {
                const piece = board.pieces.get(`${toMoveTile.x}-${toMoveTile.y - direction}`);
                if (piece && piece.enPassant) {
                    return true;
                }
            }
        }

        return false;
    }
};