<?php

declare(strict_types=1);

namespace HmApi\Infrastructure;

use DateTimeImmutable;
use DateTimeZone;
use HmApi\Domain\Event;
use HmApi\Domain\EventData;
use HmApi\Domain\EventRepository;
use PDO;

/** MySQL adapter (also runs on SQLite in tests: only portable SQL, the clock comes from PHP). */
final class PdoEventRepository implements EventRepository
{
    private const DB_DATE = 'Y-m-d H:i:s';
    private const COLUMNS = 'id, title, subtitle, venue, country, description, event_date, end_date, link, price, currency, image_path, is_published';

    public function __construct(
        private readonly PDO $pdo,
        private readonly DateTimeZone $timezone,
    ) {
    }

    public function upcoming(DateTimeImmutable $now): array
    {
        $stmt = $this->pdo->prepare(
            // A multi-day event stays listed until its last day is over
            'SELECT ' . self::COLUMNS . ' FROM events
             WHERE is_published = 1 AND (event_date >= :now OR end_date >= :today)
             ORDER BY event_date ASC'
        );
        $stmt->execute(['now' => $this->dbDate($now), 'today' => $now->setTimezone($this->timezone)->format('Y-m-d')]);

        return array_map($this->hydrate(...), $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function all(): array
    {
        $stmt = $this->pdo->query('SELECT ' . self::COLUMNS . ' FROM events ORDER BY event_date DESC');

        return array_map($this->hydrate(...), $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function find(int $id): ?Event
    {
        $stmt = $this->pdo->prepare('SELECT ' . self::COLUMNS . ' FROM events WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $this->hydrate($row);
    }

    public function create(EventData $data, DateTimeImmutable $now): Event
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO events (title, subtitle, venue, country, description, event_date, end_date, link, price, currency, is_published, created_at, updated_at)
             VALUES (:title, :subtitle, :venue, :country, :description, :event_date, :end_date, :link, :price, :currency, :published, :now, :now2)'
        );
        $stmt->execute($this->params($data) + ['now' => $this->dbDate($now), 'now2' => $this->dbDate($now)]);

        return $this->find((int) $this->pdo->lastInsertId()) ?? throw new \RuntimeException('Event not persisted');
    }

    public function update(int $id, EventData $data, DateTimeImmutable $now): ?Event
    {
        if ($this->find($id) === null) {
            return null;
        }
        $stmt = $this->pdo->prepare(
            'UPDATE events SET title = :title, subtitle = :subtitle, venue = :venue, country = :country, description = :description, event_date = :event_date, end_date = :end_date, link = :link,
             price = :price, currency = :currency, is_published = :published, updated_at = :now WHERE id = :id'
        );
        $stmt->execute($this->params($data) + ['now' => $this->dbDate($now), 'id' => $id]);

        return $this->find($id);
    }

    public function setImage(int $id, ?string $imagePath, DateTimeImmutable $now): void
    {
        $stmt = $this->pdo->prepare('UPDATE events SET image_path = :image, updated_at = :now WHERE id = :id');
        $stmt->execute(['image' => $imagePath, 'now' => $this->dbDate($now), 'id' => $id]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM events WHERE id = :id');
        $stmt->execute(['id' => $id]);

        return $stmt->rowCount() > 0;
    }

    /** @return array<string, mixed> */
    private function params(EventData $data): array
    {
        return [
            'title' => $data->title,
            'subtitle' => $data->subtitle,
            'venue' => $data->venue,
            'country' => $data->country,
            'description' => $data->description,
            'event_date' => $this->dbDate($data->date),
            'end_date' => $data->endDate?->format('Y-m-d'),
            'link' => $data->link,
            'price' => $data->price,
            'currency' => $data->currency,
            'published' => $data->published ? 1 : 0,
        ];
    }

    private function dbDate(DateTimeImmutable $date): string
    {
        return $date->setTimezone($this->timezone)->format(self::DB_DATE);
    }

    /** @param array<string, mixed> $row */
    private function hydrate(array $row): Event
    {
        return new Event(
            id: (int) $row['id'],
            title: (string) $row['title'],
            subtitle: $row['subtitle'] === null ? null : (string) $row['subtitle'],
            venue: $row['venue'] === null ? null : (string) $row['venue'],
            country: (string) $row['country'],
            description: (string) $row['description'],
            date: new DateTimeImmutable((string) $row['event_date'], $this->timezone),
            endDate: $row['end_date'] === null ? null : new DateTimeImmutable(substr((string) $row['end_date'], 0, 10), $this->timezone),
            link: $row['link'] === null ? null : (string) $row['link'],
            price: $row['price'] === null ? null : number_format((float) $row['price'], 2, '.', ''),
            currency: (string) $row['currency'],
            imagePath: $row['image_path'] === null ? null : (string) $row['image_path'],
            published: (bool) $row['is_published'],
        );
    }
}
