<?php

declare(strict_types=1);

namespace HmApi\Tests;

use DateTimeImmutable;
use HmApi\Application\Authenticator;
use HmApi\Application\LoginResult;
use HmApi\Infrastructure\PdoAdminRepository;
use HmApi\Infrastructure\PdoLoginThrottle;
use PHPUnit\Framework\TestCase;

final class AuthenticatorTest extends TestCase
{
    private Authenticator $auth;

    protected function setUp(): void
    {
        $pdo = TestDatabase::create();
        $admins = new PdoAdminRepository($pdo);
        $admins->save('admin', 'clave-segura-123');
        $this->auth = new Authenticator($admins, new PdoLoginThrottle($pdo, maxAttempts: 3, windowMinutes: 15));
    }

    public function testAcceptsTheRightCredentials(): void
    {
        $result = $this->auth->attempt('admin', 'clave-segura-123', '1.1.1.1', new DateTimeImmutable('2027-01-01 10:00'));
        self::assertSame(LoginResult::Success, $result->status);
        self::assertSame('admin', $result->username);
    }

    public function testRejectsAWrongPasswordOrUnknownUser(): void
    {
        $now = new DateTimeImmutable('2027-01-01 10:00');
        self::assertSame(LoginResult::InvalidCredentials, $this->auth->attempt('admin', 'otra', '1.1.1.1', $now)->status);
        self::assertSame(LoginResult::InvalidCredentials, $this->auth->attempt('nadie', 'clave-segura-123', '1.1.1.1', $now)->status);
    }

    public function testLocksAnIpAfterTooManyFailuresUntilTheWindowPasses(): void
    {
        $now = new DateTimeImmutable('2027-01-01 10:00');
        for ($i = 0; $i < 3; $i++) {
            $this->auth->attempt('admin', 'mal', '2.2.2.2', $now);
        }

        // Even the right password is refused while locked
        self::assertSame(LoginResult::TooManyAttempts, $this->auth->attempt('admin', 'clave-segura-123', '2.2.2.2', $now)->status);
        // Other IPs are not affected
        self::assertSame(LoginResult::Success, $this->auth->attempt('admin', 'clave-segura-123', '3.3.3.3', $now)->status);
        // After the window it works again
        $later = $now->modify('+16 minutes');
        self::assertSame(LoginResult::Success, $this->auth->attempt('admin', 'clave-segura-123', '2.2.2.2', $later)->status);
    }
}
