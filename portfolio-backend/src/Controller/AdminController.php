<?php

namespace App\Controller;

use App\Repository\AdminRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class AdminController extends AbstractController
{

    #[Route('/api/admin/download-cv', name: 'admin_api_download-cv')]
public function downloadCV(AdminRepository $adminRepository): Response
{
    $admin = $adminRepository->find(1);

    if (!$admin || !$admin->getCv()) {
        return $this->json([
            'error' => 'CV introuvable'
        ], 404);
    }

    $cv = $admin->getCv();

    $data = is_resource($cv) ? stream_get_contents($cv) : $cv;

    return new Response(
        $data,
        200,
        [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="angelika_lavrentiev.pdf"'
        ]
    );
}

#[Route('/api/admin/view-cv', name: 'admin_api_view-cv')]
public function viewCV(AdminRepository $adminRepository): Response
{
    $admin = $adminRepository->find(1);

    if (!$admin || !$admin->getCv()) {
        return $this->json([
            'error' => 'CV introuvable'
        ], 404);
    }

    $cv = $admin->getCv();

    $data = is_resource($cv) ? stream_get_contents($cv) : $cv;

    return new Response(
        $data,
        200,
        [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="angelika_lavrentiev.pdf"'
        ]
    );
}


}