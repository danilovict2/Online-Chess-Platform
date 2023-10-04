<template>
    <div id="chessboard" ref="chessboard" @mousemove="e => movePiece(e)" @mouseup="e => dropPiece(e)">
        <Tile v-for="tile in board" :key="tile" :tile-number="tile.number" :piece-image="tile.pieceImage"
            @move-piece="grapPiece" />

    </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import Tile from '../components/Tile.vue';
import useBoard from '../composables/board.js';
import useReferee from '../composables/referee.js';

const boardDimension = 8;
const chessboard = ref(null);

let boardHelper = null;
let board = ref([]);
let pieces = ref(null);
let selectedPiece = reactive({ piece: null, cell: { x: null, y: null } });

onMounted(() => {
    boardHelper = useBoard(chessboard);
    pieces.value = boardHelper.pieces;
});

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
}, { deep: true });

function grapPiece(piece, e) {
    selectedPiece.piece = piece;
    selectedPiece.cell = boardHelper.findClosestCell(e.clientX, e.clientY);
}

function movePiece(e) {
    if (selectedPiece.piece) {
        const x = e.pageX - 50;
        const y = e.pageY - 50;
        selectedPiece.piece.style.left = `${Math.min(Math.max(x, boardHelper.boardLimits.minX), boardHelper.boardLimits.maxX)}px`;
        selectedPiece.piece.style.top = `${Math.min(Math.max(y, boardHelper.boardLimits.minY), boardHelper.boardLimits.maxY)}px`;
    }
}

function dropPiece(e) {
    if (selectedPiece.piece) {
        const closestCell = boardHelper.findClosestCell(e.clientX, e.clientY);
        pieces.value = pieces.value.map(piece => {
            if (piece.x === selectedPiece.cell.x && piece.y === selectedPiece.cell.y) {
                if (useReferee().createRefereeForType(piece.type).isValidMove(selectedPiece.cell, closestCell)) {
                    piece.x = closestCell.x;
                    piece.y = closestCell.y;
                } else {
                    selectedPiece.piece.style.position = 'relative';
                    selectedPiece.piece.style.removeProperty('top');
                    selectedPiece.piece.style.removeProperty('left');
                }
            }
            return piece;
        });
        selectedPiece.piece = null;
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