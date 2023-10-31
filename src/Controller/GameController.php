<?php

namespace App\Controller;

use App\Entity\Game;
use App\Repository\GameRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

#[Route('/game')]
class GameController extends AbstractController
{
    #[Route('/create', name: 'create_game', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {
        $game = new Game();
        $game->setLength($request->request->get('game-length'));

        if (!$this->isCsrfTokenValid('create-game', $request->request->get('token'))) {
            return new Response("Oops, it looks like there was an issue with your request.", Response::HTTP_FORBIDDEN);
        }

        $entityManager->persist($game);
        $entityManager->flush();
        return $this->redirectToRoute('game', ['slug' => $game->getSlug()]);
    }

    #[Route('/{slug}', name: 'game')]
    public function game(string $slug, GameRepository $gameRepository, ObjectNormalizer $normalizer): Response
    {
        $game = $normalizer->normalize($gameRepository->findOneBySlug($slug));

        if (!$game) {
            throw $this->createNotFoundException();
        }

        return $this->render('game/index.html.twig', ['game' => $game]);
    }
}
