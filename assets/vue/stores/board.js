import { reactive } from "vue";

const boardDimension = 8;

export const board = reactive({
    state: [],
    updateState(pieces) {
        this.state = [];
        for (let j = boardDimension; j >= 1; --j) {
            for (let i = 1; i <= boardDimension; ++i) {
                const foundPiece = pieces.find(piece => piece.x === i && piece.y === j);

                this.state.push({
                    number: i + j,
                    pieceImage: foundPiece ? foundPiece.image : ''
                });
            }
        }
    }
});