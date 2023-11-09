import { reactive } from "vue";
import { BOARD_DIMENSION } from "../common/constants.js";
import { useTimer } from "vue-timer-hook";

export const board = reactive({
    state: [],
    pieces: new Map(),
    turn: 1,
    turnsSinceLastCapture: 0,
    pieceStateHistory: [],
    blackTimer: null,
    whiteTimer: null,

    updateState(pieces) {
        this.state = [];
        this.pieces = pieces;

        for (let j = BOARD_DIMENSION; j >= 1; --j) {
            for (let i = 1; i <= BOARD_DIMENSION; ++i) {
                const foundPiece = pieces.get(`${i}-${j}`);

                this.state.push({
                    x: i,
                    y: j,
                    pieceImage: foundPiece ? `images/${foundPiece.type.toLowerCase()}_${foundPiece.team}.png` : '',
                });
            }
        }

        if (this.turn > 1) {
            this.addPieceStateToHistory();
        } 
    },

    clonePieces() {
        let clonedPieces = new Map();
        this.pieces.forEach((piece, key) => {
            clonedPieces.set(key, {...piece});
        });
        return clonedPieces;
    },

    addPieceStateToHistory() {
        const currentPieceState = this.getCurrentPieceState();
        this.pieceStateHistory.push(JSON.stringify(currentPieceState));
    },

    getCurrentPieceState() {
        const currentPieceState = [];
        this.pieces.forEach(piece => {
            currentPieceState.push(`${piece.x}-${piece.y}-${piece.type}`);
        });

        return currentPieceState;
    },

    setClocks(gameLength) {
        this.whiteTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + gameLength * 60));
        this.blackTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + gameLength * 60));
    }
});