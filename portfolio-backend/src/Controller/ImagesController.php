<?php

namespace App\Controller;

use App\Repository\ImagesRepository;
use App\Repository\ProjectsRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Images;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ImagesController extends AbstractController
{

    #[Route('/api/images', name: 'images_api_images', methods: ['GET'])]
public function images(
    ImagesRepository $imagesRepository
    ): JsonResponse
{
    $images = $imagesRepository->findAll();
    $data = array_map(function($img) {
    return [
        'id' => $img->getId(),
        'src' => $img->getSrc(),
        'alt' => $img->getAlt(),
        'projectId' => $img->getProject()->getId()
    ];
}, $images);

    return $this->json($data, 200, [], ['groups' => 'image:read']);
}

 #[Route('/api/images/{id}', name: 'images_api_image', methods: ['GET'])]
    public function image(
        int $id,
        ImagesRepository $imagesRepository
    ): JsonResponse {
       

        $image = $imagesRepository->find($id);
        if (!$image) {
            throw $this->createNotFoundException('Image introuvable');
        }

        return $this->json($image, 200, [], ['groups' => 'image:read']);
    }

#[Route('/api/images', methods: ['POST'])]
public function createImage(Request $request, EntityManagerInterface $em, ProjectsRepository $projectsRepository): JsonResponse
{
    $data = json_decode($request->getContent(), true);

    if (!isset($data['src'], $data['alt'], $data['projectId'])) {
        return $this->json(["error" => "Champs manquants"], 400);
    }

    $project = $projectsRepository->find($data['projectId']);
    if (!$project) {
        return $this->json(["error" => "Projet introuvable"], 404);
    }

    $image = new Images();
    $image->setSrc($data['src']);
    $image->setAlt($data['alt']);
    $image->setProject($project);

    $em->persist($image);
    $em->flush();

    return $this->json([
            'id' => $image->getId(),
            'src' => $image->getSrc(),
            'alt' => $image->getAlt(),
            'projectId' => $image->getProject()->getId(),
        ], 201, [], ['groups' => 'image:read']);
}

#[Route('/api/images/{id}', name: 'images_api_images_update', methods: ['PUT'])]
public function updateImage(int $id, Request $request, ImagesRepository $imagesRepository, EntityManagerInterface $em): JsonResponse
{
  
    $admin = $this->getUser();
    if (!$admin) {
        return $this->json(['error' => 'Admin non connecté'], 403);
    }

    $image = $imagesRepository->find($id);
    
    if (!$image) {
        return $this->json(['error' => 'Image introuvable'], 404);
    }

    $data = json_decode($request->getContent(), true);

    if (isset($data['src'])) $image->setSrc($data['src']);
    if (isset($data['alt'])) $image->setAlt($data['alt']);
    if (isset($data['projectId'])) $image->setProjectId($data['projectId']);

    $em->flush();

    return $this->json(['message' => 'image mis à jour'], 200);
}

#[Route('/api/images/{id}', name: 'images_api_image_delete', methods: ['DELETE'])]
    public function deleteImage(int $id, ImagesRepository $imagesRepository, EntityManagerInterface $em): JsonResponse
    {
        $admin = $this->getUser();
        if (!$admin) {
            return $this->json(['error' => 'Admin non connecté'], 403);
        }

        $image = $imagesRepository->find($id);
        
        if (!$image) {
            return $this->json(['error' => 'Image introuvable'], 404);
        }

        $em->remove($image);
        $em->flush();

        return $this->json(['message' => 'Image supprimée'], 200);
    }


}