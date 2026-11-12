<?php

declare(strict_types=1);

namespace HmApi\Domain;

/** Port: stores event photos and returns the stored file name. */
interface ImageStorage
{
    /** @throws ValidationException when the file is not a valid image or is too big */
    public function store(string $tmpPath, string $prefix): string;

    public function delete(string $name): void;
}
