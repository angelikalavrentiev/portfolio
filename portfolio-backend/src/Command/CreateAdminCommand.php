<?php

namespace App\Command;

use App\Entity\Admin;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Créer un admin avec mot de passe hashé',
)]
class CreateAdminCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('username', InputArgument::REQUIRED)
            ->addArgument('email', InputArgument::REQUIRED)
            ->addArgument('password', InputArgument::REQUIRED)
            ->addArgument('title', InputArgument::REQUIRED)
            ->addArgument('description', InputArgument::REQUIRED)
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $username = $input->getArgument('username');
        $email = $input->getArgument('email');
        $password = $input->getArgument('password');
        $title = $input->getArgument('title');
        $description = $input->getArgument('description');

        $admin = new Admin();
        $admin->setUsername($username);
        $admin->setEmail($email);
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setTitle($title);
        $admin->setDescription($description);

        $hashed = $this->passwordHasher->hashPassword($admin, $password);
        $admin->setPassword($hashed);

        $this->em->persist($admin);
        $this->em->flush();

        $output->writeln(" Admin créé : $email");
        return Command::SUCCESS;
    }
}
