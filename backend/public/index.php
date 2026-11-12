<?php

declare(strict_types=1);

use HmApi\Http\Request;
use HmApi\Http\Response;

// `php -S` (local dev): let the built-in server serve real files such as uploaded photos
if (PHP_SAPI === 'cli-server' && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
    return false;
}

require __DIR__ . '/../bootstrap.php';

try {
    $config = hm_config();
    ini_set('display_errors', $config['debug'] ? '1' : '0');
    date_default_timezone_set($config['timezone']);

    $api = hm_build_api($config, hm_pdo($config));
    $response = $api->handle(Request::fromGlobals($config['base_path']));
} catch (Throwable $e) {
    // Log the real cause on the server, show a generic message to the client
    error_log('[hm-api] ' . $e);
    $response = Response::error('Error interno. Probá de nuevo más tarde.', 500);
}

$response->send();
