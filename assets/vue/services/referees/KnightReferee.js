import Referee from "./Referee.js";

export default class KnightReferee extends Referee {
    isValidMove(startTile, toMoveTile, team) {
        let isValid = false;
        if (startTile.y - toMoveTile.y === 2 || startTile.y - toMoveTile.y === -2) {
            isValid = startTile.x - toMoveTile.x === 1 || startTile.x - toMoveTile.x === -1;
        } else if (startTile.x - toMoveTile.x === 2 || startTile.x - toMoveTile.x === -2) {
            isValid = startTile.y - toMoveTile.y === 1 || startTile.y - toMoveTile.y === -1;
        }

        return isValid && (!this.isOccupied(toMoveTile) || this.occupiedBy(toMoveTile).team !== team);
    }
}