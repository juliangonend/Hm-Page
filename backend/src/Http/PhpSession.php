<?php

declare(strict_types=1);

namespace HmApi\Http;

/** Native PHP session, started lazily so public requests never create a session cookie. */
final class PhpSession implements SessionStore
{
    private const COOKIE = 'hm_admin';

    public function __construct(private readonly bool $secureCookie)
    {
    }

    public function get(string $key): mixed
    {
        // Check our own cookie name: session_name() is still PHP's default until start() runs
        if (!isset($_COOKIE[self::COOKIE]) && session_status() !== PHP_SESSION_ACTIVE) {
            return null;
        }
        $this->start();

        return $_SESSION[$key] ?? null;
    }

    public function set(string $key, mixed $value): void
    {
        $this->start();
        $_SESSION[$key] = $value;
    }

    public function regenerate(): void
    {
        $this->start();
        session_regenerate_id(true);
    }

    public function destroy(): void
    {
        $this->start();
        $_SESSION = [];
        $params = session_get_cookie_params();
        setcookie(self::COOKIE, '', [
            'expires' => time() - 3600,
            'path' => $params['path'],
            'secure' => $params['secure'],
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
        session_destroy();
    }

    private function start(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }
        session_name(self::COOKIE);
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => $this->secureCookie,
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
        session_start(['use_strict_mode' => true]);
    }
}
