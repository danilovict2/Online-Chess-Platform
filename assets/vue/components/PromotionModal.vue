<template>
    <div id="modal">
        <div class="body">
            <img :src="`images/rook_${team}.png`" @click="promoteTo('Rook')">
            <img :src="`images/bishop_${team}.png`" @click="promoteTo('Bishop')">
            <img :src="`images/knight_${team}.png`" @click="promoteTo('Knight')">
            <img :src="`images/queen_${team}.png`" @click="promoteTo('Queen')">
        </div>
    </div>
</template>

<script setup>
const { team } = defineProps({
    team: String
});
const emit = defineEmits(['promoteTo']);

function promoteTo(pieceType) {
    emit('promoteTo', pieceType);
}
</script>

<style scoped>
#modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

#modal > .body {
    position: absolute;
    top: calc(50% - 150px);
    left: calc(50% - 400px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 300px;
    width: 800px;
    background-color: rgba(0, 0, 0, 0.8);
}

#modal > .body > img {
    height: 120px;
    padding: 20px;
    clip-path: circle(50% at center);
}

#modal > .body > img:hover {
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
}
</style>