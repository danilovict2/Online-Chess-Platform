import Referee from "./Referee.js";

export default class PawnReferee extends Referee {
    isValidMove(currentColumn, toMoveColumn, team) {
        const direction = (team === 'w') ? 1 : -1;
        const startingSquare = (team === 'w') ? 2 : 7;

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
        return false;
    }
};