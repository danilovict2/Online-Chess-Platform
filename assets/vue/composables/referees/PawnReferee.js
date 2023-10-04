import Referee from "./Referee.js";

export default class PawnReferee extends Referee {
    isValidMove(currentColumn, toMoveColumn) {
        if (currentColumn.x === toMoveColumn.x) {
            if (toMoveColumn.y - currentColumn.y === 1) {
                return true;
            } else if (toMoveColumn.y - currentColumn.y === 2 && currentColumn.y === 2) {
                return true;
            }
        }
        return false;
    }
}