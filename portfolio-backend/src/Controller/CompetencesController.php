<?php

namespace App\Controller;

use App\Repository\CompetencesRepository;
use App\Entity\Competences;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;


class CompetencesController extends AbstractController
{

    #[Route('/api/competences', name: 'competences_api_competences', methods: ['GET'])]
public function competences(CompetencesRepository $competencesRepository): JsonResponse
{
    $competences = $competencesRepository->findAll();

    $data = [];
    foreach ($competences as $competence) {
        $data[] = [
            'id' => $competence->getId(),
            'name' => $competence->getName(),
            'category' => $competence->getCategory(),
            'image' => $competence->getImage()
        ];
    }

    return $this->json($data);
}

#[Route('/api/competences', methods: ['POST'])]
public function createCompetence(Request $request, EntityManagerInterface $em): JsonResponse
{

    $data = json_decode($request->getContent(), true);
    
    if (!isset($data['name']) || !isset($data['category'])) {
        return $this->json(['error' => 'Nom et catégorie requis'], 400);
    }

    $competence = new Competences();
    $competence->setName($data['name']);
    $competence->setCategory($data['category']);
    $competence->setImage($data['image'] ?? null);
    $competence->setAuthor($this->getUser());

    $em->persist($competence);
    $em->flush();

    return $this->json([
            'id' => $competence->getId(),
            'name' => $competence->getName(),
            'category' => $competence->getCategory(),
            'image' => $competence->getImage(),
        ], 201);
}

#[Route('/api/competences/{id}', name: 'competences_api_competences_update', methods: ['PUT'])]
public function updateCompetence(int $id, Request $request, CompetencesRepository $competencesRepository, EntityManagerInterface $em): JsonResponse
{
  
    $admin = $this->getUser();
    if (!$admin) {
        return $this->json(['error' => 'Admin non connecté'], 403);
    }

    $competence = $competencesRepository->find($id);
    
    if (!$competence) {
        return $this->json(['error' => 'Compétence introuvable'], 404);
    }

    $data = json_decode($request->getContent(), true);

    if (isset($data['name'])) $competence->setName($data['name']);
    if (isset($data['category'])) $competence->setCategory($data['category']);
    if (isset($data['image'])) $competence->setImage($data['image']);

    $em->flush();

    return $this->json(['message' => 'Competence mis à jour'], 200);
}

#[Route('/api/competences/{id}', name: 'competences_api_competence_delete', methods: ['DELETE'])]
    public function deleteCompetence(int $id, CompetencesRepository $competencesRepository, EntityManagerInterface $em): JsonResponse
    {
        $admin = $this->getUser();
        if (!$admin) {
            return $this->json(['error' => 'Admin non connecté'], 403);
        }

        $competence = $competencesRepository->find($id);
        
        if (!$competence) {
            return $this->json(['error' => 'Compétence introuvable'], 404);
        }

        if ($competence->getAuthor() !== $admin) {
            return $this->json(['error' => 'Non autorisé'], 403);
        }

        $em->remove($competence);
        $em->flush();

        return $this->json(['message' => 'Compétence supprimée'], 200);
    }

}