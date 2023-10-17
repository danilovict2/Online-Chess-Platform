import { board } from "../stores/board.js";

export default class PromotionHandler {
    promote(promotedPawn, promotionPieceType) {
        const piecesAfterPromotion = new Map();
        
        for (let piece of board.pieces.values()) {
            if (piece === promotedPawn) {
                piece.type = promotionPieceType;
                piece.image = `images/${piece.type.toLowerCase()}_${piece.team}.png`;
            }
            piecesAfterPromotion.set(`${piece.x}-${piece.y}`, piece);
        }
        
        return piecesAfterPromotion;
    }
}