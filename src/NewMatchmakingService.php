<?php

namespace App;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

final class NewMatchmakingService
{
    public function __construct(private AMQPStreamConnection $connection) {}

    public function __destruct()
    {
        $this->connection->close();
    }

    public function testPublish(): void
    {
        $channel = $this->connection->channel();
        $channel->queue_declare('hello', false, false, false, false);

        $msg = new AMQPMessage('Hello, world!');
        $channel->basic_publish($msg, routing_key: 'hello');

        dump("Sent: 'Hello, world!'");
    }

    public function testReceive(): void
    {
        $channel = $this->connection->channel();
        $channel->queue_declare('hello', false, false, false, false);

        $callback = function (AMQPMessage $msg) {
            dump('[x] Received ', $msg->getBody());
            $msg->ack();
        };

        $channel->basic_consume('hello', '', false, true, false, false, $callback);

        try {
            $channel->consume();
        } catch (\Throwable $exception) {
            echo $exception->getMessage();
        } finally {
            $channel->close();
        }
    }
}
