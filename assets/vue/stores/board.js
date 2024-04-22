import { reactive } from "vue";
import { BOARD_DIMENSION, pieces } from "../common/constants.js";
import { timers } from "./timers.js";
import { sendPostRequest } from "../services/axios.js";
import { compressPieceState } from "../services/compress.js";

export const board = reactive({
    state: [],
    pieces: new Map(),
    turn: 1,
    turnsSinceLastCapture: 0,
    pieceStateHistory: [],
    isGameOver: false,

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
            clonedPieces.set(key, { ...piece });
        });
        return clonedPieces;
    },

    addPieceStateToHistory() {
        const currentPieceState = compressPieceState(this.pieces);
        console.log(currentPieceState);
        this.pieceStateHistory.push(currentPieceState);
    },

    saveState(gameId) {
        const state = new FormData();
        state.append('pieces', JSON.stringify(Array.from(this.pieces)));
        state.append('turn', this.turn);
        state.append('turnsSinceLastCapture', this.turnsSinceLastCapture);
        state.append('pieceStateHistory', JSON.stringify(this.pieceStateHistory));
        state.append('turnStart', new Date().getTime());
        state.append('blackTimer', JSON.stringify(timers.blackTimer));
        state.append('whiteTimer', JSON.stringify(timers.whiteTimer));

        sendPostRequest(`/game/${gameId}/save-state`, state);
    },

    loadState(game) {
        if (!game.pieces) {
            this.updateState(pieces);
            const defaultClockState = { minutes: game.length, seconds: 0 };
            timers.setTimers(defaultClockState, defaultClockState, new Date().getTime());

            this.saveState(game.id);
            return;
        }

        this.pieces = new Map(JSON.parse(game.pieces));
        this.turn = game.turn;
        this.turnsSinceLastCapture = game.turnsSinceLastCapture;
        this.pieceStateHistory = JSON.parse(game.pieceStateHistory);
        timers.setTimers(JSON.parse(game.whiteTimer), JSON.parse(game.blackTimer), game.turnStart);
        this.updateState(this.pieces);
    },
});