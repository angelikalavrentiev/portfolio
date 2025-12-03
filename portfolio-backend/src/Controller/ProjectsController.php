<?php

namespace App\Controller;

use App\Repository\ProjectsRepository;
use App\Entity\Projects;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ProjectsController extends AbstractController
{

    #[Route('/api/projects', name: 'projects_api_projects', methods: ['GET'])]
public function projects(
    ProjectsRepository $projectsRepository
    ): JsonResponse
{
    $projects = $projectsRepository->findAll();

    $data = [];

    foreach ($projects as $project) {
        $competences = $project->getCompetences();
        $competenceData = [];

        foreach ($competences as $competence) {
            $competenceData[] = [
                'id' => $competence->getId(),
                'name' => $competence->getName(),
            ];
        }

        $images = [];
        foreach ($project->getImages() as $image) {
            $images[] = [
                'id' => $image->getId(),
                'src' => $image->getSrc(),
                'alt' => $image->getAlt(),
            ];
        }

        $data[] = [
            'id' => $project->getId(),
            'title' => $project->getTitle(),
            'description' => $project->getDescription(),
            'lien_git' => $project->getLienGit(),
            'dates' => $project->getDates(),
            'competences' => $competenceData,
            'images' => $images,
        ];
    }

    return $this->json($data);
}

 #[Route('/api/projects/{id}', name: 'projects_api_project', methods: ['GET'])]
    public function project(
        int $id,
        ProjectsRepository $projectsRepository
    ): JsonResponse {
       

        $project = $projectsRepository->find($id);
        if (!$project) {
            throw $this->createNotFoundException('Projet introuvable');
        }

            $competences = $project->getCompetences();
            $competenceData = [];

            foreach ($competences as $competence) {
                $competenceData[] = [
                    'id' => $competence->getId(),
                    'name' => $competence->getName(),
                ];
            }

            $images = [];
            foreach ($project->getImages() as $image) {
                $images[] = [
                    'id' => $image->getId(),
                    'src' => $image->getSrc(),
                    'alt' => $image->getAlt(),
                ];
            }

            $data = [
                'id' => $project->getId(),
                'title' => $project->getTitle(),
                'description' => $project->getDescription(),
                'lien_git' => $project->getLienGit(),
                'dates' => $project->getDates(),
                'competences' => $competenceData,
                'images' => $images,
            ];

        return $this->json($data);
    }

#[Route('/api/projects', methods: ['POST'])]
public function createProject(Request $request, EntityManagerInterface $em): JsonResponse
{
    $data = json_decode($request->getContent(), true);

    $project = new Projects();
    $project->setTitle($data['title']);
    $project->setDescription($data['description']);
    $project->setDates($data['dates'] ?? null);
    $project->setLienGit($data['lienGit'] ?? null);
    $project->setAuthor($this->getUser());

    $em->persist($project);
    $em->flush();

    return $this->json([
            'id' => $project->getId(),
            'title' => $project->getTitle(),
            'description' => $project->getDescription(),
            'dates' => $project->getDates(),
            'lienGit' => $project->getLienGit(),
        ], 201);
}


}