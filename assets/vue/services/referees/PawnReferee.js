import Referee from "./Referee.js";
import { board } from "../../stores/board.js";

export default class PawnReferee extends Referee {
    isValidMove(currentTile, toMoveTile, team) {
        const direction = (team === 'w') ? 1 : -1;
        const specialRow = (team === 'w') ? 2 : 7;

        // Movement Logic
        if (currentTile.x === toMoveTile.x && !this.isOccupied(toMoveTile)) {
            if (toMoveTile.y - currentTile.y === direction) {
                return true;
            } else if (toMoveTile.y - currentTile.y === 2 * direction &&
                currentTile.y === specialRow &&
                !this.isOccupied({ x: toMoveTile.x, y: currentTile.y + direction })
            ) {
                return true;
            }
        }

        // Attacking logic
        if (toMoveTile.y - currentTile.y === direction && this.isOccupied(toMoveTile) && this.occupiedBy(toMoveTile).team !== team) {
            if (currentTile.x - toMoveTile.x === -1 || currentTile.x - toMoveTile.x === 1) {
                return true;
            }
        }
        
        return this.isEnPassant(currentTile, toMoveTile, team);
    }

    isEnPassant(currentTile, toMoveTile, team) {
        const direction = (team === 'w') ? 1 : -1;
        if (toMoveTile.y - currentTile.y === direction) {
            if (toMoveTile.x - currentTile.x === -1 || toMoveTile.x - currentTile.x === 1) {
                const piece = board.pieces.find(p => p.x === toMoveTile.x && p.y === toMoveTile.y - direction && p.enPassant);
                if (piece) {
                    return true;
                }
            }
        }

        return false;
    }
};