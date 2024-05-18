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

    #[Assert\Count(min: 2, max: 2)]
    #[ORM\OneToMany(mappedBy: 'game', targetEntity: User::class)]
    private Collection $players;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $pieces = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $pieceStateHistory = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $blackTimer = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $whiteTimer = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $turnStart = null;

    #[ORM\Column(length: 2, nullable: true)]
    private ?string $activeColor = 'w';

    #[ORM\Column(nullable: true)]
    private ?int $fullmoves = null;

    #[ORM\Column(nullable: true)]
    private ?int $halfmoves = null;

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

    public function getPieces(): ?string
    {
        return $this->pieces;
    }

    public function setPieces(string $pieces): static
    {
        $this->pieces = $pieces;

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

    public function getActiveColor(): ?string
    {
        return $this->activeColor;
    }

    public function setActiveColor(string $activeColor): static
    {
        $this->activeColor = $activeColor;

        return $this;
    }

    public function getFullmoves(): ?int
    {
        return $this->fullmoves;
    }

    public function setFullmoves(int $fullmoves): static
    {
        $this->fullmoves = $fullmoves;

        return $this;
    }

    public function getHalfmoves(): ?int
    {
        return $this->halfmoves;
    }

    public function setHalfmoves(?int $halfmoves): static
    {
        $this->halfmoves = $halfmoves;

        return $this;
    }
}
