<template>
    <div id="chessboard" ref="chessboard" @mousemove="e => movePiece(e)" @mouseup="e => dropPiece(e)">
        <Tile v-for="tile in board.state" :key="tile" 
            :tile-number="tile.x + tile.y" :piece-image="tile.pieceImage"
            :is-possible-move="possibleMoves.find(move => move.x === tile.x && move.y === tile.y) !== undefined" 
            @move-piece="grapPiece" 
        />
    </div>
    <PromotionModal v-show="promotionPawn" :team="promotionPawn?.team" @promote-to="promoteTo" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Tile from '../components/Tile.vue';
import PromotionModal from '../components/PromotionModal.vue';
import { createRefereeForType } from '../common/helpers.js';
import { board } from '../stores/board.js';
import { GRID_COL_SIZE, pieces as piecesOnTheBoard, BLACK_PIECES_START_Y, WHITE_PIECES_START_Y } from '../common/constants.js';

const chessboard = ref(null);

let boardLimits = null;
let currentPiece = null;
let possibleMoves = ref([]);
let pieces = ref(piecesOnTheBoard);
let promotionPawn = ref(null);
let selectedPiece = ref(null);

onMounted(() => {
    boardLimits = {
        minX: chessboard.value.offsetLeft - 25,
        minY: chessboard.value.offsetTop - 25,
        maxX: chessboard.value.offsetLeft + chessboard.value.clientWidth - 75,
        maxY: chessboard.value.offsetTop + chessboard.value.clientHeight - 90
    };
});

watch(pieces, newPieces => board.updateState(newPieces), { deep: true, immediate: true });

function grapPiece(piece, e) {
    selectedPiece.value = piece;
    const currentPieceTile = findClosestTile(e.clientX, e.clientY);
    currentPiece = pieces.value.find(p => samePosition(p, currentPieceTile));
    possibleMoves.value = createRefereeForType(currentPiece.type).getPossibleMoves(currentPiece);
}

function movePiece(e) {
    if (selectedPiece.value) {
        const x = e.pageX - GRID_COL_SIZE / 2;
        const y = e.pageY - GRID_COL_SIZE / 2;
        selectedPiece.value.style.left = `${Math.min(Math.max(x, boardLimits.minX), boardLimits.maxX)}px`;
        selectedPiece.value.style.top = `${Math.min(Math.max(y, boardLimits.minY), boardLimits.maxY)}px`;
    }
}

function dropPiece(e) {
    if (selectedPiece.value) {
        const toMovetile = findClosestTile(e.clientX, e.clientY);
        const referee = createRefereeForType(currentPiece.type);

        if (referee.isValidMove({ x: currentPiece.x, y: currentPiece.y }, toMovetile, currentPiece.team)) {
            const direction = (referee.isEnPassant({ x: currentPiece.x, y: currentPiece.y }, toMovetile, currentPiece.team)) ?
                (currentPiece.team === 'w') ? 1 : -1 : 0;

            pieces.value = pieces.value.reduce((newPieces, piece) => {
                if (piece.type === 'Pawn') {
                    piece.enPassant = false;
                }

                if (samePosition(piece, { x: toMovetile.x, y: toMovetile.y - direction })) {
                    return newPieces;
                }

                if (piece === currentPiece) {
                    piece.enPassant = piece.type === 'Pawn' && Math.abs(currentPiece.y - toMovetile.y) === 2;
                    piece.x = toMovetile.x;
                    piece.y = toMovetile.y;
                }

                const promotionRow = (piece.team === 'w') ? BLACK_PIECES_START_Y : WHITE_PIECES_START_Y;
                if (piece.type === 'Pawn' && piece.y === promotionRow) {
                    promotionPawn.value = piece;
                }
                newPieces.push(piece);
                return newPieces;
            }, []);
        } else {
            selectedPiece.value.style.position = 'relative';
            selectedPiece.value.style.removeProperty('top');
            selectedPiece.value.style.removeProperty('left');
        }
        selectedPiece.value = null;
        possibleMoves.value = [];
    }
}

function promoteTo(pieceType) {
    if (promotionPawn.value) {
        pieces.value = pieces.value.reduce((newPieces, piece) => {
            if (piece === promotionPawn.value) {
                piece.type = pieceType;
                piece.image = `images/${pieceType.toLowerCase()}_${piece.team}.png`;
            }
            newPieces.push(piece);
            return newPieces;
        }, []);
        promotionPawn.value = null;
    }

}

function findClosestTile(clientX, clientY) {
    // +1 added to start indexing from 1
    const x = Math.floor((clientX - (boardLimits.minX + 25)) / GRID_COL_SIZE) + 1;
    // -800 inverts y
    const y = Math.abs(Math.ceil((clientY - boardLimits.minY - 825) / GRID_COL_SIZE)) + 1;

    return { x, y };
}

function samePosition(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
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