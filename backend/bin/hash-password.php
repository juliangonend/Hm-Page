<?php

declare(strict_types=1);

/*
 * Prints a password hash to create the admin user WITHOUT SSH:
 *   php backend/bin/hash-password.php
 * Then, in phpMyAdmin → SQL:
 *   INSERT INTO admin_user (username, password_hash) VALUES ('admin', '<hash>');
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$ask = static function (string $prompt): string {
    echo $prompt;
    shell_exec('stty -echo 2>/dev/null');
    $value = rtrim((string) fgets(STDIN), "\r\n");
    shell_exec('stty echo 2>/dev/null');
    echo "\n";

    return $value;
};

$password = $ask('Contraseña (mínimo 12 caracteres): ');
if (mb_strlen($password) < 12) {
    fwrite(STDERR, "La contraseña tiene que tener al menos 12 caracteres.\n");
    exit(1);
}
if ($ask('Repetí la contraseña: ') !== $password) {
    fwrite(STDERR, "Las contraseñas no coinciden.\n");
    exit(1);
}

echo "\nHash (copialo completo):\n" . password_hash($password, PASSWORD_DEFAULT) . "\n";
