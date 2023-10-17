import { board } from "../stores/board.js";

export const GRID_COL_SIZE = 100;
export const BOARD_DIMENSION = 8;
export const BLACK_PIECES_START_Y = 8;
export const WHITE_PIECES_START_Y = 1;
export let pieces = putPiecesOnTheBoard();

function putPiecesOnTheBoard() {
    const teams = ['b', 'w'];

    for (const team of teams) {
        const y = (team === 'b') ? BLACK_PIECES_START_Y : WHITE_PIECES_START_Y;
        addPawnsForTeam(team, y);
        addSpecialPiecesForTeam(team, y);
        addKingAndQueenForTeam(team, y);
    }

    return board.pieces;
}

function addPawnsForTeam(team, y) {
    for (let i = 1; i <= BOARD_DIMENSION; ++i) {
        const pawnY = (team === 'b') ? y - 1 : y + 1;
        addPiece('Pawn', team, i, pawnY);
    }
}

function addSpecialPiecesForTeam(team, y) {
    const specialPieces = ['Rook', 'Knight', 'Bishop'];
    let firstX = 1, lastX = 9;
    for (let piece of specialPieces) {
        addPiece(piece, team, firstX, y);
        addPiece(piece, team, lastX - firstX, y);
        firstX++;
    }
}

function addKingAndQueenForTeam(team, y) {
    addPiece('King', team, 5, y);
    addPiece('Queen', team, 4, y);
}

function addPiece(pieceType, team, x, y) {
    board.pieces.set(
        `${x}-${y}`,
        { 
            image: `images/${pieceType.toLowerCase()}_${team}.png`, 
            x: x, y: y,
            type: pieceType, team: team, 
            hasMoved: false, enPassant: false 
        }
    );
}