import BishopReferee from "./BishopReferee.js";
import Referee from "./Referee.js";
import RookReferee from "./RookReferee.js";

export default class QueenReferee extends Referee {
    isValidMove(startTile, toMoveTile, team) {
        let rookReferee = new RookReferee(), bishopReferee = new BishopReferee();
        // Implemented like this because queen is basically a combination of a bishop and a rook
        return rookReferee.isValidMove(startTile, toMoveTile, team) || bishopReferee.isValidMove(startTile, toMoveTile, team);
    }
}