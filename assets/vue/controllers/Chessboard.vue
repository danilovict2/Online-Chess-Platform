<template>
    <div id="chessboard" ref="chessboard" @mousemove="e => moveCurrentPieceDOMElement(e)" @mouseup="e => dropPiece(e)">
        <Tile v-for="tile in board.state" :key="tile" :tile-number="tile.x + tile.y" :piece-image="tile.pieceImage"
            :is-possible-move="possibleMoves.some(move => samePosition(move, tile))" @move-piece="grapPiece" />
    </div>
    <PromotionModal v-show="promotionPawn" :team="promotionPawn?.team" @promote-to="promoteTo" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Tile from '../components/Tile.vue';
import PromotionModal from '../components/PromotionModal.vue';
import { createRefereeForType } from '../common/helpers.js';
import { board } from '../stores/board.js';
import { GRID_COL_SIZE, pieces as defaultPieceLayout, BLACK_PIECES_START_Y, WHITE_PIECES_START_Y } from '../common/constants.js';

const chessboard = ref(null);

let boardLimits = null;
let currentPiece = null;
let possibleMoves = ref([]);
let pieces = ref(defaultPieceLayout);
let promotionPawn = ref(null);
let currentPieceDOMElement = ref(null);

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
    currentPieceDOMElement.value = piece;
    moveCurrentPieceDOMElement(e);

    const currentPieceTile = findClosestTile(e.clientX, e.clientY);
    currentPiece = pieces.value.find(p => samePosition(p, currentPieceTile));
    if (!((currentPiece.team === 'w' && board.turn % 2 === 0) || (currentPiece.team === 'b' && board.turn % 2 !== 0))) {
        calculatePossibleMoves();
    }
    
}

function calculatePossibleMoves() {
    possibleMoves.value = createRefereeForType(currentPiece.type).getPossibleMoves(currentPiece);
    let possibleMovesThatEndangerTheKing = getPossibleMovesThatEndangerTheKing();
    possibleMoves.value = possibleMoves.value.filter(move => !possibleMovesThatEndangerTheKing.some(m => m === move));
}

function getPossibleMovesThatEndangerTheKing() {
    let movesToRemove = [];
    for (const move of possibleMoves.value) {
        const currentPieceState = board.pieces;
        board.pieces = createSimulatedBoardForMove(move, currentPiece.type).pieces;
        const enemyPieces = board.pieces.filter(p => p.team !== currentPiece.team);

        if (canEnemyPieceCaptureKing(enemyPieces)) {
            movesToRemove.push(move);
        }
        board.pieces = currentPieceState;
    }
    return movesToRemove;
}

function createSimulatedBoardForMove(move) {
    const simulatedBoard = JSON.parse(JSON.stringify(board));

    const pieceAtDestination = simulatedBoard.pieces.find(p => samePosition(p, move));
    if (pieceAtDestination !== undefined) {
        simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !samePosition(p, move));
    }

    const simulatedPiece = simulatedBoard.pieces.find(p => samePosition(p, currentPiece));
    [simulatedPiece.x, simulatedPiece.y] = [move.x, move.y];
    return simulatedBoard;
}

function canEnemyPieceCaptureKing(enemyPieces) {
    const king = board.pieces.find(p => p.type === 'King' && p.team === currentPiece.team);
    for (const p of enemyPieces) {
        const possibleMoves = createRefereeForType(p.type).getPossibleMoves(p);
        if (p.type === 'Pawn' && possibleMoves.some(m => m.x !== p.x && samePosition(m, king))) {
            return true;
        } else if (possibleMoves.some(m => samePosition(m, king))) {
            return true;
        }
    }
    return false;
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
        const toMovetile = findClosestTile(e.clientX, e.clientY);
        const referee = createRefereeForType(currentPiece.type);

        if (possibleMoves.value.some(move => samePosition(move, toMovetile))) {
            const direction =
                (referee.isEnPassant({ x: currentPiece.x, y: currentPiece.y }, toMovetile, currentPiece.team)) ?
                    (currentPiece.team === 'w') ? 1 : -1 : 0;
            playMove(direction, toMovetile);
        } else {
            currentPieceDOMElement.value.style.position = 'relative';
            currentPieceDOMElement.value.style.removeProperty('top');
            currentPieceDOMElement.value.style.removeProperty('left');
        }
        currentPieceDOMElement.value = null;
        possibleMoves.value = [];
    }
}

function playMove(direction, toMovetile) {
    pieces.value = pieces.value.reduce((newPieces, piece) => {
        piece.enPassant = false;
        // FOUND CAPTURED PIECE
        if (samePosition(piece, { x: toMovetile.x, y: toMovetile.y - direction })) {
            return newPieces;
        }
        if (piece === currentPiece) {
            movePieceWithEnPassantCheck(piece, toMovetile);
        }
        if (canBePromoted(piece)) {
            promotionPawn.value = piece;
        }

        newPieces.push(piece);
        return newPieces;
    }, []);
    board.turn++;
}

function movePieceWithEnPassantCheck(piece, toMovetile) {
    piece.enPassant = piece.type === 'Pawn' && Math.abs(piece.y - toMovetile.y) === 2;
    piece.x = toMovetile.x;
    piece.y = toMovetile.y;
}

function canBePromoted(piece) {
    const promotionRow = (piece.team === 'w') ? BLACK_PIECES_START_Y : WHITE_PIECES_START_Y;
    return piece.type === 'Pawn' && piece.y === promotionRow;
}

function promoteTo(pieceType) {
    if (promotionPawn.value) {
        pieces.value = pieces.value.map(piece => {
            if (piece === promotionPawn.value) {
                piece.type = pieceType;
                piece.image = `images/${pieceType.toLowerCase()}_${piece.team}.png`;
            }
            return piece;
        });
        promotionPawn.value = null;
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