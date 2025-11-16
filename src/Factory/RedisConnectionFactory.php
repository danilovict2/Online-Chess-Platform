<?php

namespace App\Factory;

use InvalidArgumentException;
use Predis\Client;

final class RedisConnectionFactory
{
    public static function connectionFromDSN(string $dsn): Client
    {
        $parts = parse_url($dsn);
        if (!$parts) {
            throw new InvalidArgumentException("Invalid Redis DSN: $dsn");
        }

        $host = $parts['host'] ?? 'localhost';
        $port = $parts['port'] ?? 6379;

        return new Client([
            'scheme' => 'redis',
            'host' => $host,
            'port' => $port,
            'password' => '',
            'database' => 0,
        ]);
    }
}
