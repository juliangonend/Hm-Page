<?php

declare(strict_types=1);

namespace HmApi\Tests;

use HmApi\Http\SessionStore;

final class ArraySession implements SessionStore
{
    /** @var array<string, mixed> */
    public array $data = [];
    public int $regenerations = 0;

    public function get(string $key): mixed
    {
        return $this->data[$key] ?? null;
    }

    public function set(string $key, mixed $value): void
    {
        $this->data[$key] = $value;
    }

    public function regenerate(): void
    {
        $this->regenerations++;
    }

    public function destroy(): void
    {
        $this->data = [];
    }
}
