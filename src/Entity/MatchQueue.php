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
}
