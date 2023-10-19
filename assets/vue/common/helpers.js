import BishopReferee from "../services/referees/BishopReferee";
import KingReferee from "../services/referees/KingReferee";
import KnightReferee from "../services/referees/KnightReferee";
import PawnReferee from "../services/referees/PawnReferee";
import QueenReferee from "../services/referees/QueenReferee";
import RookReferee from "../services/referees/RookReferee";
import { board } from "../stores/board.js";

export function createRefereeForType(type) {
    switch (type) {
        case 'Pawn':
            return new PawnReferee();
        case 'Knight':
            return new KnightReferee();
        case 'Bishop':
            return new BishopReferee();
        case 'Rook':
            return new RookReferee();
        case 'Queen':
            return new QueenReferee();
        case 'King':
            return new KingReferee();
        default:
            throw new Error('Invalid type');
    }
}

export function samePosition(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

export function getEnemyPieces(nonEnemyTeam) {
    let enemyPieces = [];
    board.pieces.forEach(piece => {
        if (piece.team !== nonEnemyTeam) {
            enemyPieces.push(piece);
        }
    });

    return enemyPieces;
}

export function getKingOfTeam(team) {
    let king = {};
    board.pieces.forEach(piece => {
        if (piece.type === 'King' && piece.team === team) {
            king = piece;
        }
    });

    return king;
}