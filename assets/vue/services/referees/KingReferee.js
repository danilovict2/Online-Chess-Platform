import Referee from "./Referee.js";

export default class KingReferee extends Referee {
    isValidMove(currentTile, toMoveTile, team) {
        const directionX = (toMoveTile.x < currentTile.x) ? -1 : (toMoveTile.x > currentTile.x) ? 1 : 0;
        const directionY = (toMoveTile.y < currentTile.y) ? -1 : (toMoveTile.y > currentTile.y) ? 1 : 0;
        return currentTile.x + directionX === toMoveTile.x && currentTile.y + directionY === toMoveTile.y && 
            (!this.isOccupied(toMoveTile) || this.occupiedBy(toMoveTile).team !== team);
    }
}