<?php

namespace App\Controller;

use App\Repository\GameRepository;
use App\StockfishService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EngineController extends AbstractController
{
    #[Route('/engine/best-move', name: 'best_move', methods: ['POST'])]
    public function getBestMove(Request $request, GameRepository $gameRepository, StockfishService $stockfish): JsonResponse
    {
        $gameId = $request->request->get('gameId');
        $game = $gameRepository->findOneById($gameId);
        $bestMove = $stockfish->getBestMove($game->getEngine()->getSkillLevel(), $game->getFen());

        return new JsonResponse($bestMove);
    }

    #[Route('test')]
    public function test(StockfishService $stockfish): Response
    {
        dd($stockfish->getBestMove(20, 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'));
    }
}
