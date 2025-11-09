<?php

namespace App\Factory;

use InvalidArgumentException;
use PhpAmqpLib\Connection\AMQPStreamConnection;

final class AmqpConnectionFactory
{
    public static function connectionFromDSN(string $dsn): AMQPStreamConnection
    {
        $parts = parse_url($dsn);
        if (!$parts) {
            throw new InvalidArgumentException("Invalid AMQP DSN: $dsn");
        }

        $host = $parts['host'] ?? 'localhost';
        $port = $parts['port'] ?? 5672;
        $user = $parts['user'] ?? 'guest';
        $pass = $parts['pass'] ?? 'guest';

        return new AMQPStreamConnection($host, $port, $user, $pass);
    }
}
