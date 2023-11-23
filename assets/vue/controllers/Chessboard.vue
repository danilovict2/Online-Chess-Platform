<template>
    <div class="user-data">
        <span>
            <img src="/images/default-user-image.svg" class="d-inline-block align-text-top">
            {{ game.players[1].username }} (800)
        </span>
        <Clock team="b"></Clock>
    </div>
    <div id="chessboard" ref="chessboard" @mousemove="e => moveCurrentPieceDOMElement(e)" @mouseup="e => dropPiece(e)">
        <Tile v-for="tile in board.state" :key="tile" :x="tile.x" :y="tile.y" :piece-image="tile.pieceImage"
            :is-possible-move="possibleMoves.some(move => samePosition(move, tile))" @grab-piece="grabPiece" />
    </div>
    <div class="user-data">
        <span>
            <img src="/images/default-user-image.svg" class="d-inline-block align-text-top">
            {{ game.players[0].username }} (800)
        </span>
        <Clock team="w"></Clock>
    </div>
    <PromotionModal v-show="promotionPawn?.team === currentPlayerTeam" :team="currentPlayerTeam" @promote-to="promoteTo" />
    <EndGameModal v-show="endgameMessage" :message="endgameMessage" />
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { pusher } from '../../pusher.js';
import axios from 'axios';
import Tile from '../components/Tile.vue';
import Clock from '../components/Clock.vue';
import PromotionModal from '../components/modals/PromotionModal.vue';
import EndGameModal from '../components/modals/EndGameModal.vue';
import { samePosition } from '../common/helpers.js';
import { board } from '../stores/board.js';
import { BLACK_PIECES_START_Y, GRID_COL_SIZE, WHITE_PIECES_START_Y, pieces as defaultPieceLayout } from '../common/constants.js';
import PossibleMovesCalculator from '../services/PossibleMovesCalculator.js';
import PromotionHandler from '../services/PromotionHandler.js';
import MoveHandler from '../services/MoveHandler.js';
import EndgameHandler from '../services/EndgameHandler.js';

const { game, user } = defineProps({
    game: Object,
    user: Object
});
board.setClocks(game.length);
const currentPlayerTeam = user.id === game.players[0].id ? 'w' : 'b';

const gameChannel = pusher.subscribe('game');

gameChannel.bind('move_played', data => {
    if (data.game_id === game.id) {
        playMove(JSON.parse(data.piece), JSON.parse(data.toMoveTile));
    }
});

gameChannel.bind('promotion_move_played', data => {
    if (data.game_id === game.id) {
        promote(JSON.parse(data.promotedPawn), data.pieceType, JSON.parse(data.promotionTile));
    }
});

const chessboard = ref(null);
let boardLimits = null;
let currentPiece = null;
let possibleMoves = ref([]);
let promotionPawn = ref(null);
let promotionTile = null;
let currentPieceDOMElement = ref(null);
let endgameMessage = ref('');

board.updateState(defaultPieceLayout);

watchEffect(() => {
    if (board.whiteTimer.isExpired || board.blackTimer.isExpired) {
        endgameMessage.value = board.whiteTimer.isExpired ? 'Black won on time' : 'White won on time';
    }

    if (endgameMessage.value) {
        board.whiteTimer.pause();
        board.blackTimer.pause();
    }
});

onMounted(() => {
    boardLimits = {
        minX: chessboard.value.offsetLeft - 25,
        minY: chessboard.value.offsetTop - 25,
        maxX: chessboard.value.offsetLeft + chessboard.value.clientWidth - 75,
        maxY: chessboard.value.offsetTop + chessboard.value.clientHeight - 90
    };
});

function grabPiece(pieceDOMElement, e) {
    currentPieceDOMElement.value = pieceDOMElement;
    moveCurrentPieceDOMElement(e);

    const currentPieceTile = findClosestTile(e.clientX, e.clientY);
    currentPiece = board.pieces.get(`${currentPieceTile.x}-${currentPieceTile.y}`);
    if (
        (currentPiece.team === 'w' && board.turn % 2 !== 0 && currentPlayerTeam === 'w') ||
        (currentPiece.team === 'b' && board.turn % 2 === 0 && currentPlayerTeam === 'b')
    ) {
        possibleMoves.value = new PossibleMovesCalculator().calculatePossibleMovesForPiece(currentPiece);
    }
}

function findClosestTile(clientX, clientY) {
    // +1 added to start indexing from 1
    const x = Math.floor((clientX - (boardLimits.minX + 25)) / GRID_COL_SIZE) + 1;
    // -825 inverts y
    const y = Math.abs(Math.ceil((clientY - boardLimits.minY - 825) / GRID_COL_SIZE)) + 1;

    return { x, y };
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
    if (currentPieceDOMElement.value) {
        const toMoveTile = findClosestTile(e.clientX, e.clientY);

        if (possibleMoves.value.some(move => samePosition(move, toMoveTile))) {
            if (isPromotionMove(currentPiece, toMoveTile)) {
                promotionTile = toMoveTile;
                enablePromotionModal(currentPiece);
                resetCurrentPieceDOMElementPosition();
            } else {
                let moveData = new FormData();
                moveData.append('piece', JSON.stringify(currentPiece));
                moveData.append('toMoveTile', JSON.stringify(toMoveTile));
                axios.post(`/game/${game.id}/move-played`, moveData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
            }
        } else {
            resetCurrentPieceDOMElementPosition();
        }

        currentPieceDOMElement.value = null;
        possibleMoves.value = [];
    }
}

function isPromotionMove(piece, toMoveTile) {
    if (piece.type !== 'Pawn') return false;
    const promotionRow = (piece.team === 'w') ? BLACK_PIECES_START_Y : WHITE_PIECES_START_Y;
    return toMoveTile.y === promotionRow;
}

function playMove(pieceToMove, toMoveTile) {
    board.updateState(new MoveHandler().playMove(pieceToMove, toMoveTile));
    endgameMessage.value = new EndgameHandler().checkAndHandleEndgame(pieceToMove.team);
}

function resetCurrentPieceDOMElementPosition() {
    currentPieceDOMElement.value.style.position = 'relative';
    currentPieceDOMElement.value.style.removeProperty('top');
    currentPieceDOMElement.value.style.removeProperty('left');
}

function enablePromotionModal(promotedPawn) {
    promotionPawn.value = promotedPawn;
}

function promoteTo(pieceType) {
    let promotionData = new FormData();
    promotionData.append('promotedPawn', JSON.stringify(promotionPawn.value));
    promotionData.append('pieceType', pieceType);
    promotionData.append('promotionTile', JSON.stringify(promotionTile));
    axios.post(`/game/${game.id}/promotion-move-played`, promotionData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    promotionPawn.value = null;
}

function promote(promotedPawn, pieceType, promotionTile) {
    board.updateState(new PromotionHandler().promote(promotedPawn, pieceType));
    playMove(promotedPawn, promotionTile);
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