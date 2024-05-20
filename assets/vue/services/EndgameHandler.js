import { getEnemyPieces, getKingOfTeam } from "../common/helpers.js";
import { board } from "../stores/board.js";
import { timers } from "../stores/timers.js";
import PossibleMovesCalculator from './PossibleMovesCalculator.js';
import { compressPieceState } from "./compress.js";

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

    /**
     * Returns game status: -1: game not over, 0: player lost, 0.5: tie, 1: player won
     */
    getGameStatus(movedPieceTeam, currentPlayerTeam) {
        const isDraw = this.isDraw();
        if (isDraw) {
            return 0.5;
        }
    
        const enemyPieces = getEnemyPieces(movedPieceTeam);
        const possibleMovesCalculator = new PossibleMovesCalculator();

        for (const enemy of enemyPieces) {
            // If enemy has valid moves the game is not over
            if (possibleMovesCalculator.calculatePossibleMovesForPiece(enemy).length > 0) {
                return -1;
            }
        }
    
        if (!possibleMovesCalculator.canEnemyPieceCaptureKing(getKingOfTeam(enemyPieces[0].team))) {
            return 0.5;
        }

        if (timers.whiteTimer.isExpired) {
            return currentPlayerTeam !== 'w';
        }
        else if (timers.blackTimer.isExpired) {
            return currentPlayerTeam !== 'b';
        }

        return Number(movedPieceTeam === currentPlayerTeam);
    }
    
    isDraw() {
        if (board.pieces.size === 2) {
            return true;
        } else if(board.activeColor === 'w') {
            if (board.halfmoves === 100) return true;
            if (this.isThreefoldRepetition()) return true;
        }

        return false;
    }

    isThreefoldRepetition() {
        const currentPieceState = compressPieceState(board.pieces).split(' ')[0];
        return board.pieceStateHistory.filter(state => state === currentPieceState).length >= 3;
    }
    
}   