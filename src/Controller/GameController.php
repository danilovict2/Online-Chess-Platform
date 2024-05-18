<?php

namespace App\Controller;

use App\Entity\Game;
use App\MatchmakingService;
use App\Repository\GameRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

#[Route('/game')]
class GameController extends AbstractController
{
    public  function __construct(private EntityManagerInterface $entityManager, private HubInterface $hub)
    {
    }

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

    #[Route('/update-elo', name: 'game_update_elo', methods: ['POST'])]
    public function updateElo(Request $request): Response
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $user->setElo($user->getElo() + $request->request->get('elo'));
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return new Response();
    }

    #[Route('/accept-rematch', name: 'game_accept_rematch', methods: ['POST'])]
    public function acceptRematch(Request $request, MatchmakingService $matchmaking, UserRepository $userRepository): Response
    {
        $matchmaking->enter($this->getUser(), $request->request->getInt('length'));
        $matchmaking->enter($userRepository->find($request->request->getInt('opponent_id')), $request->request->getInt('length'));

        $redirectToGameUpdate = new Update(
            'redirect-to-new-game',
            json_encode(['url' => $this->generateUrl('game', ['slug' => $this->getUser()->getGame()->getSlug()])]),
            id: 'redirect-to-new-game'
        );

        $this->hub->publish($redirectToGameUpdate);

        return new Response();
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
    public function movePlayed(int $id, Request $request): Response
    {
        $moveUpdate = new Update(
            'move-played',
            json_encode([
                'game_id' => $id,
                'piece' => $request->request->get('piece'),
                'toMoveTile' => $request->request->get('toMoveTile')
            ]),
            id: 'move-played'
        );
        $this->hub->publish($moveUpdate);

        return new Response();
    }

    #[Route('/{id}/promotion-move-played', name: 'promotion_move_played', methods: ['POST'])]
    public function promotionMovePlayed(int $id, Request $request): Response
    {
        $promotionMoveUpdate = new Update(
            'promotion-move-played',
            json_encode([
                'game_id' => $id,
                'promotedPawn' => $request->request->get('promotedPawn'),
                'pieceType' => $request->request->get('pieceType'),
                'promotionTile' => $request->request->get('promotionTile')
            ]),
            id: 'promotion-move-played'
        );
        $this->hub->publish($promotionMoveUpdate);

        return new Response();
    }

    #[Route('/{id}/save-state', name: 'game_save_state', methods: ['POST'])]
    public function saveState(Request $request, Game $game): Response
    {
        $game->setPieceStateHistory($request->request->get('pieceStateHistory'))
            ->setTurnStart($request->request->get('turnStart'))
            ->setWhiteTimer($request->request->get('whiteTimer'))
            ->setBlackTimer($request->request->get('blackTimer'))
            ->setFen($request->request->get('fen'));
        ;

        $this->entityManager->persist($game);
        $this->entityManager->flush();
        return new Response();
    }


    #[Route('/{id}/delete', name: 'delete_game', methods: ['POST'])]
    public function deleteGame(Game $game): Response
    {
        $this->entityManager->remove($game);
        $this->entityManager->flush();
        return new Response();
    }

    #[Route('/{id}/play-again-request/{opponentID}', name: 'play_again_request', methods: ['POST'])]
    public function playAgainRequest(int $id, int $opponentID): Response
    {
        $playAgainUpdate = new Update(
            'play-again-request',
            json_encode([
                'game_id' => $id,
                'opponent_id' => $opponentID,
                'username' => $this->getUser()->getUsername()
            ]),
            id: 'play-again-request'
        );
        $this->hub->publish($playAgainUpdate);

        return new Response();
    }
}
