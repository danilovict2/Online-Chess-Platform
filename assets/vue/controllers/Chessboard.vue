<template>
    <div id="chessboard" ref="chessboard" @mousemove="e => moveCurrentPieceDOMElement(e)" @mouseup="e => dropPiece(e)">
        <Tile v-for="tile in board.state" :key="tile" :x="tile.x" :y="tile.y" :piece-image="tile.pieceImage"
            :is-possible-move="possibleMoves.some(move => samePosition(move, tile))" 
            @grab-piece="grabPiece" @promotion-possible="enablePromotionModal"/>
    </div>
    <PromotionModal v-show="promotionPawn" :team="promotionPawn?.team" @promote-to="promoteTo" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Tile from '../components/Tile.vue';
import PromotionModal from '../components/PromotionModal.vue';
import { samePosition } from '../common/helpers.js';
import { board } from '../stores/board.js';
import { GRID_COL_SIZE, pieces as defaultPieceLayout } from '../common/constants.js';
import PossibleMovesCalculator from '../services/PossibleMovesCalculator.js';
import PromotionHandler from '../services/PromotionHandler.js';
import MoveHandler from '../services/MoveHandler.js';

const chessboard = ref(null);

let boardLimits = null;
let currentPiece = null;
let possibleMoves = ref([]);
let pieces = ref(defaultPieceLayout);
let promotionPawn = ref(null);
let currentPieceDOMElement = ref(null);

onMounted(() => {
    boardLimits = {
        minX: chessboard.value.offsetLeft - 25,
        minY: chessboard.value.offsetTop - 25,
        maxX: chessboard.value.offsetLeft + chessboard.value.clientWidth - 75,
        maxY: chessboard.value.offsetTop + chessboard.value.clientHeight - 90
    };
});

watch(pieces, newPieces => board.updateState(newPieces), { deep: true, immediate: true });

function grabPiece(pieceDOMElement, e) {
    currentPieceDOMElement.value = pieceDOMElement;
    moveCurrentPieceDOMElement(e);

    const currentPieceTile = findClosestTile(e.clientX, e.clientY);
    currentPiece = board.pieces.get(`${currentPieceTile.x}-${currentPieceTile.y}`);
    if (!((currentPiece.team === 'w' && board.turn % 2 === 0) || (currentPiece.team === 'b' && board.turn % 2 !== 0))) {
        possibleMoves.value = new PossibleMovesCalculator().calculatePossibleMovesForPiece(currentPiece);
    }
}

function findClosestTile(clientX, clientY) {
    // +1 added to start indexing from 1
    const x = Math.floor((clientX - (boardLimits.minX + 25)) / GRID_COL_SIZE) + 1;
    // -825 inverts y
    const y = Math.abs(Math.ceil((clientY - boardLimits.minY - 825) / GRID_COL_SIZE)) + 1;

    return { x, y };
}

function moveCurrentPieceDOMElement(e) {
    if (currentPieceDOMElement.value) {
        const x = e.pageX - GRID_COL_SIZE / 2;
        const y = e.pageY - GRID_COL_SIZE / 2;
        currentPieceDOMElement.value.style.left = `${Math.min(Math.max(x, boardLimits.minX), boardLimits.maxX)}px`;
        currentPieceDOMElement.value.style.top = `${Math.min(Math.max(y, boardLimits.minY), boardLimits.maxY)}px`;
    }
}

function dropPiece(e) {
    if (currentPieceDOMElement.value) {
        const toMovetile = findClosestTile(e.clientX, e.clientY);

        if (possibleMoves.value.some(move => samePosition(move, toMovetile))) {
            pieces.value = new MoveHandler().playMove(currentPiece, toMovetile);
        } else {
            currentPieceDOMElement.value.style.position = 'relative';
            currentPieceDOMElement.value.style.removeProperty('top');
            currentPieceDOMElement.value.style.removeProperty('left');
        }

        currentPieceDOMElement.value = null;
        possibleMoves.value = [];
    }
}

function enablePromotionModal(x, y) {
    promotionPawn.value = board.pieces.get(`${x}-${y}`);
}

function promoteTo(pieceType) {
    pieces.value = new PromotionHandler().promote(promotionPawn.value, pieceType);
    promotionPawn.value = null;
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