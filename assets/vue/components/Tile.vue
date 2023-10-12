<template>
    <div class="tile" :class="{
        'black-tile' : tileNumber % 2 === 0,
        'white-tile' : tileNumber % 2 !== 0,
        'highlight' : isPossibleMove,
        'chess-piece-tile' : containsPiece
    }" @mousedown="e => grabPiece(e)">
        <div v-show="containsPiece" class="chess-piece" :style="{ backgroundImage: 'url(' + pieceImage + ')' }"></div>
    </div>
</template>

<script setup>
const { tileNumber, pieceImage, isPossibleMove } = defineProps({
    tileNumber : Number,
    pieceImage: String,
    isPossibleMove: Boolean
});
const emit = defineEmits(['movePiece']);

const containsPiece = pieceImage !== '';

function grabPiece(e) {
    if (containsPiece) {
        const piece = e.target; 
        piece.style.position = 'absolute';   
        emit('movePiece', piece, e);
    }
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