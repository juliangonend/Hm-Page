<?php

declare(strict_types=1);

namespace HmApi\Infrastructure;

use HmApi\Domain\AdminRepository;
use HmApi\Domain\AdminUser;
use PDO;

final class PdoAdminRepository implements AdminRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function findByUsername(string $username): ?AdminUser
    {
        $stmt = $this->pdo->prepare('SELECT id, username, password_hash FROM admin_user WHERE username = :username');
        $stmt->execute(['username' => $username]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : new AdminUser((int) $row['id'], (string) $row['username'], (string) $row['password_hash']);
    }

    public function save(string $username, string $plainPassword): void
    {
        $this->pdo->beginTransaction();
        try {
            // Single-user back office: replacing the row keeps exactly one account
            $this->pdo->exec('DELETE FROM admin_user');
            $stmt = $this->pdo->prepare('INSERT INTO admin_user (username, password_hash) VALUES (:username, :hash)');
            $stmt->execute(['username' => $username, 'hash' => password_hash($plainPassword, PASSWORD_DEFAULT)]);
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}
