import Referee from "./Referee.js";

export default class KingReferee extends Referee {
    isValidMove(currentColumn, toMoveColumn, team) {
        const directionX = (toMoveColumn.x < currentColumn.x) ? -1 : (toMoveColumn.x > currentColumn.x) ? 1 : 0;
        const directionY = (toMoveColumn.y < currentColumn.y) ? -1 : (toMoveColumn.y > currentColumn.y) ? 1 : 0;
        return currentColumn.x + directionX === toMoveColumn.x && currentColumn.y + directionY === toMoveColumn.y && 
            (!this.isOccupied(toMoveColumn) || this.occupiedBy(toMoveColumn).team !== team);
    }
}