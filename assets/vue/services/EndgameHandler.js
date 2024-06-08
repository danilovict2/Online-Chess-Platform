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
     * Returns object with game status and message: -1: game not over, 0: player lost, 0.5: tie, 1: player won
     */
    getGameStatus(movedPieceTeam, currentPlayerTeam) {
        const drawMessage = this.getDrawMessage();
        if (drawMessage !== '') 
            return { status: 0.5, message: drawMessage };
        
        if (timers.whiteTimer.isExpired)
            return { status: currentPlayerTeam !== 'w', message: (currentPlayerTeam !== 'w') ? 'You Won' : 'You lost' };
    
        if (timers.blackTimer.isExpired)
            return { status: currentPlayerTeam !== 'b', message: (currentPlayerTeam !== 'b') ? 'You Won' : 'You lost' };
        
        const enemyPieces = getEnemyPieces(movedPieceTeam);
        const possibleMovesCalculator = new PossibleMovesCalculator();

        for (const enemy of enemyPieces) {
            // If enemy has valid moves the game is not over
            if (possibleMovesCalculator.calculatePossibleMovesForPiece(enemy).length > 0) {
                return { status: -1, message: '' };
            }
        }
    
        if (!possibleMovesCalculator.canEnemyPieceCaptureKing(getKingOfTeam(enemyPieces[0].team))) {
            return { status: 0.5, message: 'Draw by stalemate' };
        }

        return { status: movedPieceTeam === currentPlayerTeam, message: (movedPieceTeam === currentPlayerTeam) ? 'You Won' : 'You lost' };
    }

    getDrawMessage() {
        if (board.pieces.size === 2) {
            return 'Insufficient Material';
        } else if (board.activeColor === 'w') {
            if (board.halfmoves === 100) return '50-Move Rule';
            if (this.isThreefoldRepetition()) return 'Threefold Repetition';
        }
    
        return '';
    }

    isThreefoldRepetition() {
        const currentPieceState = compressPieceState(board.pieces).split(' ')[0];
        return board.pieceStateHistory.filter(state => state === currentPieceState).length >= 3;
    }
    
}   