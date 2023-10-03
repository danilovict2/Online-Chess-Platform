<template>
    <div id="chessboard" @mousemove="e => movePiece(e)" @mouseup="e => dropPiece(e)" ref="chessboard">
        <Tile v-for="tile in board" :key="tile" :tile-number="tile.number" :piece-image="tile.pieceImage"
            @move-piece="piece => selectedPiece = piece" />

    </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue';
import Tile from '../components/Tile.vue';
import useBoard from '../composables/board.js';

const boardDimension = 8;
const cellDimension = 100;
const chessboard = ref(null);

let board = ref([]);
let pieces = ref(useBoard().pieces);
let selectedPiece = ref(null);
let selectedPieceLocation = reactive({ x: null, y: null });

watch(pieces, newPieces => {
    board.value = [];
    for (let j = boardDimension; j >= 1; --j) {
        for (let i = 1; i <= boardDimension; ++i) {
            const foundPiece = newPieces.find(piece => piece.x === i && piece.y === j);

            board.value.push({
                number: i + j,
                pieceImage: foundPiece ? foundPiece.image : ''
            });
        }
    }
}, { deep: true, immediate: true });

function movePiece(e) {
    if (selectedPiece.value) {
        if (selectedPieceLocation.x === null && selectedPieceLocation.y === null) {
            // +1 added to start indexing from 1
            selectedPieceLocation.x = Math.floor((e.clientX - chessboard.value.offsetLeft) / cellDimension) + 1;
            // -800 inverts y
            selectedPieceLocation.y = Math.abs(Math.ceil((e.clientY - chessboard.value.offsetTop - 800) / cellDimension)) + 1;
        }

        const minX = chessboard.value.offsetLeft - 25, minY = chessboard.value.offsetTop - 25;
        const maxX = chessboard.value.offsetLeft + chessboard.value.clientWidth - 75;
        const maxY = chessboard.value.offsetTop + chessboard.value.clientHeight - 90;
        const x = e.pageX - 50;
        const y = e.pageY - 50;
        selectedPiece.value.style.left = `${Math.min(Math.max(x, minX), maxX)}px`;
        selectedPiece.value.style.top = `${Math.min(Math.max(y, minY), maxY)}px`;
    }
}

function dropPiece(e) {
    if (selectedPiece.value) {
        selectedPiece.value = null;
        // +1 added to start indexing from 1
        const x = Math.floor((e.clientX - chessboard.value.offsetLeft) / cellDimension) + 1;
        // -800 inverts y
        const y = Math.abs(Math.ceil((e.clientY - chessboard.value.offsetTop - 800) / cellDimension)) + 1;
        pieces.value = pieces.value.map(piece => {
            if (piece.x === selectedPieceLocation.x && piece.y === selectedPieceLocation.y) {
                piece.x = x;
                piece.y = y;
            }
            return piece;
        });
        selectedPieceLocation = { x: null, y: null };
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