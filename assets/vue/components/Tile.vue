<template>
    <div class="tile" :class="{
        'black-tile': (x + y) % 2 === 0,
        'white-tile': (x + y) % 2 !== 0,
        'highlight': isPossibleMove,
        'chess-piece-tile': containsPiece
    }">
        <div class="rank" v-show="rank" v-text="rank"></div>
        <div v-show="containsPiece" class="chess-piece" :style="{ backgroundImage: 'url(/' + pieceImage + ')' }"
            @mousedown="e => grabPiece(e)"></div>
        <div class="file" v-show="file" v-text="file"></div>
    </div>
</template>

<script setup>
import { files, ranks } from '../common/constants.js';
const { x, y, pieceImage, isPossibleMove } = defineProps({
    x: Number,
    y: Number,
    pieceImage: String,
    isPossibleMove: Boolean
});
const emit = defineEmits(['grabPiece']);
const containsPiece = pieceImage !== '';
const rank = (x === 1) ? ranks[y - 1] : null;
const file = (y === 1) ? files[x - 1] : null;

function grabPiece(e) {
    if (containsPiece) {
        const pieceDOMElement = e.target;
        pieceDOMElement.style.position = 'absolute';
        emit('grabPiece', pieceDOMElement, e);
    }
}
</script>

<style scoped>
.tile {
    display: grid;
    place-content: center;
    width: 100px;
    height: 100px;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
}

.tile .chess-piece {
    width: 100px;
    height: 100px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100px;
}

.rank {
    position: absolute;
    font-size: 20px;
}

.file {
    position: absolute;
    bottom: 0;
    margin-bottom: 5rem;
    margin-left: 5.5rem;
    font-size: 20px;
}

.tile .chess-piece:hover {
    cursor: grab;
}

.tile .chess-piece:active {
    cursor: grabbing;
}

.white-tile {
    background-color: #ebecd0;
    color: #779556;
}

.black-tile {
    background-color: #779556;
    color: #ebecd0;
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
    margin: 5px;
}
</style>