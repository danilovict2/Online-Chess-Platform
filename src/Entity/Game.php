<?php

namespace App\Entity;

use App\Repository\GameRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: GameRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[UniqueEntity('slug')]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $length = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $slug = null;

    #[Assert\Count(min: 1, max: 2)]
    #[ORM\OneToMany(mappedBy: 'game', targetEntity: User::class)]
    private Collection $players;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $pieceStateHistory = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $blackTimer = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $whiteTimer = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $turnStart = null;

    #[ORM\Column(length: 95)]
    private ?string $fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    #[ORM\ManyToOne]
    private ?Engine $engine = null;

    public function __construct()
    {
        $this->players = new ArrayCollection();
        $this->turnStart = (new \DateTimeImmutable())->getTimestamp() * 1000;
    }

    #[ORM\PreRemove]
    public function removePlayers(): void
    {
        foreach ($this->getPlayers() as $player) {
            $this->removePlayer($player);
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLength(): ?int
    {
        return $this->length;
    }

    public function setLength(int $length): static
    {
        $this->length = $length;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    #[ORM\PrePersist]
    public function setSlugValue(): void
    {
        $this->slug = bin2hex(random_bytes(20));
    }

    /**
     * @return Collection<int, User>
     */
    public function getPlayers(): Collection
    {
        return $this->players;
    }

    public function addPlayer(User $player): static
    {
        if (!$this->players->contains($player)) {
            $this->players->add($player);
            $player->setGame($this);
        }

        return $this;
    }

    public function removePlayer(User $player): static
    {
        if ($this->players->removeElement($player)) {
            // set the owning side to null (unless already changed)
            if ($player->getGame() === $this) {
                $player->setGame(null);
            }
        }

        return $this;
    }

    public function getPieceStateHistory(): ?string
    {
        return $this->pieceStateHistory;
    }

    public function setPieceStateHistory(string $pieceStateHistory): static
    {
        $this->pieceStateHistory = $pieceStateHistory;

        return $this;
    }

    public function getBlackTimer(): ?string
    {
        return $this->blackTimer;
    }

    public function setBlackTimer(string $blackTimer): static
    {
        $this->blackTimer = $blackTimer;

        return $this;
    }

    public function getWhiteTimer(): ?string
    {
        return $this->whiteTimer;
    }

    public function setWhiteTimer(string $whiteTimer): static
    {
        $this->whiteTimer = $whiteTimer;

        return $this;
    }

    public function getTurnStart(): ?string
    {
        return $this->turnStart;
    }

    public function setTurnStart(string $turnStart): static
    {
        $this->turnStart = $turnStart;

        return $this;
    }

    public function getFen(): ?string
    {
        return $this->fen;
    }

    public function setFen(?string $fen): static
    {
        $this->fen = $fen;

        return $this;
    }

    public function getEngine(): ?Engine
    {
        return $this->engine;
    }

    public function setEngine(?Engine $engine): static
    {
        $this->engine = $engine;

        return $this;
    }
}
