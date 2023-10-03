<template>
    <div id="chessboard" @mousemove="e => movePiece(e)" @mouseup="selectedPiece = null" ref="chessboard">
        <Tile v-for="tile in board" :key="tile.number" :tile-number="tile.number" :piece-image="tile.pieceImage"
            @move-piece="piece => selectedPiece = piece" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Tile from '../components/Tile.vue';
import useBoard from '../composables/board.js';

const boardDimension = 8;
const chessboard = ref(null);

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
        const minX = chessboard.value.offsetLeft - 25, minY = chessboard.value.offsetTop - 25;
        const maxX = chessboard.value.offsetLeft + chessboard.value.clientWidth - 75; 
        const maxY = chessboard.value.offsetTop + chessboard.value.clientHeight - 90;
        const x = e.pageX - 50;
        const y = e.pageY - 50;
        selectedPiece.value.style.left = `${Math.min(Math.max(x, minX), maxX)}px`;
        selectedPiece.value.style.top = `${Math.min(Math.max(y, minY), maxY)}px`;
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