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
        /** ISO 3166-1 alpha-2 code of the country it happens in: "AR", "CL" or "ES". */
        public readonly string $country,
        public readonly string $description,
        public readonly DateTimeImmutable $date,
        public readonly ?string $link,
        public readonly ?string $price,
        public readonly string $currency,
        public readonly bool $published,
    ) {
    }
}
