<?php

declare(strict_types=1);

namespace HmApi\Domain;

use DateTimeImmutable;

/** Port: limits failed logins per IP to stop brute-force attacks. */
interface LoginThrottle
{
    public function isLocked(string $ip, DateTimeImmutable $now): bool;

    public function recordFailure(string $ip, DateTimeImmutable $now): void;

    public function clear(string $ip): void;
}
