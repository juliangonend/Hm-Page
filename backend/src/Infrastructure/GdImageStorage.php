<?php

declare(strict_types=1);

namespace HmApi\Infrastructure;

use GdImage;
use HmApi\Domain\ImageStorage;
use HmApi\Domain\ValidationException;

/**
 * Re-encodes every upload to WebP with GD: only real images survive (anything else fails to decode),
 * metadata and embedded payloads are dropped, and big photos are scaled down.
 */
final class GdImageStorage implements ImageStorage
{
    private const ALLOWED = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP];

    public function __construct(
        private readonly string $directory,
        private readonly int $maxBytes = 3 * 1024 * 1024,
        private readonly int $maxWidth = 1600,
        private readonly int $quality = 80,
    ) {
    }

    public function store(string $tmpPath, string $prefix): string
    {
        $size = @filesize($tmpPath);
        if ($size === false || $size > $this->maxBytes) {
            throw new ValidationException(['image' => sprintf('La foto no puede pesar más de %d MB.', intdiv($this->maxBytes, 1024 * 1024) ?: 1)]);
        }

        $info = @getimagesize($tmpPath);
        $image = $info !== false && in_array($info[2], self::ALLOWED, true) ? $this->load($tmpPath, $info[2]) : null;
        if ($image === null) {
            throw new ValidationException(['image' => 'El archivo tiene que ser una foto JPG, PNG o WebP.']);
        }

        $image = $this->fit($image);
        $this->ensureDirectory();
        $name = sprintf('%s-%s.webp', preg_replace('/[^a-z0-9-]/', '', strtolower($prefix)), bin2hex(random_bytes(6)));
        imagewebp($image, $this->directory . '/' . $name, $this->quality);

        return $name;
    }

    public function delete(string $name): void
    {
        // basename() blocks "../" tricks: only files inside the uploads folder can be removed
        $path = $this->directory . '/' . basename($name);
        if (is_file($path)) {
            unlink($path);
        }
    }

    private function load(string $path, int $type): ?GdImage
    {
        $image = match ($type) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
            IMAGETYPE_PNG => @imagecreatefrompng($path),
            IMAGETYPE_WEBP => @imagecreatefromwebp($path),
            default => false,
        };

        return $image instanceof GdImage ? $image : null;
    }

    private function fit(GdImage $image): GdImage
    {
        $width = imagesx($image);
        if ($width <= $this->maxWidth) {
            return $image;
        }
        $height = (int) round(imagesy($image) * $this->maxWidth / $width);
        $resized = imagecreatetruecolor($this->maxWidth, $height);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $image, 0, 0, 0, 0, $this->maxWidth, $height, $width, imagesy($image));

        return $resized;
    }

    private function ensureDirectory(): void
    {
        if (!is_dir($this->directory) && !mkdir($this->directory, 0755, true) && !is_dir($this->directory)) {
            throw new \RuntimeException('Cannot create the uploads directory');
        }
        $htaccess = $this->directory . '/.htaccess';
        if (!is_file($htaccess)) {
            // Uploads are data, never code: block script execution and directory listings
            file_put_contents($htaccess, <<<'HTACCESS'
                Options -Indexes
                <FilesMatch "\.(php\d?|phtml|phar|cgi|pl|py|sh)$">
                  Require all denied
                </FilesMatch>
                HTACCESS);
        }
    }
}
