<?php

declare(strict_types=1);

namespace HmApi\Domain;

use DateTimeImmutable;

/** Port: persistence for events (MySQL in production, SQLite in tests). */
interface EventRepository
{
    /** Published events from $now on, soonest first. @return list<Event> */
    public function upcoming(DateTimeImmutable $now): array;

    /** Every event, newest date first (back office list). @return list<Event> */
    public function all(): array;

    public function find(int $id): ?Event;

    public function create(EventData $data, DateTimeImmutable $now): Event;

    public function update(int $id, EventData $data, DateTimeImmutable $now): ?Event;

    public function setImage(int $id, ?string $imagePath, DateTimeImmutable $now): void;

    public function delete(int $id): bool;
}
