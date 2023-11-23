<?php

namespace App\Controller;

use App\MatchmakingService;
use App\Repository\GameRepository;
use Pusher\Pusher;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

#[Route('/game')]
class GameController extends AbstractController
{
    #[Route('/enter-matchmaking', name: 'enter_game_matchmaking', methods: ['POST'])]
    public function enterMathcmaking(Request $request, MatchmakingService $matchmaking): Response
    {
        if (!$this->isCsrfTokenValid('enter-game-matchmaking', $request->request->get('token'))) {
            return new Response("Oops, it looks like there was an issue with your request.", Response::HTTP_FORBIDDEN);
        }

        return $matchmaking->enter($this->getUser(), $request->request->get('game-length'));
    }

    #[Route('/waiting-room', name: 'waiting_room')]
    public function waitingRoom(Request $request): Response
    {
        if (!$request->headers->get('referer')) {
            return $this->redirectToRoute('homepage');
        }

        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if ($user->getGame()) {
            return $this->redirectToRoute('game', ['slug' => $user->getGame()->getSlug()]);
        }

        return $this->render('game/waiting_room.html.twig');
    }

    #[Route('/{slug}', name: 'game')]
    public function game(string $slug, GameRepository $gameRepository): Response
    {
        $normalizer = new ObjectNormalizer(defaultContext: [AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => fn () => null]);
        $serializer = new Serializer([$normalizer]);
        $game = $serializer->normalize($gameRepository->findOneBySlug($slug));
        $user = $serializer->normalize($this->getUser());

        if (!$game) {
            throw $this->createNotFoundException();
        }

        return $this->render('game/index.html.twig', ['game' => $game, 'user' => $user]);
    }

    #[Route('/{id}/move-played', name: 'move_played', methods: ['POST'])]
    public function movePlayed(int $id, Pusher $pusher, Request $request): Response
    {
        $pusher->trigger('game', 'move_played', ['game_id' => $id, 'piece' => $request->request->get('piece'), 'toMoveTile' => $request->request->get('toMoveTile')]);
        return new Response();
    }

    #[Route('/{id}/promotion-move-played', name: 'promotion_move_played', methods: ['POST'])]
    public function promotionMovePlayed(int $id, Pusher $pusher, Request $request): Response
    {
        $pusher->trigger('game', 'promotion_move_played', [
            'game_id' => $id, 
            'promotedPawn' => $request->request->get('promotedPawn'), 
            'pieceType' => $request->request->get('pieceType'),
            'promotionTile' => $request->request->get('promotionTile')
        ]);
        return new Response();
    }
}
