import { createRefereeForType } from "../../common/helpers.js";
import { board } from "../../stores/board.js";
import Referee from "./Referee.js";

export default class KingReferee extends Referee {
    isValidMove(startTile, toMoveTile, team) {
        const directionX = (toMoveTile.x < startTile.x) ? -1 : (toMoveTile.x > startTile.x) ? 1 : 0;
        const directionY = (toMoveTile.y < startTile.y) ? -1 : (toMoveTile.y > startTile.y) ? 1 : 0;
        return (startTile.x + directionX === toMoveTile.x && startTile.y + directionY === toMoveTile.y &&
            (!this.isOccupied(toMoveTile) || this.occupiedBy(toMoveTile).team !== team)) ||
            this.isCastlingMove(startTile, toMoveTile, team);
    }

    isCastlingMove(startTile, toMoveTile, team) {
        const king = board.getKingOfTeam(team);
        if (king.hasMoved || Math.abs(toMoveTile.x - startTile.x) > 2 || startTile.y !== toMoveTile.y) return false;
        let rooks = [];
        board.pieces.forEach(piece => {
            if (piece.type === 'Rook' && piece.team === team && !piece.hasMoved) {
                rooks.push(piece);
            }
        });
        const rookReferee = createRefereeForType('Rook');

        for (const rook of rooks) {
            const direction = (rook.x - king.x > 0) ? 1 : -1;
            const possibleMoves = rookReferee.getPossibleMoves(rook);

            const adjacentPosition = {x: king.x, y: king.y};
            adjacentPosition.x += direction;

            if (!possibleMoves.some(m => m.x === adjacentPosition.x && m.y === adjacentPosition.y)){
                continue;
            }

            const conceringTiles = [possibleMoves.filter(m => m.y === king.y), {x: king.x, y: king.y}];
            const enemyPieces = board.getEnemyPieces(team);

            let canAttack = true;
            for (const enemy of enemyPieces) {
                const enemyPossibleMoves = createRefereeForType(enemy.type).getPossibleMoves(enemy);

                for (const move of enemyPossibleMoves) {
                    if (conceringTiles.some(t => t.x === move.x && t.y === move.y)) {
                        canAttack = false;
                        break;
                    }
                }

                if (!canAttack)
                    break;
            }

            if (!canAttack) continue;

            if (direction < 0 && toMoveTile.x < startTile.x) return true;
            else if (direction > 0 && toMoveTile.x > startTile.x) return true;
        }


        return false;
    }
}