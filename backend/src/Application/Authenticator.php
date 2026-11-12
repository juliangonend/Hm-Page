<?php

declare(strict_types=1);

namespace HmApi\Application;

use DateTimeImmutable;
use HmApi\Domain\AdminRepository;
use HmApi\Domain\LoginThrottle;

final class Authenticator
{
    public function __construct(
        private readonly AdminRepository $admins,
        private readonly LoginThrottle $throttle,
    ) {
    }

    public function attempt(string $username, string $password, string $ip, DateTimeImmutable $now): LoginOutcome
    {
        if ($this->throttle->isLocked($ip, $now)) {
            return new LoginOutcome(LoginResult::TooManyAttempts);
        }

        $admin = $this->admins->findByUsername($username);
        // Always run password_verify so an unknown user takes as long as a wrong password (no user enumeration)
        $hash = $admin?->passwordHash ?? self::dummyHash();
        $valid = password_verify($password, $hash) && $admin !== null;

        if (!$valid) {
            $this->throttle->recordFailure($ip, $now);

            return new LoginOutcome(LoginResult::InvalidCredentials);
        }

        $this->throttle->clear($ip);

        return new LoginOutcome(LoginResult::Success, $admin->username);
    }

    private static function dummyHash(): string
    {
        static $hash = null;

        return $hash ??= password_hash('timing-equalizer', PASSWORD_DEFAULT);
    }
}
