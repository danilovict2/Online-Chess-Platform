import Referee from "./Referee.js";

export default class KingReferee extends Referee {
    isValidMove(startTile, toMoveTile, team) {
        const directionX = (toMoveTile.x < startTile.x) ? -1 : (toMoveTile.x > startTile.x) ? 1 : 0;
        const directionY = (toMoveTile.y < startTile.y) ? -1 : (toMoveTile.y > startTile.y) ? 1 : 0;
        return startTile.x + directionX === toMoveTile.x && startTile.y + directionY === toMoveTile.y && 
            (!this.isOccupied(toMoveTile) || this.occupiedBy(toMoveTile).team !== team);
    }
}