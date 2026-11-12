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
