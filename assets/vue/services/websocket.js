import { pusher } from '../../pusher.js';

const initWebSocket = (gameId, playMove, promote) => {
    const gameChannel = pusher.subscribe('game');

    gameChannel.bind('move_played', data => {
        if (data.game_id === gameId) {
            playMove(JSON.parse(data.piece), JSON.parse(data.toMoveTile));
        }
    });

    gameChannel.bind('promotion_move_played', data => {
        if (data.game_id === gameId) {
            promote(JSON.parse(data.promotedPawn), data.pieceType, JSON.parse(data.promotionTile));
        }
    });
};

export default initWebSocket;
