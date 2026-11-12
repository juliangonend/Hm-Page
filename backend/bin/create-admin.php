<?php

declare(strict_types=1);

/*
 * Creates (or replaces) the single back office user.
 *   php bin/create-admin.php <username>
 * The password is asked interactively and never stored in shell history.
 */

use HmApi\Infrastructure\PdoAdminRepository;

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require __DIR__ . '/../bootstrap.php';

$username = trim($argv[1] ?? '');
if (!preg_match('/^[A-Za-z0-9._-]{3,50}$/', $username)) {
    fwrite(STDERR, "Usage: php bin/create-admin.php <username>  (3-50 letters, numbers, . _ -)\n");
    exit(1);
}

$ask = static function (string $prompt): string {
    echo $prompt;
    shell_exec('stty -echo 2>/dev/null');
    $value = rtrim((string) fgets(STDIN), "\r\n");
    shell_exec('stty echo 2>/dev/null');
    echo "\n";

    return $value;
};

$password = $ask('Password (min. 12 characters): ');
if (mb_strlen($password) < 12) {
    fwrite(STDERR, "The password must have at least 12 characters.\n");
    exit(1);
}
if ($ask('Repeat password: ') !== $password) {
    fwrite(STDERR, "Passwords do not match.\n");
    exit(1);
}

(new PdoAdminRepository(hm_pdo(hm_config())))->save($username, $password);
echo "Admin user \"$username\" saved. Any previous user was replaced.\n";
