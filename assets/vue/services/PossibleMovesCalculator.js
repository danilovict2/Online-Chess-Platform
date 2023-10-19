import { createRefereeForType, getEnemyPieces, getKingOfTeam, samePosition } from "../common/helpers.js";
import { board } from "../stores/board.js";

export default class PossibleMovesCalculator {
    calculatePossibleMovesForPiece(piece) {
        let possibleMoves = createRefereeForType(piece.type).getPossibleMoves(piece);
        let possibleMovesThatEndangerTheKing = this.findPossibleMovesThatEndangerTheKing(possibleMoves, piece);
        return possibleMoves.filter(move => !possibleMovesThatEndangerTheKing.some(m => m === move));
    }
    
    findPossibleMovesThatEndangerTheKing(possibleMoves, piece) {
        let possibleMovesThatEndangerTheKing = [];
        const currentPieceState = new Map(board.pieces);

        for (const move of possibleMoves) {
            board.pieces = this.createSimulatedBoardPiecesForMove(move, piece);
            const king = getKingOfTeam(piece.team);
    
            if (this.canEnemyPieceCaptureKing(king)) {
                possibleMovesThatEndangerTheKing.push(move);
            }
            board.pieces = currentPieceState;
        }
        return possibleMovesThatEndangerTheKing;
    }
    
    createSimulatedBoardPiecesForMove(move, piece) {
        const simulatedBoardPieces = board.clonePieces();
        if (simulatedBoardPieces.has(`${move.x}-${move.y}`)) {
            simulatedBoardPieces.delete(`${move.x}-${move.y}`);
        }
    
        const simulatedPiece = simulatedBoardPieces.get(`${piece.x}-${piece.y}`);
        simulatedBoardPieces.delete(`${piece.x}-${piece.y}`);

        [simulatedPiece.x, simulatedPiece.y] = [move.x, move.y];
        simulatedBoardPieces.set(`${simulatedPiece.x}-${simulatedPiece.y}`, simulatedPiece);
    
        return simulatedBoardPieces;
    }
    
    canEnemyPieceCaptureKing(king) {
        let enemyPieces = getEnemyPieces(king.team);
        return enemyPieces.some(p => {
            const possibleMoves = createRefereeForType(p.type).getPossibleMoves(p);
            if (p.type === 'Pawn' && possibleMoves.some(m => m.x !== p.x && samePosition(m, king))) {
                return true;
            } else if (possibleMoves.some(m => samePosition(m, king))) {
                return true;
            }
            return false;
        });
    }
}