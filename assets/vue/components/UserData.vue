<template>
    <div class="user-data">
        <span>
            <img src="/images/default-user-image.svg" class="d-inline-block align-text-top">
            {{ player.username }} (800)
        </span>
        <Clock :team="playerTeam"></Clock>
    </div>
</template>

<script setup>
import Clock from './Clock.vue';
defineProps({
    player: Object,
    playerTeam: String
});
</script>

<style scoped>
.user-data {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 2rem;
}

.user-data > span {
    font-size: 1rem;
    font-weight: 600;
}

.user-data > span > img {
    height: 40px;
    width: 40px;
}
</style>