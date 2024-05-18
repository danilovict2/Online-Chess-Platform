import { BOARD_DIMENSION } from "../common/constants";
import { getKingOfTeam } from "../common/helpers";
import { board } from "../stores/board";

export function compressPieceState(pieceState) {
    let fen = '';
    let possibleEnPassantTargets = '';
    let emptyCount = 0;

    for (let j = BOARD_DIMENSION; j >= 1; --j) {
        for (let i = 1; i <= BOARD_DIMENSION; ++i) {
            const foundPiece = pieceState.get(`${i}-${j}`);

            if (foundPiece) {
                if (emptyCount > 0) {
                    fen += emptyCount.toString();
                    emptyCount = 0;
                }

                const pieceTypeSymbol = foundPiece.type === 'Knight' ? 'n' : foundPiece.type[0].toLowerCase();
                fen += foundPiece.team === 'w' ? pieceTypeSymbol.toUpperCase() : pieceTypeSymbol;

                const subs = (foundPiece.team === 'w') ? 1 : -1;
                possibleEnPassantTargets += foundPiece.enPassant ? ' ' + String.fromCharCode(97 + (i-1)) + (j-subs) : '';
            } else {
                emptyCount++;
            }
        }

        if (emptyCount > 0) {
            fen += emptyCount.toString();
            emptyCount = 0;
        }

        if (j > 1) {
            fen += '/';
        }
    }

    const whiteCastlingRights = getCastlingRights('w', pieceState);
    const blackCastlingRights = getCastlingRights('b', pieceState);
    const castlingFenPart = (whiteCastlingRights === blackCastlingRights) ? '-' :  whiteCastlingRights + blackCastlingRights;
    possibleEnPassantTargets = possibleEnPassantTargets.length ? possibleEnPassantTargets : ' -';

    fen += board.activeColor + ' ' + castlingFenPart + possibleEnPassantTargets + ' ' + board.halfmoves + ' ' + board.fullmoves;

    return fen;
}

function getCastlingRights(color, pieceState) {
    if (getKingOfTeam(color).hasMoved)return '';
    
    if (color === 'w') {
        let castlingRights = '';
        if (!pieceState.get('1-1').hasMoved)castlingRights += 'K';
        if (!pieceState.get('8-1').hasMoved)castlingRights += 'Q';
        return castlingRights.length ? castlingRights : '-';
    } else {
        let castlingRights = '';
        if (!pieceState.get('1-8').hasMoved)castlingRights += 'q';
        if (!pieceState.get('8-8').hasMoved)castlingRights += 'k';
        return castlingRights.length ? castlingRights : '-';
    }

    return '';
}