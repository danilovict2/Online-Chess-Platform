<template>
    <div class="clock">
        {{ clock.minutes.toString().length === 2 ? clock.minutes : `0${clock.minutes}` }} : 
        {{ clock.seconds.toString().length === 2 ? clock.seconds : `0${clock.seconds}` }}
    </div>
</template>

<script setup>
import { watchEffect } from 'vue';
import { board } from '../stores/board';
import { timers } from '../stores/timers';

const { team } = defineProps({
    team: String,
});
const clock = team === 'w' ? timers.whiteTimer : timers.blackTimer;

watchEffect(() => {
    if ((board.turn % 2 !== 0 && team === 'w') || (board.turn % 2 === 0 && team === 'b') && !board.isGameOver) {
        clock.resume();
    } else {
        clock.pause();
    }
});
</script>