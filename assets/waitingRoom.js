import { pusher } from "./pusher.js";

const waitingRoomChannel = pusher.subscribe('waiting-room');
waitingRoomChannel.bind('match-found', () => {
    location.reload();
});