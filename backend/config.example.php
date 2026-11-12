<?php

/*
 * Copy this file to config.php (same folder) and fill in your values.
 * config.php is git-ignored: database passwords never go to the repository.
 */

return [
    // MySQL database created in hPanel → Databases → Management
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'u000000000_hm',
        'user' => 'u000000000_hm',
        'password' => 'CHANGE_ME',
    ],

    // Public path where the API lives: https://your-domain.com/api/...
    'base_path' => '/api',

    'timezone' => 'America/Argentina/Buenos_Aires',

    // Hostinger (backend uploaded to public_html/api): photos go to public_html/uploads/events
    'uploads_dir' => __DIR__ . '/../uploads/events',
    // Local development (`composer serve`): use __DIR__ . '/public/uploads/events'
    'uploads_url' => '/uploads/events/',

    // true in production (HTTPS). false only for local http://localhost
    'cookie_secure' => true,

    // Never show PHP errors to visitors in production
    'debug' => false,
];
