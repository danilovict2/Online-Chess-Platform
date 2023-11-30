import { getEnemyPieces, getKingOfTeam } from "../common/helpers.js";
import { board } from "../stores/board.js";
import PossibleMovesCalculator from './PossibleMovesCalculator.js';

export default class EndgameHandler {
    checkAndHandleEndgame(currentTeam) {
        const drawReason = this.getDrawReasonIfGameIsADraw();
        if (drawReason) {
            return `Draw by ${drawReason}`;
        }
    
        const enemyPieces = getEnemyPieces(currentTeam);
        const possibleMovesCalculator = new PossibleMovesCalculator();

        for (const enemy of enemyPieces) {
            // If enemy has valid moves the game is not over
            if (possibleMovesCalculator.calculatePossibleMovesForPiece(enemy).length > 0) {
                return '';
            }
        }
    
        if (!possibleMovesCalculator.canEnemyPieceCaptureKing(getKingOfTeam(enemyPieces[0].team))) {
            return 'Draw by Stalemate';
        }

        return `The Winner is ${(currentTeam === 'w') ? 'White' : 'Black'}`;
    }
    
    getDrawReasonIfGameIsADraw() {
        if (board.pieces.size === 2) {
            return 'Insufficient Material';
        } else if(board.turn % 2 !== 0) {
            if (board.turnsSinceLastCapture === 50) return '50-Move Rule';
            if (this.isThreefoldRepetition()) return 'Threefold Repetition';
        }

        return '';
    }

    isThreefoldRepetition() {
        const currentPieceState = board.getCurrentPieceState();
        return board.pieceStateHistory.filter(state => state === currentPieceState).length >= 3;
    }
    
}   