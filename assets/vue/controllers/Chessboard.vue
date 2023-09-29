<template>
    <div id="chessboard">
        <Tile v-for="tile in board" :key="tile.number" :tile-number="tile.number" :image="tile.pieceImage" />
    </div>
</template>

<script setup>
import Tile from '../components/Tile.vue';

const boardDimension = 8;
/* Starting y positions for black and white pieces respectively */
const BY = 8;
const WY = 1;

let board = [];
let pieces = [];
const colors = ['b', 'w'];


for (const color of colors) {
    const y = (color === 'b') ? BY : WY;
    
    /* PAWNS */
    for (let i = 1; i <= boardDimension; ++i) {
        const pawnY = (color === 'b') ? y - 1 : y + 1;
        pieces.push({ image: `images/pawn_${color}.png`, x: i, y: pawnY });
    }

    /* ROOKS */
    pieces.push({ image: `images/rook_${color}.png`, x: 1, y: y });
    pieces.push({ image: `images/rook_${color}.png`, x: 8, y: y });
    /* KNIGHTS */
    pieces.push({ image: `images/knight_${color}.png`, x: 2, y: y });
    pieces.push({ image: `images/knight_${color}.png`, x: 7, y: y });
    /* BISHOPS */
    pieces.push({ image: `images/bishop_${color}.png`, x: 3, y: y });
    pieces.push({ image: `images/bishop_${color}.png`, x: 6, y: y });
    /* KING AND QUEEN */
    pieces.push({ image: `images/king_${color}.png`, x: 4, y: y });
    pieces.push({ image: `images/queen_${color}.png`, x: 5, y: y });
}

for (let j = boardDimension; j >= 1; --j) {
    for (let i = 1; i <= boardDimension; ++i) {
        let image = '';
        pieces.forEach(piece => {
            if (piece.x === i && piece.y === j) {
                image = piece.image;
            }
        });

        board.push({
            number: i + j,
            pieceImage: image
        });
    }
}

</script>

<style scoped>
#chessboard {
    display: grid;
    grid-template-columns: repeat(8, 100px);
    grid-template-rows: repeat(8, 100px);
    width: 800px;
    height: 800px;
}
</style>