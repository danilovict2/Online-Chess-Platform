<template>
    <div class="modal">
        <div class="body">
            <div class="endgame-modal-body">
                <span>{{ message }}</span>
                <button @click="resetBoard">Play again</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const { message } = defineProps({
    message: String
});

function resetBoard() {
    location.reload();
}
</script>

<style scoped>
.endgame-modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
}

.endgame-modal-body > span {
    font-size: 32px;
    color: white;
}

.endgame-modal-body > button {
    background-color: rgba(0, 0, 0, 0.8);
    padding: 24px 48px;
    border: none;
    border-radius: 8px;
    font-size: 32px;
    color: white;
}

.endgame-modal-body > button:hover {
    cursor: pointer;
}
</style>