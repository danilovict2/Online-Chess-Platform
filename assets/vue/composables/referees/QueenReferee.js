import BishopReferee from "./BishopReferee.js";
import Referee from "./Referee.js";
import RookReferee from "./RookReferee.js";

export default class QueenReferee extends Referee {
    isValidMove(currentColumn, toMoveColumn, team) {
        let rookReferee = new RookReferee(), bishopReferee = new BishopReferee();
        // Implemented like this because queen is basically a combination of a bishop and a rook
        return rookReferee.isValidMove(currentColumn, toMoveColumn, team) || bishopReferee.isValidMove(currentColumn, toMoveColumn, team);
    }
}