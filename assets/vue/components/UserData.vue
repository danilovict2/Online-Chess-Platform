<template>
    <div class="user-data">
        <span>
            <img src="/images/default-user-image.svg" class="d-inline-block align-text-top">
            {{ player.username }} ({{ player.elo }}) (win +{{ winElo }} / tie {{ (tieElo < 0 ? "":"+") + tieElo }} / loss {{ lossElo }})
        </span>
        <Clock :team="playerTeam"></Clock>
    </div>
</template>

<script setup>
import EloChangeCalculator from '../services/EloChangeCalculator';
import Clock from './Clock.vue';
const props = defineProps({
    player: Object,
    opponent: Object,
    playerTeam: String,
});


const winElo = EloChangeCalculator.eloChange(props.player, props.opponent, 1);
const tieElo = EloChangeCalculator.eloChange(props.player, props.opponent, 0.5);
const lossElo = EloChangeCalculator.eloChange(props.player, props.opponent, 0);
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