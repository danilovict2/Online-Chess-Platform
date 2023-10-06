import Referee from "./Referee.js";

const boardDimension = 8;
export default class RookReferee extends Referee {
    isValidMove(currentColumn, toMoveColumn, team) {
        if (currentColumn.x !== toMoveColumn.x && currentColumn.y !== toMoveColumn.y) {
            return false;
        }

        let isValid = false;
        for (let i = 1; i < boardDimension; ++i) {
            // UP-DOWN
            if (toMoveColumn.y - currentColumn.y === i || toMoveColumn.y - currentColumn.y === -i) {
                isValid = true;
                break;
            }
            // LEFT-RIGHT
            if (toMoveColumn.x - currentColumn.x === i || toMoveColumn.x - currentColumn.x === -i) {
                isValid = true;
                break;
            }
        }

        return isValid && (!this.isOccupied(toMoveColumn) || this.occupiedBy(toMoveColumn).team !== team);
    }
}