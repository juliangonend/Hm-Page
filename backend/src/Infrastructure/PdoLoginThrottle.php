<?php

declare(strict_types=1);

namespace HmApi\Infrastructure;

use DateTimeImmutable;
use HmApi\Domain\LoginThrottle;
use PDO;

/** Counts failed logins per IP inside a sliding window. */
final class PdoLoginThrottle implements LoginThrottle
{
    public function __construct(
        private readonly PDO $pdo,
        private readonly int $maxAttempts = 5,
        private readonly int $windowMinutes = 15,
    ) {
    }

    public function isLocked(string $ip, DateTimeImmutable $now): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = :ip AND attempted_at > :since');
        $stmt->execute(['ip' => $ip, 'since' => $this->since($now)]);

        return (int) $stmt->fetchColumn() >= $this->maxAttempts;
    }

    public function recordFailure(string $ip, DateTimeImmutable $now): void
    {
        $this->pdo->prepare('INSERT INTO login_attempts (ip, attempted_at) VALUES (:ip, :at)')
            ->execute(['ip' => $ip, 'at' => $now->format('Y-m-d H:i:s')]);
        // Housekeeping: old rows are useless once outside the window
        $this->pdo->prepare('DELETE FROM login_attempts WHERE attempted_at <= :since')
            ->execute(['since' => $this->since($now)]);
    }

    public function clear(string $ip): void
    {
        $this->pdo->prepare('DELETE FROM login_attempts WHERE ip = :ip')->execute(['ip' => $ip]);
    }

    private function since(DateTimeImmutable $now): string
    {
        return $now->modify("-{$this->windowMinutes} minutes")->format('Y-m-d H:i:s');
    }
}
