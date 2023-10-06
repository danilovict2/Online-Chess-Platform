import Referee from "./Referee.js";

export default class KnightReferee extends Referee {
    isValidMove(currentColumn, toMoveColumn, team) {
        let isValid = false;
        if (currentColumn.y - toMoveColumn.y === 2 || currentColumn.y - toMoveColumn.y === -2) {
            isValid = currentColumn.x - toMoveColumn.x === 1 || currentColumn.x - toMoveColumn.x === -1;
        } else if (currentColumn.x - toMoveColumn.x === 2 || currentColumn.x - toMoveColumn.x === -2) {
            isValid = currentColumn.y - toMoveColumn.y === 1 || currentColumn.y - toMoveColumn.y === -1;
        }

        return isValid && (!this.isOccupied(toMoveColumn) || this.occupiedBy(toMoveColumn).team !== team);
    }
}