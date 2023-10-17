<template>
    <div class="tile" :class="{
        'black-tile': (x + y) % 2 === 0,
        'white-tile': (x + y) % 2 !== 0,
        'highlight': isPossibleMove,
        'chess-piece-tile': containsPiece
    }" @mousedown="e => grabPiece(e)">
        <div v-show="containsPiece" class="chess-piece" :style="{ backgroundImage: 'url(' + pieceImage + ')' }"></div>
    </div>
</template>

<script setup>
import { BLACK_PIECES_START_Y, WHITE_PIECES_START_Y } from '../common/constants.js';
const { x, y, pieceImage, isPossibleMove } = defineProps({
    x: Number,
    y: Number,
    pieceImage: String,
    isPossibleMove: Boolean
});
const emit = defineEmits(['grabPiece', 'promotionPossible']);
const containsPiece = pieceImage !== '';

if (canPromote()) {
    emit('promotionPossible', x, y);
}

function grabPiece(e) {
    if (containsPiece) {
        const pieceDOMElement = e.target;
        pieceDOMElement.style.position = 'absolute';
        emit('grabPiece', pieceDOMElement, e);
    }
}

function canPromote() {
    if (containsPiece) {
        const pieceTeam = pieceImage.includes('_w') ? 'w' : 'b';
        const promotionRow = (pieceTeam === 'w') ? BLACK_PIECES_START_Y : WHITE_PIECES_START_Y;
        return pieceImage.includes('pawn') && y === promotionRow;
    }
    return false;
}
</script>

<style scoped>
.tile {
    display: grid;
    place-content: center;
    width: 100px;
    height: 100px;
}

.tile .chess-piece {
    width: 100px;
    height: 100px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100px;
}

.tile .chess-piece:hover {
    cursor: grab;
}

.tile .chess-piece:active {
    cursor: grabbing;
}

.white-tile {
    background-color: #ebecd0;
}

.black-tile {
    background-color: #779556;
}

.highlight:not(.chess-piece-tile)::before {
    content: " ";
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.4);
}

.highlight.chess-piece-tile::before {
    position: absolute;
    content: " ";
    width: 90px;
    height: 90px;
    border: 5px solid rgba(0, 0, 0, 0.4);
    border-radius: 50%;
}
</style>