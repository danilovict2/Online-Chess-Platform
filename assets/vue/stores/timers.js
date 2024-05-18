import { reactive } from "vue";
import { board } from "./board.js";
import { useTimer } from "vue-timer-hook";

export const timers = reactive({
    whiteTimer: null,
    blackTimer: null,

    setTimers(whTimerData, blTimerData, turnStart) {
        const msPassed = new Date().getTime() - turnStart;
        const sPassed = parseInt((msPassed / 1000) % 60);
        const mPassed = parseInt((msPassed / (1000 * 60)) % 60);

        const whAdjustedMinutes = board.activeColor === 'w' ? whTimerData.minutes - mPassed : whTimerData.minutes;
        const whAdjustedSeconds = board.activeColor === 'w' ? whTimerData.seconds - sPassed : whTimerData.seconds;
        const blAdjustedMinutes = board.activeColor === 'w' ? blTimerData.minutes : blTimerData.minutes - mPassed;
        const blAdjustedSeconds = board.activeColor === 'w' ? blTimerData.seconds : blTimerData.seconds - sPassed;

        this.whiteTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + whAdjustedMinutes * 60 + whAdjustedSeconds));
        this.blackTimer = useTimer(new Date().setSeconds(new Date().getSeconds() + blAdjustedMinutes * 60 + blAdjustedSeconds));
    }
});