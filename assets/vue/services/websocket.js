import { pusher } from '../../pusher.js';

const initWebSocket = (gameId, userId, playMove, promote, enablePlayAgainModal) => {
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

    gameChannel.bind('play_again_request', data => {
        if (data.game_id === gameId && data.opponent_id === userId) {
            enablePlayAgainModal();
        }
    });

    gameChannel.bind('redirect_to_new_game', data => {
        window.location = data.url;
    });
};

export default initWebSocket;
