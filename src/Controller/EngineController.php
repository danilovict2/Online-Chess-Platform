<?php

namespace App\Controller;

use App\Repository\GameRepository;
use App\StockfishService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class EngineController extends AbstractController
{
    #[Route('/engine/best-move', name: 'best_move', methods: ['POST'])]
    public function getBestMove(Request $request, GameRepository $gameRepository, StockfishService $stockfish): JsonResponse
    {
        $gameId = $request->request->get('gameId');
        $game = $gameRepository->findOneById($gameId);
        $bestMove = $stockfish->getBestMove($game->getEngine()->getElo(), $game->getFen());

        return new JsonResponse($bestMove);
    }
}
