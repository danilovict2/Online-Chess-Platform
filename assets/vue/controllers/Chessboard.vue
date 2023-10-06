<template>
    <div id="chessboard" ref="chessboard" @mousemove="e => movePiece(e)" @mouseup="e => dropPiece(e)">
        <Tile v-for="tile in board.state" :key="tile" :tile-number="tile.number" :piece-image="tile.pieceImage"
            @move-piece="grapPiece" />
    </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import Tile from './../components/Tile.vue';
import useBoard from './../composables/board.js';
import useReferee from './../composables/referee.js';
import { board } from './../stores/board.js';

const chessboard = ref(null);

let boardHelper = null;
let pieces = ref(null);
let selectedPiece = reactive({ piece: null, cell: { x: null, y: null } });

onMounted(() => {
    boardHelper = useBoard(chessboard);
    pieces.value = boardHelper.pieces;
});

watch(pieces, newPieces => board.updateState(newPieces), { deep: true });

function grapPiece(piece, e) {
    selectedPiece.piece = piece;
    selectedPiece.cell = boardHelper.findClosestCell(e.clientX, e.clientY);
}

function movePiece(e) {
    if (selectedPiece.piece) {
        const x = e.pageX - 50;
        const y = e.pageY - 50;
        selectedPiece.piece.style.left = `${Math.min(Math.max(x, boardHelper.boardLimits.minX), boardHelper.boardLimits.maxX)}px`;
        selectedPiece.piece.style.top = `${Math.min(Math.max(y, boardHelper.boardLimits.minY), boardHelper.boardLimits.maxY)}px`;
    }
}

function dropPiece(e) {
    if (selectedPiece.piece) {
        const closestCell = boardHelper.findClosestCell(e.clientX, e.clientY);
        const currentPiece = pieces.value.find(p => p.x === selectedPiece.cell.x && p.y === selectedPiece.cell.y);
        const referee = useReferee().createRefereeForType(currentPiece.type);

        if (currentPiece) {
            if (referee.isValidMove(selectedPiece.cell, closestCell, currentPiece.team)) {
                pieces.value = pieces.value.reduce((newPieces, piece) => {
                    if (piece.type === 'Pawn') {
                        piece.enPassant = false;
                    }

                    if (piece.x === closestCell.x && piece.y === closestCell.y) {
                        return newPieces;
                    }

                    if (piece.x === currentPiece.x && piece.y === currentPiece.y) {
                        if (Math.abs(closestCell.y - currentPiece.y) === 2 && piece.type === 'Pawn') {
                            piece.enPassant = true;
                        }
                        piece.x = closestCell.x;
                        piece.y = closestCell.y;
                    }

                    newPieces.push(piece);
                    return newPieces;
                }, []);
            } else if (referee.isEnPassant(selectedPiece.cell, closestCell, currentPiece.team)) {
                const direction = (currentPiece.team === 'w') ? 1 : -1;
                pieces.value = pieces.value.reduce((newPieces, piece) => {
                    if (piece.type === 'Pawn') {
                        piece.enPassant = false;
                    }

                    if (piece.x === closestCell.x && piece.y === closestCell.y - direction) {
                        return newPieces;
                    }

                    if (piece.x === currentPiece.x && piece.y === currentPiece.y) {
                        piece.x = closestCell.x;
                        piece.y = closestCell.y;
                    }

                    newPieces.push(piece);
                    return newPieces;
                }, []);
            } else {
                selectedPiece.piece.style.position = 'relative';
                selectedPiece.piece.style.removeProperty('top');
                selectedPiece.piece.style.removeProperty('left');
            }
        }
        selectedPiece.piece = null;
    }
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