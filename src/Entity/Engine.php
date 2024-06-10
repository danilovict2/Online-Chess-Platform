<?php

namespace App\Entity;

use App\Repository\EngineRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EngineRepository::class)]
class Engine
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 10)]
    private ?string $username = 'Computer';

    #[ORM\Column]
    private ?int $elo = null;

    #[ORM\Column]
    private ?int $skillLevel = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function getElo(): ?int
    {
        return $this->elo;
    }

    public function setElo(int $elo): static
    {
        $this->elo = $elo;

        return $this;
    }

    public function getSkillLevel(): ?int
    {
        return $this->skillLevel;
    }

    public function setSkillLevel(int $skillLevel): static
    {
        $this->skillLevel = $skillLevel;

        return $this;
    }
}
