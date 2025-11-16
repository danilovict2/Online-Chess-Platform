<?php

namespace App;

use App\Entity\User;
use Predis\Client;
use Symfony\Component\Serializer\SerializerInterface;

final class NewMatchmakingService
{
    public function __construct(private Client $redis, private SerializerInterface $serializer)
    {
        dd($redis->get('foo'));
    }

    public function addToQueue(User $user): void
    {
        dd($user);
    }
}
