import Referee from "./Referee.js";

export default class KnightReferee extends Referee {
    isValidMove(currentTile, toMoveTile, team) {
        let isValid = false;
        if (currentTile.y - toMoveTile.y === 2 || currentTile.y - toMoveTile.y === -2) {
            isValid = currentTile.x - toMoveTile.x === 1 || currentTile.x - toMoveTile.x === -1;
        } else if (currentTile.x - toMoveTile.x === 2 || currentTile.x - toMoveTile.x === -2) {
            isValid = currentTile.y - toMoveTile.y === 1 || currentTile.y - toMoveTile.y === -1;
        }

        return isValid && (!this.isOccupied(toMoveTile) || this.occupiedBy(toMoveTile).team !== team);
    }
}