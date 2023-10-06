import Referee from "./Referee.js";
import { board } from "../../stores/board.js";

export default class PawnReferee extends Referee {
    isValidMove(currentColumn, toMoveColumn, team) {
        const direction = (team === 'w') ? 1 : -1;
        const startingSquare = (team === 'w') ? 2 : 7;

        // Movement Logic
        if (currentColumn.x === toMoveColumn.x && !this.isOccupied(toMoveColumn)) {
            if (toMoveColumn.y - currentColumn.y === direction) {
                return true;
            } else if (toMoveColumn.y - currentColumn.y === 2 * direction &&
                currentColumn.y === startingSquare &&
                !this.isOccupied({ x: toMoveColumn.x, y: currentColumn.y + direction })
            ) {
                return true;
            }
        }

        // Attacking logic
        if (toMoveColumn.y - currentColumn.y === direction && this.isOccupied(toMoveColumn) && this.occupiedBy(toMoveColumn).team !== team) {
            if (currentColumn.x - toMoveColumn.x === -1 || currentColumn.x - toMoveColumn.x === 1) {
                return true;
            }
        }
        return false;
    }

    isEnPassant(currentColumn, toMoveColumn, team) {
        const direction = (team === 'w') ? 1 : -1;
        if (toMoveColumn.y - currentColumn.y === direction) {
            if (toMoveColumn.x - currentColumn.x === -1 || toMoveColumn.x - currentColumn.x === 1) {
                const piece = board.pieces.find(p => p.x === toMoveColumn.x && p.y === toMoveColumn.y - direction && p.enPassant);
                if (piece) {
                    return true;
                }
            }
        }

        return false;
    }
};