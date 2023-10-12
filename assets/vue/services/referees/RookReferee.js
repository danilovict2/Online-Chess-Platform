import { BOARD_DIMENSION } from "../../common/constants.js";
import Referee from "./Referee.js";

export default class RookReferee extends Referee {
    isValidMove(startTile, toMoveTile, team) {
        if (startTile.x !== toMoveTile.x && startTile.y !== toMoveTile.y) {
            return false;
        }

        let currentTile = null;
        for (let i = 1; i < BOARD_DIMENSION; ++i) {
            // UP
            if (toMoveTile.y > startTile.y) {
                currentTile = {x: startTile.x, y: startTile.y + i};
            }
            // DOWN
            if (toMoveTile.y < startTile.y) {
                currentTile = {x: startTile.x, y: startTile.y - i};
            }
            // RIGHT
            if (toMoveTile.x > startTile.x) {
                currentTile = {x: startTile.x + i, y: startTile.y};
            }
            // LEFT
            if (toMoveTile.x < startTile.x) {
                currentTile = {x: startTile.x - i, y: startTile.y};
            }

            if (!currentTile) {
                return false;
            }
            if (currentTile.x === toMoveTile.x && currentTile.y === toMoveTile.y && (!this.isOccupied(toMoveTile) || this.occupiedBy(toMoveTile).team !== team)) {
                return true;
            } else if (this.isOccupied(currentTile)) {
                return false;
            }
        }

        return false;
    }
}