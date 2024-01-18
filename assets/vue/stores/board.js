import { reactive } from "vue";
import { BOARD_DIMENSION, pieces } from "../common/constants.js";
import { useTimer } from "vue-timer-hook";
import axios from "axios";

export const board = reactive({
    state: [],
    pieces: new Map(),
    turn: 1,
    turnsSinceLastCapture: 0,
    pieceStateHistory: [],
    blackTimer: null,
    whiteTimer: null,
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
            clonedPieces.set(key, {...piece});
        });
        return clonedPieces;
    },

    addPieceStateToHistory() {
        const currentPieceState = this.getCurrentPieceState();
        this.pieceStateHistory.push(currentPieceState);
    },

    getCurrentPieceState() {
        let currentPieceState = '';
        for (let j = BOARD_DIMENSION; j >= 1; --j) {
            for (let i = 1; i <= BOARD_DIMENSION; ++i) {
                const foundPiece = this.pieces.get(`${i}-${j}`);

                if (foundPiece) {
                    const pieceTypeSymbol = foundPiece.type === 'Knight' ? 'n' : foundPiece.type[0].toLowerCase();
                    currentPieceState += foundPiece.team === 'w' ? pieceTypeSymbol.toUpperCase() : pieceTypeSymbol;
                } else {
                    currentPieceState += '0';
                }
            }
        }

        return currentPieceState;
    },

    setClocks(gameLength) {
        this.whiteTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + gameLength * 60));
        this.blackTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + gameLength * 60));
    },

    saveState(gameId) {
        const state = new FormData();
        state.append('pieces', JSON.stringify(Array.from(this.pieces)));
        state.append('turn', this.turn);
        state.append('turnsSinceLastCapture', this.turnsSinceLastCapture);
        state.append('pieceStateHistory', JSON.stringify(this.pieceStateHistory));
        state.append('start', new Date().getTime());
        state.append('blackTimer', JSON.stringify(this.blackTimer));
        state.append('whiteTimer', JSON.stringify(this.whiteTimer));
        
        axios.post(`/game/${gameId}/save-state`, state, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    },

    loadState(game) {
        if (!game.pieces) {
            this.updateState(pieces);
            this.saveState(game.id);
            return;
        }
        this.pieces = new Map(JSON.parse(game.pieces));
        this.turn = game.turn;
        this.turnsSinceLastCapture = game.turnsSinceLastCapture;
        this.pieceStateHistory = JSON.parse(game.pieceStateHistory);
        this.loadTimers(JSON.parse(game.whiteTimer), JSON.parse(game.blackTimer), game.start);
        this.updateState(this.pieces);
    },

    loadTimers(whiteTimerData, blackTimerData, turnStart) {
        const msPassed = new Date().getTime() - turnStart;
        const sPassed = parseInt((msPassed/1000)%60);
        const mPassed = parseInt((msPassed/(1000*60))%60);
        
        if (this.turn % 2 !== 0) {
            this.whiteTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + (whiteTimerData.minutes - mPassed) * 60 + whiteTimerData.seconds - sPassed));
            this.blackTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + blackTimerData.minutes * 60 + blackTimerData.seconds));
        } else {
            this.whiteTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + whiteTimerData.minutes * 60 + whiteTimerData.seconds));
            this.blackTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + (blackTimerData.minutes - mPassed) * 60 + blackTimerData.seconds - sPassed));
        }
    }
});