<?php

declare(strict_types=1);

namespace HmApi\Domain;

interface AdminRepository
{
    public function findByUsername(string $username): ?AdminUser;

    /** Replaces the single back office user (there is only ever one). */
    public function save(string $username, string $plainPassword): void;
}
