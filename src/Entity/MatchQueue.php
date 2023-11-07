<?php

namespace App\Entity;

use App\Repository\MatchQueueRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MatchQueueRepository::class)]
class MatchQueue
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(fetch: 'EAGER')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $waitingPlayer = null;

    #[ORM\Column]
    private ?int $gameLength = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWaitingPlayer(): ?User
    {
        return $this->waitingPlayer;
    }

    public function setWaitingPlayer(User $waitingPlayer): static
    {
        $this->waitingPlayer = $waitingPlayer;

        return $this;
    }

    public function getGameLength(): ?int
    {
        return $this->gameLength;
    }

    public function setGameLength(int $gameLength): static
    {
        $this->gameLength = $gameLength;

        return $this;
    }
}
