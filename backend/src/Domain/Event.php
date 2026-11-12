<?php

declare(strict_types=1);

namespace HmApi\Domain;

use DateTimeImmutable;

/** An upcoming event as stored in the back office. */
final class Event
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        /** Short line under the title, e.g. "Arqueros y jugadores de campo" */
        public readonly ?string $subtitle,
        /** Where it happens, e.g. "Club Alemán, Mendoza" */
        public readonly ?string $venue,
        public readonly string $description,
        public readonly DateTimeImmutable $date,
        public readonly ?string $link,
        /** Decimal string with two places ("45000.00"), or null when the event has no price. */
        public readonly ?string $price,
        public readonly string $currency,
        public readonly ?string $imagePath,
        public readonly bool $published,
    ) {
    }
}
