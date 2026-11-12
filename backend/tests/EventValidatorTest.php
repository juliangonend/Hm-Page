<?php

declare(strict_types=1);

namespace HmApi\Tests;

use HmApi\Application\EventValidator;
use HmApi\Domain\ValidationException;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class EventValidatorTest extends TestCase
{
    private EventValidator $validator;

    protected function setUp(): void
    {
        $this->validator = new EventValidator(new \DateTimeZone('America/Argentina/Buenos_Aires'));
    }

    public function testBuildsEventDataFromAValidPayload(): void
    {
        $data = $this->validator->validate([
            'title' => '  Campus de verano  ',
            'subtitle' => '  Arqueros y jugadores  ',
            'venue' => ' Club Alemán, Mendoza ',
            'description' => 'Tres días de entrenamiento.',
            'date' => '2027-01-15T09:30',
            'link' => 'https://example.com/inscripcion',
            'price' => '45000,50',
            'currency' => 'ars',
            'published' => false,
        ]);

        self::assertSame('Campus de verano', $data->title);
        self::assertSame('Arqueros y jugadores', $data->subtitle);
        self::assertSame('Club Alemán, Mendoza', $data->venue);
        self::assertSame('Tres días de entrenamiento.', $data->description);
        self::assertSame('2027-01-15 09:30:00', $data->date->format('Y-m-d H:i:s'));
        self::assertSame('https://example.com/inscripcion', $data->link);
        self::assertSame('45000.50', $data->price);
        self::assertSame('ARS', $data->currency);
        self::assertFalse($data->published);
    }

    public function testOptionalFieldsDefaultToNoLinkNoPriceArsAndPublished(): void
    {
        $data = $this->validator->validate([
            'title' => 'Clínica de arqueros',
            'description' => 'Para todas las edades.',
            'date' => '2027-03-01T18:00:00',
            'link' => '',
            'price' => null,
        ]);

        self::assertNull($data->subtitle);
        self::assertNull($data->venue);
        self::assertNull($data->link);
        self::assertNull($data->price);
        self::assertSame('ARS', $data->currency);
        self::assertTrue($data->published);
    }

    /** @return iterable<string, array{array<string, mixed>, string}> */
    public static function invalidPayloads(): iterable
    {
        $valid = ['title' => 'Campus', 'description' => 'Texto', 'date' => '2027-01-15T09:30'];

        yield 'missing title' => [['title' => '  '] + $valid, 'title'];
        yield 'title too long' => [['title' => str_repeat('a', 151)] + $valid, 'title'];
        yield 'subtitle too long' => [['subtitle' => str_repeat('a', 201)] + $valid, 'subtitle'];
        yield 'venue too long' => [['venue' => str_repeat('a', 151)] + $valid, 'venue'];
        yield 'missing description' => [['description' => ''] + $valid, 'description'];
        yield 'bad date' => [['date' => '15/01/2027'] + $valid, 'date'];
        yield 'impossible date' => [['date' => '2027-02-31T10:00'] + $valid, 'date'];
        yield 'link not http' => [['link' => 'javascript:alert(1)'] + $valid, 'link'];
        yield 'negative price' => [['price' => '-10'] + $valid, 'price'];
        yield 'price not a number' => [['price' => 'gratis'] + $valid, 'price'];
        yield 'bad currency' => [['currency' => 'PESOS'] + $valid, 'currency'];
    }

    /** @param array<string, mixed> $payload */
    #[DataProvider('invalidPayloads')]
    public function testRejectsInvalidPayloadsNamingTheField(array $payload, string $field): void
    {
        try {
            $this->validator->validate($payload);
            self::fail('Expected a ValidationException');
        } catch (ValidationException $e) {
            self::assertArrayHasKey($field, $e->errors);
        }
    }
}
