import { reactive } from "vue";
import { BOARD_DIMENSION, pieces, addPiece } from "../common/constants.js";
import { timers } from "./timers.js";
import { sendPostRequest } from "../services/axios.js";
import { compressPieceState } from "../services/compress.js";

export const board = reactive({
    state: [],
    pieces: new Map(),
    fullmoves: 1,
    halfmoves: 0,
    pieceStateHistory: [],
    isGameOver: false,
    activeColor: 'w',

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

        this.addPieceStateToHistory();
    },

    clonePieces() {
        let clonedPieces = new Map();
        this.pieces.forEach((piece, key) => {
            clonedPieces.set(key, { ...piece });
        });
        return clonedPieces;
    },

    addPieceStateToHistory() {
        const currentPieceState = compressPieceState(this.pieces).split(' ')[0];
        console.log(this.pieceStateHistory);
        this.pieceStateHistory.push(currentPieceState);
    },

    saveState(gameId) {
        const state = new FormData();
        state.append('pieceStateHistory', JSON.stringify(this.pieceStateHistory));
        state.append('turnStart', new Date().getTime());
        state.append('blackTimer', JSON.stringify(timers.blackTimer));
        state.append('whiteTimer', JSON.stringify(timers.whiteTimer));
        state.append('fen', compressPieceState(this.pieces));

        sendPostRequest(`/game/${gameId}/save-state`, state);
    },

    loadState(game) {
        if (!game.fen) {
            this.updateState(pieces);
            const defaultClockState = { minutes: game.length, seconds: 0 };
            timers.setTimers(defaultClockState, defaultClockState, new Date().getTime());

            this.saveState(game.id);
            return;
        }

        const fenParts = game.fen.split(' ');
        const pieceState = fenParts[0].split('/').reverse();

        this.pieces = new Map();
        for (let y = 1; y <= BOARD_DIMENSION; ++y) {
            let x = 1;
            for (let r of pieceState[y - 1]) {
                if (r >= '1' && r <= '8') { x += Number(r); continue; }
                const type = this.getPieceFromType(r);
                const team = (r === r.toLowerCase()) ? 'b' : 'w';
                addPiece(type, team, x, y, (type === 'Rook' || type === 'King'));
                x++;
            }
        }

        if (fenParts[2] !== '-') {
            for (let castlingRight of fenParts[2]) {
                const y = (castlingRight === 'K' || castlingRight === 'Q') ? 1 : 8;
                
                const king = this.pieces.get(`5-${y}`);
                king.hasMoved = false;
                
                const rX = (castlingRight.toLowerCase() === 'k') ? 8 : 1;
                const rook = this.pieces.get(`${rX}-${y}`);
                rook.hasMoved = false;

                this.pieces.set(`5-${y}`, king);
                this.pieces.set(`${rX}-${y}`, rook);
            }
        }

        console.log(game.fen);


        if (fenParts[3] !== '-') {
            const subs = (fenParts[1] === 'w') ? 1 : -1;
            const [x, y] = [fenParts[3][0].charCodeAt(0) - 96, Number(fenParts[3][1]) - subs];
            const pawn = this.pieces.get(`${x}-${y}`);
            pawn.enPassant = true;
            this.pieces.set(`${x}-${y}`, pawn);
        }

        this.activeColor = fenParts[1];
        this.halfmoves = Number(fenParts[4]);
        this.fullmoves = Number(fenParts[5]);
        this.pieceStateHistory = JSON.parse(game.pieceStateHistory);
        timers.setTimers(JSON.parse(game.whiteTimer), JSON.parse(game.blackTimer), game.turnStart);
        this.updateState(this.pieces);
    },

    getPieceFromType(type) {
        type = type.toLowerCase();
        switch (type) {
            case 'p':
                return 'Pawn';
            case 'r':
                return 'Rook';
            case 'n':
                return 'Knight';
            case 'b':
                return 'Bishop';
            case 'q':
                return 'Queen';
            case 'k':
                return 'King';
            default:
                throw new Error('Invalid piece type');
        }
    }
});