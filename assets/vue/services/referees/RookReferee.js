import { BOARD_DIMENSION } from "../../common/constants.js";
import Referee from "./Referee.js";

export default class RookReferee extends Referee {
    isValidMove(currentTile, toMoveTile, team) {
        if (currentTile.x !== toMoveTile.x && currentTile.y !== toMoveTile.y) {
            return false;
        }

        let isValid = false;
        for (let i = 1; i < BOARD_DIMENSION; ++i) {
            // UP-DOWN
            if (toMoveTile.y - currentTile.y === i || toMoveTile.y - currentTile.y === -i) {
                isValid = true;
                break;
            }
            // LEFT-RIGHT
            if (toMoveTile.x - currentTile.x === i || toMoveTile.x - currentTile.x === -i) {
                isValid = true;
                break;
            }
        }

        return isValid && (!this.isOccupied(toMoveTile) || this.occupiedBy(toMoveTile).team !== team);
    }
}