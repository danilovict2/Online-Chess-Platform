import { BOARD_DIMENSION } from "../../common/constants.js";
import Referee from "./Referee.js";

export default class BishopReferee extends Referee {
    isValidMove(startTile, toMoveTile, team) {
        if (this.isOccupied(toMoveTile) && this.occupiedBy(toMoveTile).team === team) {
            return false;
        }

        let currentTile = null;
        for (let i = 1; i < BOARD_DIMENSION; ++i) {
            //UP RIGHT
            if (toMoveTile.x > startTile.x && toMoveTile.y > startTile.y) {
                currentTile = {x: startTile.x + i, y: startTile.y + i};
            }
            //BOTTOM RIGHT
            if (toMoveTile.x > startTile.x && toMoveTile.y < startTile.y) {
                currentTile = {x: startTile.x + i, y: startTile.y - i};
            }
            //TOP LEFT
            if (toMoveTile.x < startTile.x && toMoveTile.y > startTile.y) {
                currentTile = {x: startTile.x - i, y: startTile.y + i};
            }
            //BOTTOM LEFT
            if (toMoveTile.x < startTile.x && toMoveTile.y < startTile.y) {
                currentTile = {x: startTile.x - i, y: startTile.y - i};
            }

            if (!currentTile) {
                return false;
            }
            if (currentTile.x === toMoveTile.x && currentTile.y === toMoveTile.y) {
                return true;
            } else if (this.isOccupied(currentTile)) {
                return false;
            }
        }
        
        return false;
    }
}