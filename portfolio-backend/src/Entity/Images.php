<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImagesRepository::class)]
class Images
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['image:read', 'project:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['image:read', 'project:read'])]
    private ?string $src = null;

    #[ORM\Column(length: 255)]
    #[Groups(['image:read', 'project:read'])]
    private ?string $alt = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    private ?Projects $project = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSrc(): ?string
    {
        return $this->src;
    }

    public function setSrc(string $src): static
    {
        $this->src = $src;

        return $this;
    }

    public function getAlt(): ?string
    {
        return $this->alt;
    }

    public function setAlt(string $alt): static
    {
        $this->alt = $alt;

        return $this;
    }

    public function getProject(): ?Projects
    {
        return $this->project;
    }

    public function setProject(?Projects $project): static
    {
        $this->project = $project;

        return $this;
    }
}
