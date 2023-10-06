import Referee from "./Referee.js";

const boardDimension = 8;

export default class BishopReferee extends Referee {
    isValidMove(currentColumn, toMoveColumn, team) {
        let isValid = false;
        for (let i = 1; i < boardDimension; ++i) {
            // UP RIGHT
            if (toMoveColumn.x - currentColumn.x === i && toMoveColumn.y - currentColumn.y === i) {
                isValid = true;
                break;
            }
            // BOTTOM RIGHT
            if (toMoveColumn.x - currentColumn.x === i && toMoveColumn.y - currentColumn.y === -i) {
                isValid = true;
                break;
            }
            // TOP LEFT
            if (toMoveColumn.x - currentColumn.x === -i && toMoveColumn.y - currentColumn.y === i) {
                isValid = true;
                break;
            }
            // BOTTOM LEFT
            if (toMoveColumn.x - currentColumn.x === -i && toMoveColumn.y - currentColumn.y === -i) {
                isValid = true;
                break;
            }
        }

        return isValid && (!this.isOccupied(toMoveColumn) || this.occupiedBy(toMoveColumn).team !== team);
    }
}