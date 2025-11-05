<?php

namespace App;

use App\Entity\Game;
use App\Entity\MatchQueue;
use App\Entity\User;
use App\Exception\GameNotFoundException;
use App\Repository\MatchQueueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class MatchmakingService
{
    public function __construct(
        private MatchQueueRepository $matchQueueRepository,
        private EntityManagerInterface $entityManager,
        private UrlGeneratorInterface $urlGenerator,
        private HubInterface $hub,
    ) {}

    public function enter(User $user, int $gameLength): RedirectResponse
    {
        if ($user->getGame()) {
            return new RedirectResponse($this->urlGenerator->generate('waiting_room'));
        }

        try {
            return $this->joinGame($user, $gameLength);
        } catch (GameNotFoundException) {
            return $this->addUserToMatchmakingQueue($user, $gameLength);
        }
    }

    private function joinGame(User $user, int $gameLength): RedirectResponse
    {
        $queuedMatches = $this->matchQueueRepository->findBy(['gameLength' => $gameLength]);
        if (empty(array_filter($queuedMatches, fn($matchQueue) => $matchQueue->getWaitingPlayer() !== $user))) {
            throw new GameNotFoundException();
        }

        $game = (new Game())->setLength($gameLength)->addPlayer($queuedMatches[0]->getWaitingPlayer())->addPlayer($user);

        $this->entityManager->persist($game);
        $this->entityManager->persist($user);
        $this->entityManager->remove($queuedMatches[0]);
        $this->entityManager->flush();

        $matchFoundUpdate = new Update('match-found');
        // Inform the opposing player's client about the match discovery
        $this->hub->publish($matchFoundUpdate);

        return new RedirectResponse($this->urlGenerator->generate('game', ['slug' => $game->getSlug()]));
    }

    private function addUserToMatchmakingQueue(User $user, int $gameLength): RedirectResponse
    {
        if (empty($this->matchQueueRepository->findBy(['waitingPlayer' => $user]))) {
            $matchQueue = (new MatchQueue())->setWaitingPlayer($user)->setGameLength($gameLength);

            $this->entityManager->persist($matchQueue);
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }

        return new RedirectResponse($this->urlGenerator->generate('waiting_room'));
    }
}
