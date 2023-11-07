<?php

namespace App;

use App\Entity\Game;
use App\Entity\MatchQueue;
use App\Entity\User;
use App\Exception\GameNotFoundException;
use App\Repository\MatchQueueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Pusher\Pusher;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class MatchmakingService
{
    public function __construct(
        private MatchQueueRepository $matchQueueRepository,
        private EntityManagerInterface $entityManager,
        private UrlGeneratorInterface $urlGenerator,
        private Pusher $pusher,
    ) {
    }

    public function enter(User $user, int $gameLength): RedirectResponse
    {
        if ($user->isInGame()) {
            return new RedirectResponse($this->urlGenerator->generate('waiting_room'));
        }

        try {
            return $this->joinGame($user, $gameLength);
        } catch (GameNotFoundException) {
            return $this->addUserToMatchmakingQueue($user);
        }
    }

    private function joinGame(User $user, int $gameLength): RedirectResponse
    {
        $queuedMatches = $this->matchQueueRepository->findAll();
        if (count($queuedMatches) === 0) {
            throw new GameNotFoundException();
        }
        
        $game = new Game();
        $game->setLength($gameLength)
            ->addPlayer($queuedMatches[0]->getWaitingPlayer())
            ->addPlayer($user);
        $user->setIsInGame(true);
        
        $this->entityManager->persist($game);
        $this->entityManager->persist($user);
        $this->entityManager->remove($queuedMatches[0]);
        $this->entityManager->flush();

        // Inform the opposing player's client about the match discovery
        $this->pusher->trigger('waiting-room', 'match-found', []);

        return new RedirectResponse($this->urlGenerator->generate('game', ['slug' => $game->getSlug()]));
    }

    private function addUserToMatchmakingQueue(User $user): RedirectResponse
    {
        $matchQueue = new MatchQueue();
        $matchQueue->setWaitingPlayer($user);
        $user->setIsInGame(true);

        $this->entityManager->persist($matchQueue);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new RedirectResponse($this->urlGenerator->generate('waiting_room'));
    }
}
