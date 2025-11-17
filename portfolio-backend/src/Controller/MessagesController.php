<?php

namespace App\Controller;

use App\Repository\MessagesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use App\Entity\Messages;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MessagesController extends AbstractController
{

#[Route('/api/messages', name: 'messages_api_messages', methods: ['POST'])]
public function messages(
    Request $request,
    MailerInterface $mailer,
    EntityManagerInterface $em,
    LoggerInterface $logger
    ): JsonResponse
{
     $rawContent = $request->getContent();
    
    $data = json_decode($rawContent, true);
 
    if (!$data) {
        return $this->json(['error' => 'Invalid JSON'], 400);
    }
    
    if (!isset($data['email']) || !isset($data['title']) || !isset($data['content'])) {
        return $this->json([
            'error' => 'Données manquantes',
            'received' => array_keys($data)
        ], 400);
    }

    $title = $data['title'];
        $email = $data['email'];
        $messageContent = $data['content'];

    $message = new Messages();
            $message->setTitle($title);
            $message->setEmail($email);
            $message->setContent($messageContent);
            $message->setDate(new \DateTime());
           
            $em->persist($message);
            $em->flush();

    $emailMessage = (new Email())
        ->from($email)
        ->to('angelika.lavrentiev@gmail.com') 
        ->subject("Nouveau message : $title")
        ->html("
            <h2>Nouveau message du portfolio</h2>
            <p><strong>Email :</strong> $email</p>
            <p><strong>Titre :</strong> $title</p>
            <p><strong>Message :</strong><br>$messageContent</p>
        ");

    $mailer->send($emailMessage);

    return new JsonResponse(['message' => 'Email envoyé']);
}

}