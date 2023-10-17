<template>
    <div class="modal">
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