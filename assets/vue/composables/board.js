export default function useBoard() {
    const colors = ['b', 'w'];
    const boardDimension = 8;
    const specialPieces = ['rook', 'knight', 'bishop'];
    
    /* Starting y positions for black and white pieces respectively */
    const BY = 8;
    const WY = 1;

    let pieces = [];

    for (const color of colors) {
        const y = (color === 'b') ? BY : WY;

        /* PAWNS */
        for (let i = 1; i <= boardDimension; ++i) {
            const pawnY = (color === 'b') ? y - 1 : y + 1;
            pieces.push({ image: `images/pawn_${color}.png`, x: i, y: pawnY });
        }

        let left = 1, right = 8;
        for (let specialPiece of specialPieces) {
            pieces.push({ image: `images/${specialPiece}_${color}.png`, x: left++, y: y });
            pieces.push({ image: `images/${specialPiece}_${color}.png`, x: right--, y: y });
        }

        /* KING AND QUEEN */
        pieces.push({ image: `images/king_${color}.png`, x: 5, y: y });
        pieces.push({ image: `images/queen_${color}.png`, x: 4, y: y });
    }

    return { pieces };
}