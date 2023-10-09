import Referee from "./Referee.js";
import { board } from "../../stores/board.js";

export default class PawnReferee extends Referee {
    isValidMove(currentdTile, toMovedTile, team) {
        const direction = (team === 'w') ? 1 : -1;
        const specialRow = (team === 'w') ? 2 : 7;

        // Movement Logic
        if (currentdTile.x === toMovedTile.x && !this.isOccupied(toMovedTile)) {
            if (toMovedTile.y - currentdTile.y === direction) {
                return true;
            } else if (toMovedTile.y - currentdTile.y === 2 * direction &&
                currentdTile.y === specialRow &&
                !this.isOccupied({ x: toMovedTile.x, y: currentdTile.y + direction })
            ) {
                return true;
            }
        }

        // Attacking logic
        if (toMovedTile.y - currentdTile.y === direction && this.isOccupied(toMovedTile) && this.occupiedBy(toMovedTile).team !== team) {
            if (currentdTile.x - toMovedTile.x === -1 || currentdTile.x - toMovedTile.x === 1) {
                return true;
            }
        }
        return false;
    }

    isEnPassant(currentdTile, toMovedTile, team) {
        const direction = (team === 'w') ? 1 : -1;
        if (toMovedTile.y - currentdTile.y === direction) {
            if (toMovedTile.x - currentdTile.x === -1 || toMovedTile.x - currentdTile.x === 1) {
                const piece = board.pieces.find(p => p.x === toMovedTile.x && p.y === toMovedTile.y - direction && p.enPassant);
                if (piece) {
                    return true;
                }
            }
        }

        return false;
    }
};