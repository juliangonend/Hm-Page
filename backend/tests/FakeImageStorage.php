<?php

declare(strict_types=1);

namespace HmApi\Tests;

use HmApi\Domain\ImageStorage;

final class FakeImageStorage implements ImageStorage
{
    /** @var list<string> */
    public array $stored = [];
    /** @var list<string> */
    public array $deleted = [];

    public function store(string $tmpPath, string $prefix): string
    {
        $name = $prefix . '-' . count($this->stored) . '.webp';
        $this->stored[] = $name;

        return $name;
    }

    public function delete(string $name): void
    {
        $this->deleted[] = $name;
    }
}
