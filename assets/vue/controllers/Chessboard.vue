<template>
    <UserData :player="game.players[1]" player-team="b" :opponent="game.players[0]"></UserData>
    <div id="chessboard" ref="chessboard" @mousemove="e => moveCurrentPieceDOMElement(e)" @mouseup="e => dropPiece(e)">
        <Tile v-for="tile in board.state" :key="tile" :x="tile.x" :y="tile.y" :piece-image="tile.pieceImage"
            :is-possible-move="possibleMoves.some(move => samePosition(move, tile))" @grab-piece="grabPiece" />
    </div>
    <UserData :player="game.players[0]" player-team="w" :opponent="game.players[1]"></UserData>
    <PromotionModal v-show="promotionPawn?.team === currentPlayerTeam" :team="currentPlayerTeam"
        @promote-to="promoteTo" />
    <EndGameModal v-show="gameOverMessage && !isPlayAgainModalActive" :message="gameOverMessage"
        @sendPlayAgainProposal="sendPlayAgainProposal" />
    <PlayAgainModal v-show="isPlayAgainModalActive" @disable="disablePlayAgainModal" :opponent="opponent"
        :length="game.length" @accept="playAgain" />
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { sendPostRequest } from '../services/axios.js';
import Tile from '../components/Tile.vue';
import PromotionModal from '../components/modals/PromotionModal.vue';
import EndGameModal from '../components/modals/EndGameModal.vue';
import PlayAgainModal from '../components/modals/PlayAgainModal.vue';
import { samePosition } from '../common/helpers.js';
import { board } from '../stores/board.js';
import { BLACK_PIECES_START_Y, GRID_COL_SIZE, WHITE_PIECES_START_Y } from '../common/constants.js';
import PossibleMovesCalculator from '../services/PossibleMovesCalculator.js';
import PromotionHandler from '../services/PromotionHandler.js';
import MoveHandler from '../services/MoveHandler.js';
import EndgameHandler from '../services/EndgameHandler.js';
import UserData from '../components/UserData.vue';
import initWebSocket from '../services/websocket';
import { timers } from '../stores/timers';
import EloChangeCalculator from '../services/EloChangeCalculator';
import axios from 'axios';

const { game, user } = defineProps({
    game: Object,
    user: Object
});

game.players = game.engine ? [game.players[0], game.engine] : game.players;
board.loadState(game);
initWebSocket(game.id, user.id, playMove, promote, enablePlayAgainModal);

const chessboard = ref(null);
let currentPiece = null;
let boardLimits = {};
let promotionTile = null;
const possibleMoves = ref([]);
const promotionPawn = ref(null);
const currentPieceDOMElement = ref(null);
const gameOverMessage = ref('');
const isPlayAgainModalActive = ref(false);
const currentPlayerTeam = user.id === game.players[0].id ? 'w' : 'b';
const opponent = user.id === game.players[0].id ? game.players[1] : game.players[0];


watchEffect(() => {
    if (timers.whiteTimer.isExpired || timers.blackTimer.isExpired) {
        const gameStatus = new EndgameHandler().getGameStatus('', currentPlayerTeam);
        gameOverMessage.value = gameStatus.message;
        updateElo(gameStatus.status);
    }

    if (gameOverMessage.value) {
        board.isGameOver = true;
        sendPostRequest(`/game/${game.id}/delete`, null);
    }

    if (game.engine && board.activeColor !== currentPlayerTeam && !gameOverMessage.value) {
        playEngineMove();
    }
});

setInterval(setBoardLimits, 100);

function setBoardLimits() {
    boardLimits = {
        minX: chessboard.value.offsetLeft - 25,
        minY: chessboard.value.offsetTop - 25,
        maxX: chessboard.value.offsetLeft + chessboard.value.clientWidth - 75,
        maxY: chessboard.value.offsetTop + chessboard.value.clientHeight - 90
    };
}

function grabPiece(pieceDOMElement, e) {
    currentPieceDOMElement.value = pieceDOMElement;
    moveCurrentPieceDOMElement(e);

    const currentPieceTile = findClosestTile(e.clientX, e.clientY);
    currentPiece = board.pieces.get(`${currentPieceTile.x}-${currentPieceTile.y}`);
    calculatePossibleMoves();
}

function calculatePossibleMoves() {
    if (currentPiece.team === currentPlayerTeam && board.activeColor === currentPlayerTeam) {
        possibleMoves.value = new PossibleMovesCalculator().calculatePossibleMovesForPiece(currentPiece);
    }
}


function moveCurrentPieceDOMElement(e) {
    if (currentPieceDOMElement.value) {
        const x = e.pageX - GRID_COL_SIZE / 2;
        const y = e.pageY - GRID_COL_SIZE / 2;
        currentPieceDOMElement.value.style.left = `${Math.min(Math.max(x, boardLimits.minX), boardLimits.maxX)}px`;
        currentPieceDOMElement.value.style.top = `${Math.min(Math.max(y, boardLimits.minY), boardLimits.maxY)}px`;
    }
}

function dropPiece(e) {
    if (!currentPieceDOMElement.value) return;

    const toMoveTile = findClosestTile(e.clientX, e.clientY);
    if (possibleMoves.value.some(move => samePosition(move, toMoveTile))) {
        if (isPromotionMove(currentPiece, toMoveTile)) {
            promotionTile = toMoveTile;
            enablePromotionModal();
            resetCurrentPieceDOMElementPosition();
        } else {
            const moveData = new FormData();
            moveData.append('piece', JSON.stringify(currentPiece));
            moveData.append('toMoveTile', JSON.stringify(toMoveTile));
            sendPostRequest(`/game/${game.id}/move-played`, moveData);
        }
    } else {
        resetCurrentPieceDOMElementPosition();
    }
    currentPieceDOMElement.value = null;
    possibleMoves.value = [];
}

function playEngineMove() {
    const data = new FormData();
    data.append('gameId', game.id);

    axios.post('/engine/best-move', data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
        .then(res => {
            const move = res.data;
            const toMoveTile = { x: move.charCodeAt(2) - 97 + 1, y: Number(move[3]) };
            const piece = board.pieces.get(`${move.charCodeAt(0) - 97 + 1}-${move[1]}`);

            if (isPromotionMove(piece, toMoveTile)) {
                promote(piece, board.getPieceFromType(move[4]), toMoveTile);
            } else {
                playMove(piece, toMoveTile);
            }
        })
        .catch(e => console.log(e));
}

function findClosestTile(clientX, clientY) {
    // +1 added to start indexing from 1
    const x = Math.floor((clientX - (boardLimits.minX + 25)) / GRID_COL_SIZE) + 1;
    // -825 inverts y
    const y = Math.abs(Math.ceil((clientY - boardLimits.minY - 825) / GRID_COL_SIZE)) + 1;

    return { x, y };
}

function isPromotionMove(piece, toMoveTile) {
    if (piece.type !== 'Pawn') return false;
    const promotionRow = (piece.team === 'w') ? BLACK_PIECES_START_Y : WHITE_PIECES_START_Y;
    return toMoveTile.y === promotionRow;
}

function playMove(pieceToMove, toMoveTile) {
    board.updateState(new MoveHandler().playMove(pieceToMove, toMoveTile));
    board.saveState(game.id);

    const gameStatus = new EndgameHandler().getGameStatus(pieceToMove.team, currentPlayerTeam);
    if (gameStatus.status === -1) return;

    gameOverMessage.value = gameStatus.message;
    updateElo(gameStatus.status);
}


function updateElo(gameStatus) {
    // No elo change if the game was against engine
    if (game.engine) return;

    const data = new FormData();
    data.append('elo', EloChangeCalculator.eloChange(user, opponent, gameStatus));
    sendPostRequest('/game/update-elo', data);
}

function resetCurrentPieceDOMElementPosition() {
    currentPieceDOMElement.value.style.position = 'relative';
    currentPieceDOMElement.value.style.removeProperty('top');
    currentPieceDOMElement.value.style.removeProperty('left');
}

function enablePromotionModal() {
    promotionPawn.value = currentPiece;
}

function promoteTo(pieceType) {
    const promotionData = new FormData();
    promotionData.append('promotedPawn', JSON.stringify(promotionPawn.value));
    promotionData.append('pieceType', pieceType);
    promotionData.append('promotionTile', JSON.stringify(promotionTile));
    sendPostRequest(`/game/${game.id}/promotion-move-played`, promotionData);
    promotionPawn.value = null;
}

function promote(promotedPawn, pieceType, promotionTile) {
    board.updateState(new PromotionHandler().promote(promotedPawn, pieceType));
    playMove(promotedPawn, promotionTile);
}

function sendPlayAgainProposal() {
    sendPostRequest(`/game/${game.id}/play-again-request/${opponent.id}`, null);
}

function enablePlayAgainModal() {
    isPlayAgainModalActive.value = true;
}

function disablePlayAgainModal() {
    isPlayAgainModalActive.value = false;
}

function playAgain() {
    let data = new FormData();
    data.append('opponent_id', opponent.id);
    data.append('length', game.length);
    sendPostRequest('/game/accept-rematch', data);
}
</script>

<style scoped>
#chessboard {
    display: grid;
    grid-template-columns: repeat(8, 100px);
    grid-template-rows: repeat(8, 100px);
    width: 800px;
    height: 800px;
}
</style>
