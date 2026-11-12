<?php

declare(strict_types=1);

namespace HmApi\Tests;

use PDO;

/** In-memory SQLite with database/schema.sqlite.sql (same tables as the MySQL schema). */
final class TestDatabase
{
    public static function create(): PDO
    {
        $pdo = new PDO('sqlite::memory:', null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $pdo->exec((string) file_get_contents(__DIR__ . '/../database/schema.sqlite.sql'));

        return $pdo;
    }
}
