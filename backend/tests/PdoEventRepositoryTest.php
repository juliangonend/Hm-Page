<?php

declare(strict_types=1);

namespace HmApi\Tests;

use DateTimeImmutable;
use DateTimeZone;
use HmApi\Domain\EventData;
use HmApi\Infrastructure\PdoEventRepository;
use PHPUnit\Framework\TestCase;

final class PdoEventRepositoryTest extends TestCase
{
    private PdoEventRepository $repo;
    private DateTimeZone $tz;

    protected function setUp(): void
    {
        $this->tz = new DateTimeZone('America/Argentina/Buenos_Aires');
        $this->repo = new PdoEventRepository(TestDatabase::create(), $this->tz);
    }

    private function data(string $title, string $date, bool $published = true, ?string $price = null): EventData
    {
        return new EventData(
            title: $title,
            subtitle: "Subtítulo de $title",
            venue: 'Club Alemán, Mendoza',
            country: 'ES',
            description: "Descripción de $title",
            date: new DateTimeImmutable($date, $this->tz),
            link: null,
            price: $price,
            currency: 'ARS',
            published: $published,
        );
    }

    public function testCreatesAndFindsAnEvent(): void
    {
        $now = new DateTimeImmutable('2027-01-01 10:00', $this->tz);
        $created = $this->repo->create($this->data('Campus', '2027-02-01 09:00', price: '1500.00'), $now);

        $found = $this->repo->find($created->id);
        self::assertNotNull($found);
        self::assertSame('Campus', $found->title);
        self::assertSame('Subtítulo de Campus', $found->subtitle);
        self::assertSame('Club Alemán, Mendoza', $found->venue);
        self::assertSame('ES', $found->country);
        self::assertSame('1500.00', $found->price);
        self::assertSame('2027-02-01 09:00', $found->date->format('Y-m-d H:i'));
        self::assertNull($found->imagePath);
    }

    public function testUpcomingOnlyReturnsFuturePublishedEventsSoonestFirst(): void
    {
        $now = new DateTimeImmutable('2027-01-10 12:00', $this->tz);
        $this->repo->create($this->data('Pasado', '2027-01-09 12:00'), $now);
        $this->repo->create($this->data('Lejano', '2027-05-01 12:00'), $now);
        $this->repo->create($this->data('Borrador', '2027-02-01 12:00', published: false), $now);
        $this->repo->create($this->data('Próximo', '2027-01-20 12:00'), $now);

        $titles = array_map(fn ($e) => $e->title, $this->repo->upcoming($now));

        self::assertSame(['Próximo', 'Lejano'], $titles);
    }

    public function testAllReturnsEveryEventNewestDateFirst(): void
    {
        $now = new DateTimeImmutable('2027-01-10 12:00', $this->tz);
        $this->repo->create($this->data('A', '2027-01-09 12:00'), $now);
        $this->repo->create($this->data('B', '2027-03-01 12:00', published: false), $now);

        self::assertSame(['B', 'A'], array_map(fn ($e) => $e->title, $this->repo->all()));
    }

    public function testUpdatesDeletesAndSetsTheImage(): void
    {
        $now = new DateTimeImmutable('2027-01-01 10:00', $this->tz);
        $event = $this->repo->create($this->data('Campus', '2027-02-01 09:00'), $now);

        $updated = $this->repo->update($event->id, $this->data('Campus 2', '2027-02-02 09:00'), $now);
        self::assertSame('Campus 2', $updated?->title);

        $this->repo->setImage($event->id, 'event-1-abc.webp', $now);
        self::assertSame('event-1-abc.webp', $this->repo->find($event->id)?->imagePath);

        self::assertTrue($this->repo->delete($event->id));
        self::assertNull($this->repo->find($event->id));
        self::assertFalse($this->repo->delete($event->id));
        self::assertNull($this->repo->update(999, $this->data('X', '2027-02-02 09:00'), $now));
    }
}
