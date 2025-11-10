<?php

namespace App;

use App\Entity\User;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use Symfony\Component\Serializer\SerializerInterface;

final class NewMatchmakingService
{
    public function __construct(private AMQPStreamConnection $connection, private SerializerInterface $serializer)
    {
        $channel = $connection->channel();
        $channel->queue_declare('matchmaking', durable: true);
        $channel->close();
    }

    public function __destruct()
    {
        $this->connection->close();
    }

    public function addToQueue(User $user): void
    {
        $serialized = $this->serializer->serialize($user, 'json');
        $msg = new AMQPMessage($serialized);
        $channel = $this->connection->channel();
        $channel->basic_publish($msg, '', 'matchmaking');
    }
}
