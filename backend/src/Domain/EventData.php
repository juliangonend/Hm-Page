<?php

declare(strict_types=1);

namespace HmApi\Domain;

use DateTimeImmutable;

/** Validated input to create or update an event. */
final class EventData
{
    public function __construct(
        public readonly string $title,
        /** Short line under the title, e.g. "Arqueros y jugadores de campo" */
        public readonly ?string $subtitle,
        /** Where it happens, e.g. "Club Alemán, Mendoza" */
        public readonly ?string $venue,
        public readonly string $description,
        public readonly DateTimeImmutable $date,
        public readonly ?string $link,
        public readonly ?string $price,
        public readonly string $currency,
        public readonly bool $published,
    ) {
    }
}
