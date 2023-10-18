import { createRefereeForType, samePosition } from "../common/helpers.js";
import { board } from "../stores/board.js";

export default class MoveHandler {
    playMove(pieceToMove, toMovetile) {
        const startTile = { x: pieceToMove.x, y: pieceToMove.y };
        const enPassantCaptureDirection = (pieceToMove.team === 'w') ? 1 : -1;
        const isEnPassant = createRefereeForType(pieceToMove.type).isEnPassant(startTile, toMovetile, pieceToMove.team);
        const piecesAfterMove = new Map();

        for (let piece of board.pieces.values()) {
            piece.enPassant = false;

            // FOUND CAPTURED PIECE
            if (
                samePosition(piece, toMovetile) ||
                (isEnPassant && samePosition(piece, { x: toMovetile.x, y: toMovetile.y - enPassantCaptureDirection }))
            ) {
                board.turnsSinceLastCapture = 0;
                continue;
            }

            if (piece === pieceToMove) {
                this.movePieceWithEnPassantCheck(piece, toMovetile);
                if (piece.type === 'King' && Math.abs(piece.x - startTile.x) === 2) {
                    this.castle(piece, piecesAfterMove);
                }
            }

            piecesAfterMove.set(`${piece.x}-${piece.y}`, piece);
        }

        if (board.pieces.size === piecesAfterMove.size) {
            board.turnsSinceLastCapture++;
        }
        
        board.pieces = piecesAfterMove;
        board.turn++;
        return piecesAfterMove;
    }

    movePieceWithEnPassantCheck(piece, toMovetile) {
        piece.enPassant = piece.type === 'Pawn' && Math.abs(piece.y - toMovetile.y) === 2;
        piece.x = toMovetile.x;
        piece.y = toMovetile.y;
        piece.hasMoved = true;
    }

    castle(king, pieceState) {
        const castlingDirection = (king.x === 7) ? 1 : -1;
        const distanceToClosestRook = (castlingDirection === -1) ? -2 : 1;

        const closestRook = board.pieces.get(`${king.x + distanceToClosestRook}-${king.y}`);
        pieceState.delete(`${closestRook.x}-${closestRook.y}`);
        pieceState.set(`${king.x - castlingDirection}-${closestRook.y}`, closestRook);
    }
}