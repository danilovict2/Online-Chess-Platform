export default function useBoard(chessboard) {
    let pieces = putPiecesOnBoard();
    let boardLimits = {
        minX: chessboard.value.offsetLeft - 25, 
        minY: chessboard.value.offsetTop - 25,
        maxX: chessboard.value.offsetLeft + chessboard.value.clientWidth - 75,
        maxY: chessboard.value.offsetTop + chessboard.value.clientHeight - 90
    };

    function findClosestCell (clientX, clientY) {
        const cellDimension = 100;
        // +1 added to start indexing from 1
        const x = Math.floor((clientX - chessboard.value.offsetLeft) / cellDimension) + 1;
        // -800 inverts y
        const y = Math.abs(Math.ceil((clientY - chessboard.value.offsetTop - 800) / cellDimension)) + 1;

        return { x, y };
    }

    return { pieces, boardLimits, findClosestCell };
}

function putPiecesOnBoard() {
    const colors = ['b', 'w'];
    const boardDimension = 8;
    const specialPieces = ['Rook', 'Knight', 'Bishop'];
    
    /* Starting y positions for black and white pieces respectively */
    const BY = 8;
    const WY = 1;

    let pieces = [];

    for (const color of colors) {
        const y = (color === 'b') ? BY : WY;

        /* PAWNS */
        for (let i = 1; i <= boardDimension; ++i) {
            const pawnY = (color === 'b') ? y - 1 : y + 1;
            pieces.push({ image: `images/pawn_${color}.png`, x: i, y: pawnY, type: 'Pawn', team: color });
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