<?php

namespace App\Controller;

use App\NewMatchmakingService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'homepage')]
    public function index(NewMatchmakingService $test): Response
    {
        $test->testPublish();
        $test->testReceive();
        
        return $this->render('home/index.html.twig');
    }
}
