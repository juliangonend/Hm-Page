<?php

declare(strict_types=1);

/*
 * One-time local setup (no MySQL needed): SQLite database + config.php for development.
 *   npm run api:setup
 * Safe to run again: it never overwrites an existing config.php or database.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$root = dirname(__DIR__);
$config = $root . '/config.php';
$database = $root . '/local.sqlite';

if (is_file($config)) {
    echo "config.php already exists: keeping it.\n";
} else {
    file_put_contents($config, <<<'PHP'
        <?php

        // LOCAL DEVELOPMENT ONLY (created by bin/setup-local.php). Never upload this file.
        return [
            'db' => ['dsn' => 'sqlite:' . __DIR__ . '/local.sqlite'],
            'base_path' => '/api',
            'timezone' => 'America/Argentina/Buenos_Aires',
            'uploads_dir' => __DIR__ . '/public/uploads/events',
            'uploads_url' => '/uploads/events/',
            'cookie_secure' => false,
            'debug' => true,
        ];

        PHP);
    echo "config.php created (SQLite, local only).\n";
}

if (is_file($database)) {
    echo "local.sqlite already exists: keeping your local events.\n";
} else {
    $pdo = new PDO('sqlite:' . $database, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->exec((string) file_get_contents($root . '/database/schema.sqlite.sql'));
    echo "local.sqlite created with the events tables.\n";
}

echo "\nNow create your local admin user:\n";
passthru(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/create-admin.php') . ' admin', $exitCode);
exit($exitCode);
