<?php

namespace App\Controller;

use App\Repository\CompetencesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

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

    return $this->json($data, 200);
}

}