import { BOARD_DIMENSION } from "../../common/constants.js";
import Referee from "./Referee.js";

export default class BishopReferee extends Referee {
    isValidMove(currentTile, toMoveTile, team) {
        let isValid = false;
        for (let i = 1; i < BOARD_DIMENSION; ++i) {
            // UP RIGHT
            if (toMoveTile.x - currentTile.x === i && toMoveTile.y - currentTile.y === i) {
                isValid = true;
                break;
            }
            // BOTTOM RIGHT
            if (toMoveTile.x - currentTile.x === i && toMoveTile.y - currentTile.y === -i) {
                isValid = true;
                break;
            }
            // TOP LEFT
            if (toMoveTile.x - currentTile.x === -i && toMoveTile.y - currentTile.y === i) {
                isValid = true;
                break;
            }
            // BOTTOM LEFT
            if (toMoveTile.x - currentTile.x === -i && toMoveTile.y - currentTile.y === -i) {
                isValid = true;
                break;
            }
        }

        return isValid && (!this.isOccupied(toMoveTile) || this.occupiedBy(toMoveTile).team !== team);
    }
}