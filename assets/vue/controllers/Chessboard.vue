<template>
    <div id="chessboard" @mousemove="e => movePiece(e)" @mouseup="selectedPiece = null">
        <Tile v-for="tile in board" :key="tile.number" :tile-number="tile.number" :piece-image="tile.pieceImage"
            @move-piece="piece => selectedPiece = piece" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Tile from '../components/Tile.vue';
import useBoard from '../composables/board.js';

const boardDimension = 8;

let board = [];
let pieces = useBoard().pieces;
let selectedPiece = ref(null);

for (let j = boardDimension; j >= 1; --j) {
    for (let i = 1; i <= boardDimension; ++i) {
        const foundPiece = pieces.find(piece => piece.x === i && piece.y === j);

        board.push({
            number: i + j,
            pieceImage: foundPiece ? foundPiece.image : ''
        });
    }
}

function movePiece(e) {
    if (selectedPiece.value) {
        const x = e.pageX - 50;
        const y = e.pageY - 50;
        selectedPiece.value.style.left = `${x}px`;
        selectedPiece.value.style.top = `${y}px`;
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