<template>
    <div id="chessboard">
        <div 
            v-for="(square, i) in board" :key="i"
            class="tile" :class="square % 2 == 0 ? 'black-tile' : 'white-tile'"
        ></div>
    </div>
</template>

<script setup>

const boardDimension = 8;

let board = [];
for (let j = boardDimension - 1; j >= 0; --j) {
    for (let i = 0; i < boardDimension; ++i) {
        board.push(i + j);
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

.tile {
    width: 100px;
    height: 100px;
}

.white-tile {
    background-color: #ebecd0;
}

.black-tile {
    background-color: #779556;
}
</style>