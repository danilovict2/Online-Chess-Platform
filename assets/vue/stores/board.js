import { reactive } from "vue";
import { BOARD_DIMENSION } from "../common/constants.js";

export const board = reactive({
    state: [],
    pieces: [],

    updateState(pieces) {
        this.state = [];
        this.pieces = pieces;
        
        for (let j = BOARD_DIMENSION; j >= 1; --j) {
            for (let i = 1; i <= BOARD_DIMENSION; ++i) {
                const foundPiece = this.pieces.find(piece => piece.x === i && piece.y === j);

                this.state.push({
                    x: i, 
                    y: j,
                    pieceImage: foundPiece ? foundPiece.image : '',
                });
            }
        }
    }
});