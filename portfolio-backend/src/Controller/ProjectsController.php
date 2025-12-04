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

#[Route('/api/projects/{id}', name: 'projects_api_projects_update', methods: ['PUT'])]
public function updateProject(int $id, Request $request, ProjectsRepository $projectsRepository, EntityManagerInterface $em): JsonResponse
{
  
    $admin = $this->getUser();
    if (!$admin) {
        return $this->json(['error' => 'Admin non connecté'], 403);
    }

    $project = $projectsRepository->find($id);
    
    if (!$project) {
        return $this->json(['error' => 'Compétence introuvable'], 404);
    }

    $data = json_decode($request->getContent(), true);

    if (isset($data['title'])) $project->setTitle($data['title']);
    if (isset($data['description'])) $project->setDescription($data['description']);
    if (isset($data['dates'])) $project->setDates($data['dates']);
    if (isset($data['liengit'])) $project->setLienGit($data['liengit']);

    $em->flush();

    return $this->json(['message' => 'project mis à jour'], 200);
}

#[Route('/api/projects/{id}', name: 'projects_api_project_delete', methods: ['DELETE'])]
    public function deleteProject(int $id, ProjectsRepository $projectsRepository, EntityManagerInterface $em): JsonResponse
    {
        $admin = $this->getUser();
        if (!$admin) {
            return $this->json(['error' => 'Admin non connecté'], 403);
        }

        $project = $projectsRepository->find($id);
        
        if (!$project) {
            return $this->json(['error' => 'Compétence introuvable'], 404);
        }

        if ($project->getAuthor() !== $admin) {
            return $this->json(['error' => 'Non autorisé'], 403);
        }

        $em->remove($project);
        $em->flush();

        return $this->json(['message' => 'Compétence supprimée'], 200);
    }

}