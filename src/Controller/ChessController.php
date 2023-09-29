<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ChessController extends AbstractController
{
    #[Route('/', name: 'chessboard')]
    public function index(): Response
    {
        return $this->render('chess/index.html.twig');
    }
}
