<?php

declare(strict_types=1);

/*
 * Composition root: autoloads HmApi\* from src/ (no Composer needed on the server)
 * and builds the Api with its production adapters.
 */

use HmApi\Application\Authenticator;
use HmApi\Application\EventValidator;
use HmApi\Http\Api;
use HmApi\Http\PhpSession;
use HmApi\Infrastructure\GdImageStorage;
use HmApi\Infrastructure\PdoAdminRepository;
use HmApi\Infrastructure\PdoEventRepository;
use HmApi\Infrastructure\PdoLoginThrottle;

spl_autoload_register(static function (string $class): void {
    $prefix = 'HmApi\\';
    if (str_starts_with($class, $prefix)) {
        $file = __DIR__ . '/src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
        if (is_file($file)) {
            require $file;
        }
    }
});

/** @return array<string, mixed> */
function hm_config(): array
{
    $file = __DIR__ . '/config.php';
    if (!is_file($file)) {
        throw new RuntimeException('Missing config.php: copy config.example.php and fill it in.');
    }

    return require $file;
}

/** @param array<string, mixed> $config */
function hm_pdo(array $config): PDO
{
    $db = $config['db'];
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    // Local development without MySQL: 'db' => ['dsn' => 'sqlite:' . __DIR__ . '/local.sqlite']
    if (isset($db['dsn'])) {
        return new PDO($db['dsn'], null, null, $options);
    }

    return new PDO(
        sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $db['host'], $db['port'] ?? 3306, $db['name']),
        $db['user'],
        $db['password'],
        $options + [PDO::ATTR_EMULATE_PREPARES => false],
    );
}

/** @param array<string, mixed> $config */
function hm_build_api(array $config, PDO $pdo): Api
{
    $timezone = new DateTimeZone($config['timezone']);

    return new Api(
        events: new PdoEventRepository($pdo, $timezone),
        validator: new EventValidator($timezone),
        auth: new Authenticator(new PdoAdminRepository($pdo), new PdoLoginThrottle($pdo, maxAttempts: 5, windowMinutes: 15)),
        images: new GdImageStorage($config['uploads_dir']),
        session: new PhpSession(secureCookie: (bool) $config['cookie_secure']),
        clock: static fn () => new DateTimeImmutable('now', $timezone),
        uploadsUrl: $config['uploads_url'],
        sessionIdleMinutes: 120,
    );
}
