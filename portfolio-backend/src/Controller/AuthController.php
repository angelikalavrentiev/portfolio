<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Admin;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class AuthController extends AbstractController
{
    #[Route('/api/auth/me', name: 'auth_api_me', methods: ['GET'])]
    public function me(Security $security): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        return $this->json([
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'title' => $user->getTitle(),
            'description' => $user->getDescription(),
        ]);
    }

    #[Route('/api/auth/check', name: 'auth_api_check', methods: ['GET'])]
    public function checkAuth(): JsonResponse
    {
        if (!$this->getUser()) {
            return $this->json(['authenticated' => false], 401);
        }

        return $this->json(['authenticated' => true]);
    }

    #[Route('/api/login_check', name: 'login_check', methods: ['POST'])]
public function loginCheck(
    Request $request,
    EntityManagerInterface $em,
    UserPasswordHasherInterface $hasher
): JsonResponse
{
    $data = json_decode($request->getContent(), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        return $this->json(['error' => 'Email et password requis'], 400);
    }

    $user = $em->getRepository(Admin::class)->findOneBy(['email' => $data['email']]);

    if (!$user || !$hasher->isPasswordValid($user, $data['password'])) {
        return $this->json(['error' => 'Identifiants invalides'], 401);
    }

    $token = new UsernamePasswordToken($user, 'main', $user->getRoles());
    $this->container->get('security.token_storage')->setToken($token);

    $request->getSession()->set('_security_main', serialize($token));

    return $this->json([
        'success' => true,
        'admin' => [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]
    ]);
}

}
