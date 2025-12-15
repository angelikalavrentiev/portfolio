<?php

namespace App\Controller;

use App\Repository\AdminRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;

class AdminController extends AbstractController
{

    #[Route('/api/admin/download-cv', name: 'admin_api_download-cv')]
public function downloadCV(AdminRepository $adminRepository): Response
{
    $admin = $adminRepository->find(1);

    if (!$admin || !$admin->getCV()) {
        return $this->json([
            'error' => 'CV introuvable'
        ], 404);
    }

    $CV = $admin->getCV();

    if (is_resource($CV)) {
        rewind($CV); 
        $data = stream_get_contents($CV);
    } else {
        $data = $CV;
    }

    return new Response(
        $data,
        200,
        [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachement; filename="angelika_lavrentiev.pdf"'
        ]
    );
}

#[Route('/api/admin/view-cv', name: 'admin_api_view-cv')]
public function viewCV(AdminRepository $adminRepository): Response
{
    $admin = $adminRepository->find(1);

    if (!$admin || !$admin->getCV()) {
        return $this->json([
            'error' => 'CV introuvable'
        ], 404);
    }

    $CV = $admin->getCV();

    if (is_resource($CV)) {
        rewind($CV); 
        $data = stream_get_contents($CV);
    } else {
        $data = $CV;
    }

    return new Response(
        $data,
        200,
        [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="angelika_lavrentiev.pdf"'
        ]
    );
}

#[Route('/api/profil', name: 'admin_api_profil', methods: ['GET'])]
public function getProfil(AdminRepository $adminRepository): JsonResponse
{
    $admin = $adminRepository->find(1);

    if (!$admin) {
        return $this->json(['error' => 'Admin introuvable'], 404);
    }

    $CV = $admin->getCV();

    return $this->json([
        'username' => $admin->getUsername(),
        'email' => $admin->getEmail(),
        'title' => $admin->getTitle(),
        'description' => $admin->getDescription(),
        'CV' => $CV ? '/uploads/cv/' . $CV : null,
        'photo' => $admin->getPhoto(),
    ]);
}

#[Route('/api/profil', name: 'admin_api_profil_update', methods: ['POST'])]
public function updateProfil(Request $request, EntityManagerInterface $em): JsonResponse
{
  
    $admin = $this->getUser();
    if (!$admin) {
        return $this->json(['error' => 'Admin non connecté'], 403);
    }

    $title = $request->request->get('title');
    $description = $request->request->get('description');
    $CV = $request->files->get('CV');
    $photo = $request->request->get('photo');

    if ($title) $admin->setTitle($title);
    if ($description) $admin->setDescription($description);
    if ($CV) {
        $filename = uniqid() . '_' . $CV->getClientOriginalName();
        $CV->move($this->getParameter('cv_directory'), $filename);
        $admin->setCV($filename);
    }
    if ($photo) $admin->setPhoto($photo);

    $em->flush();

    return $this->json(['message' => 'Profil mis à jour'], 200);
}


}