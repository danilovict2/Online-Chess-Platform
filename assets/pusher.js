import Pusher from 'pusher-js';

const pusher = new Pusher('3fec553cfd5190398c42', {
    cluster: 'eu'
});

const waitingRoomChannel = pusher.subscribe('waiting-room');
waitingRoomChannel.bind('match-found', () => {
    location.reload();
});