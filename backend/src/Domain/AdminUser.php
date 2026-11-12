<?php

declare(strict_types=1);

namespace HmApi\Domain;

final class AdminUser
{
    public function __construct(
        public readonly int $id,
        public readonly string $username,
        public readonly string $passwordHash,
    ) {
    }
}
