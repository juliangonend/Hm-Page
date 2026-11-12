<?php

declare(strict_types=1);

namespace HmApi\Application;

final class LoginOutcome
{
    public function __construct(
        public readonly LoginResult $status,
        public readonly ?string $username = null,
    ) {
    }
}
