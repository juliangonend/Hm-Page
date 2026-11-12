<?php

declare(strict_types=1);

namespace HmApi\Http;

interface SessionStore
{
    public function get(string $key): mixed;

    public function set(string $key, mixed $value): void;

    /** New session id after login (prevents session fixation). */
    public function regenerate(): void;

    public function destroy(): void;
}
