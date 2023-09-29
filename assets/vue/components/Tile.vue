<template>
    <div class="tile" :class="tileNumber % 2 == 0 ? 'black-tile' : 'white-tile'" @mousedown="e => grabPiece(e)">
        <div v-show="containsPiece" class="chess-piece" :style="{ backgroundImage: 'url(' + pieceImage + ')' }"></div>
    </div>
</template>

<script setup>
const { tileNumber, pieceImage } = defineProps({
    tileNumber : Number,
    pieceImage: String
});
const emit = defineEmits(['movePiece']);

const containsPiece = pieceImage !== '';

function grabPiece(e) {
    if (containsPiece) {
        const piece = e.target;    
        emit('movePiece', piece);
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
    background-size: 80px;
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
</style>