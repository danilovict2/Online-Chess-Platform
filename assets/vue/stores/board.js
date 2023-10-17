import { reactive } from "vue";
import { BOARD_DIMENSION } from "../common/constants.js";

export const board = reactive({
    state: [],
    pieces: new Map(),
    turn: 1,

    updateState(pieces) {
        this.state = [];
        this.pieces = pieces;
        for (let j = BOARD_DIMENSION; j >= 1; --j) {
            for (let i = 1; i <= BOARD_DIMENSION; ++i) {
                const foundPiece = pieces.get(`${i}-${j}`);

                this.state.push({
                    x: i,
                    y: j,
                    pieceImage: foundPiece ? foundPiece.image : '',
                });
            }
        }
    },

    getEnemyPieces(nonEnemyTeam) {
        let enemyPieces = [];
        board.pieces.forEach(piece => {
            if (piece.team !== nonEnemyTeam) {
                enemyPieces.push(piece);
            }
        });

        return enemyPieces;
    },

    getKingOfTeam(team) {
        let king = {};
        board.pieces.forEach(piece => {
            if (piece.type === 'King' && piece.team === team) {
                king = piece;
            }
        });

        return king;
    },

    clonePieces() {
        let clonedPieces = new Map();
        this.pieces.forEach((piece, key) => {
            clonedPieces.set(key, {...piece});
        });
        return clonedPieces;
    }
});