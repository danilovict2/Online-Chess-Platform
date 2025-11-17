<?php

namespace App;

use App\Entity\Game;
use App\Entity\User;
use App\Exception\GameNotFoundException;
use Doctrine\ORM\EntityManagerInterface;
use Predis\Client;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class MatchmakingService
{
    public function __construct(
        private Client $redis,
        private UrlGeneratorInterface $urlGenerator,
        private HubInterface $hub,
        private EntityManagerInterface $entityManager,
    ) {}

    public function enter(User $user, int $gameLength): RedirectResponse
    {
        if ($user->getGame() or $this->inQueue($user)) {
            return new RedirectResponse($this->urlGenerator->generate('waiting_room'));
        }

        try {
            return $this->joinGame($user, $gameLength);
        } catch (GameNotFoundException) {
            return $this->enqueue($user, $gameLength);
        }
    }

    private function joinGame(User $user, int $gameLength): RedirectResponse
    {
        if ($this->redis->llen('queue') === 0) {
            throw new GameNotFoundException();
        }

        $opponentID = explode(':', $this->redis->rpop('queue'))[1];
        $opponent = $this->entityManager->getRepository(User::class)->find($opponentID);

        $game = (new Game())->setLength($gameLength)->addPlayer($opponent)->addPlayer($user);

        $this->entityManager->persist($game);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Inform the opposing player's client about the match discovery
        $matchFoundUpdate = new Update('match-found');
        $this->hub->publish($matchFoundUpdate);

        return new RedirectResponse($this->urlGenerator->generate('game', ['slug' => $game->getSlug()]));
    }

    private function inQueue(User $user): bool
    {
        $userID = $user->getId();
        return $this->redis->executeRaw(['LPOS', 'queue', "user:$userID"]) !== null;
    }

    private function enqueue(User $user, int $gameLength): RedirectResponse
    {
        $userID = $user->getId();
        $this->redis->lpush('queue', "user:$userID");

        return new RedirectResponse($this->urlGenerator->generate('waiting_room'));
    }
}
