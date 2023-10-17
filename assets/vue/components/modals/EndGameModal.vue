<template>
    <div class="modal">
        <div class="body">
            <div class="checkmate-body">
                <span>The winner is {{ winner }}</span>
                <button @click="resetBoard">Play again</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const { winner } = defineProps({
    winner: String
});

function resetBoard() {
    location.reload();
}
</script>

<style scoped>
.checkmate-body {
    display: flex;
    flex-direction: column;
    gap: 48px;
}

.checkmate-body > span {
    font-size: 32px;
    color: white;
}

.checkmate-body > button {
    background-color: rgba(0, 0, 0, 0.8);
    padding: 24px 48px;
    border: none;
    border-radius: 8px;
    font-size: 32px;
    color: white;
}

.checkmate-body > button:hover {
    cursor: pointer;
}
</style>