import { BOARD_DIMENSION } from "../common/constants";

export function compressPieceState(pieceState) {
    let compressedPieceState = '';
    let emptyCount = 0;

    for (let j = BOARD_DIMENSION; j >= 1; --j) {
        for (let i = 1; i <= BOARD_DIMENSION; ++i) {
            const foundPiece = pieceState.get(`${i}-${j}`);

            if (foundPiece) {
                if (emptyCount > 0) {
                    compressedPieceState += emptyCount.toString();
                    emptyCount = 0;
                }

                const pieceTypeSymbol = foundPiece.type === 'Knight' ? 'n' : foundPiece.type[0].toLowerCase();
                compressedPieceState += foundPiece.team === 'w' ? pieceTypeSymbol.toUpperCase() : pieceTypeSymbol;
            } else {
                emptyCount++;
            }
        }

        if (emptyCount > 0) {
            compressedPieceState += emptyCount.toString();
            emptyCount = 0;
        }

        if (j > 1) {
            compressedPieceState += '/';
        }
    }

    return compressedPieceState;
}