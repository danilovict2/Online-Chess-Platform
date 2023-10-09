export const GRID_COL_SIZE = 100;
export const BOARD_DIMENSION = 8;
export let pieces = putPiecesOnTheBoard();

function putPiecesOnTheBoard() {
    const colors = ['b', 'w'];
    const specialPieces = ['Rook', 'Knight', 'Bishop'];
    
    /* Starting y positions for black and white pieces respectively */
    const BY = 8;
    const WY = 1;

    let pieces = [];

    for (const color of colors) {
        const y = (color === 'b') ? BY : WY;

        /* PAWNS */
        for (let i = 1; i <= BOARD_DIMENSION; ++i) {
            const pawnY = (color === 'b') ? y - 1 : y + 1;
            pieces.push({ image: `images/pawn_${color}.png`, x: i, y: pawnY, type: 'Pawn', team: color, enPassant: false });
        }

        let left = 1, right = 8;
        for (let specialPiece of specialPieces) {
            pieces.push({ image: `images/${specialPiece.toLowerCase()}_${color}.png`, x: left++, y: y, type: specialPiece, team: color});
            pieces.push({ image: `images/${specialPiece.toLowerCase()}_${color}.png`, x: right--, y: y, type: specialPiece, team: color});
        }

        /* KING AND QUEEN */
        pieces.push({ image: `images/king_${color}.png`, x: 5, y: y, type: 'King', team: color });
        pieces.push({ image: `images/queen_${color}.png`, x: 4, y: y, type: 'Queen', team: color });
    }

    return pieces;
}