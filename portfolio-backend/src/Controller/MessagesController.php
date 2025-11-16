<?php

namespace App\Controller;

use App\Repository\MessagesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;

class MessagesController extends AbstractController
{

    #[Route('/api/messages', name: 'messages_api_messages', methods: ['POST'])]
public function messages(
    MessagesRepository $messagesRepository,
    Request $request,
    EntityManagerInterface $em
    ): Response
{
    $data = json_decode($request->getContent(), true);

    if (!isset($data['name'], $data['email'], $data['content'])) {
        return new JsonResponse(['error' => 'Données manquantes'], 400);
    }

    $message = new Message();
    $message->setName($data['name']);
    $message->setEmail($data['email']);
    $message->setContent($data['content']);

    $em->persist($message);
    $em->flush();

    return new JsonResponse(['status' => 'Message reçu'], 201);
}

}