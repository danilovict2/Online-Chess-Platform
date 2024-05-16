const initWebSocket = (gameId, userId, playMove, promote, enablePlayAgainModal) => {
    const url = JSON.parse(document.getElementById("mercure-url").textContent);
    const eventSource = new EventSource(url);

    eventSource.onmessage = event => {
        const data = JSON.parse(event.data);
        if (event.lastEventId === 'move-played') {
            if (data.game_id === gameId) {
                playMove(JSON.parse(data.piece), JSON.parse(data.toMoveTile));
            }
        }

        if (event.lastEventId === 'promotion-move-played') {
            if (data.game_id === gameId) {
                promote(JSON.parse(data.promotedPawn), data.pieceType, JSON.parse(data.promotionTile));
            }
        }

        if (event.lastEventId === 'play-again-request') {
            if (data.game_id === gameId && data.opponent_id === userId) {
                enablePlayAgainModal();
            }
        }

        if (event.lastEventId === 'redirect-to-new-game') {
            window.location = data.url;
        }
    }
};

export default initWebSocket;
