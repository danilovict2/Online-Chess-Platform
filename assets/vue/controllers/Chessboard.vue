<template>
    <div id="chessboard" ref="chessboard" @mousemove="e => movePiece(e)" @mouseup="e => dropPiece(e)">
        <Tile v-for="tile in board.state" :key="tile" :tile-number="tile.number" :piece-image="tile.pieceImage"
            @move-piece="grapPiece" />
    </div>
    <PromotionModal v-show="promotionPawn" :team="promotionPawn?.team" @promote-to="promoteTo"/>
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import Tile from '../components/Tile.vue';
import PromotionModal from '../components/PromotionModal.vue';
import { createRefereeForType } from '../common/helpers.js';
import { board } from '../stores/board.js';
import { GRID_COL_SIZE, pieces as piecesOnTheBoard, BLACK_PIECES_START_Y, WHITE_PIECES_START_Y } from '../common/constants.js';

const chessboard = ref(null);

let boardLimits = null;
let pieces = ref(piecesOnTheBoard);
let promotionPawn = ref(null);
let selectedPiece = reactive({ piece: null, tile: { x: null, y: null } });

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
    selectedPiece.piece = piece;
    selectedPiece.tile = findClosestTile(e.clientX, e.clientY);
}

function movePiece(e) {
    if (selectedPiece.piece) {
        const x = e.pageX - GRID_COL_SIZE / 2;
        const y = e.pageY - GRID_COL_SIZE / 2;
        selectedPiece.piece.style.left = `${Math.min(Math.max(x, boardLimits.minX), boardLimits.maxX)}px`;
        selectedPiece.piece.style.top = `${Math.min(Math.max(y, boardLimits.minY), boardLimits.maxY)}px`;
    }
}

function dropPiece(e) {
    if (selectedPiece.piece) {
        const toMovetile = findClosestTile(e.clientX, e.clientY);
        const currentPiece = pieces.value.find(p => samePosition(p, selectedPiece.tile));
        const referee = createRefereeForType(currentPiece.type);

        if (referee.isValidMove(selectedPiece.tile, toMovetile, currentPiece.team)) {
            const direction = (referee.isEnPassant(selectedPiece.tile, toMovetile, currentPiece.team)) ? 
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
            selectedPiece.piece.style.position = 'relative';
            selectedPiece.piece.style.removeProperty('top');
            selectedPiece.piece.style.removeProperty('left');
        }
        selectedPiece.piece = null;
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