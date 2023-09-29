<template>
    <div class="tile" :class="tileNumber % 2 == 0 ? 'black-tile' : 'white-tile'">
        <div v-show="image" class="chess-piece" :style="{ backgroundImage: 'url(' + image + ')' }"></div>
    </div>
</template>

<script setup>
const { tileNumber, image } = defineProps({
    tileNumber : Number,
    image: String
});
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