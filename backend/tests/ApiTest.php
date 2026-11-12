<?php

declare(strict_types=1);

namespace HmApi\Tests;

use DateTimeImmutable;
use DateTimeZone;
use HmApi\Application\Authenticator;
use HmApi\Application\EventValidator;
use HmApi\Http\Api;
use HmApi\Http\Request;
use HmApi\Http\Response;
use HmApi\Infrastructure\PdoAdminRepository;
use HmApi\Infrastructure\PdoEventRepository;
use HmApi\Infrastructure\PdoLoginThrottle;
use PHPUnit\Framework\TestCase;

final class ApiTest extends TestCase
{
    private Api $api;
    private ArraySession $session;
    private FakeImageStorage $images;
    private DateTimeImmutable $now;

    private const EVENT = [
        'title' => 'Campus de verano',
        'subtitle' => 'Arqueros y jugadores de campo',
        'venue' => 'Club Alemán, Mendoza',
        'description' => 'Tres días de entrenamiento intensivo.',
        'date' => '2027-02-10T09:00',
        'link' => 'https://example.com/campus',
        'price' => '45000',
    ];

    protected function setUp(): void
    {
        $tz = new DateTimeZone('America/Argentina/Buenos_Aires');
        $pdo = TestDatabase::create();
        $admins = new PdoAdminRepository($pdo);
        $admins->save('admin', 'clave-segura-123');

        $this->now = new DateTimeImmutable('2027-01-01 10:00', $tz);
        $this->session = new ArraySession();
        $this->images = new FakeImageStorage();
        $this->api = new Api(
            events: new PdoEventRepository($pdo, $tz),
            validator: new EventValidator($tz),
            auth: new Authenticator($admins, new PdoLoginThrottle($pdo, maxAttempts: 5, windowMinutes: 15)),
            images: $this->images,
            session: $this->session,
            clock: fn () => $this->now,
            uploadsUrl: '/uploads/events/',
            sessionIdleMinutes: 120,
        );
    }

    /** @param array<string, mixed> $body @param array<string, array<string, mixed>> $files */
    private function call(string $method, string $path, array $body = [], array $files = []): Response
    {
        return $this->api->handle(new Request($method, $path, $body, $files, '10.0.0.1'));
    }

    /** @return array<string, mixed> */
    private function json(Response $response): array
    {
        return json_decode($response->body, true, flags: JSON_THROW_ON_ERROR);
    }

    private function login(): void
    {
        $response = $this->call('POST', '/auth/login', ['username' => 'admin', 'password' => 'clave-segura-123']);
        self::assertSame(200, $response->status);
    }

    public function testAdminRoutesRequireLogin(): void
    {
        self::assertSame(401, $this->call('GET', '/admin/events')->status);
        self::assertSame(401, $this->call('POST', '/admin/events', self::EVENT)->status);
        self::assertSame(401, $this->call('GET', '/auth/me')->status);
    }

    public function testLoginFailsWithWrongPasswordAndThenLocksTheIp(): void
    {
        for ($i = 0; $i < 5; $i++) {
            self::assertSame(401, $this->call('POST', '/auth/login', ['username' => 'admin', 'password' => 'mal'])->status);
        }
        self::assertSame(429, $this->call('POST', '/auth/login', ['username' => 'admin', 'password' => 'clave-segura-123'])->status);
    }

    public function testLoginRegeneratesTheSessionAndMeReturnsTheUser(): void
    {
        $this->login();

        self::assertSame(1, $this->session->regenerations);
        self::assertSame(['username' => 'admin'], $this->json($this->call('GET', '/auth/me')));
    }

    public function testFullEventLifecycleAsAdmin(): void
    {
        $this->login();

        $invalid = $this->call('POST', '/admin/events', ['title' => ''] + self::EVENT);
        self::assertSame(422, $invalid->status);
        self::assertArrayHasKey('title', $this->json($invalid)['fields']);

        $created = $this->call('POST', '/admin/events', self::EVENT);
        self::assertSame(201, $created->status);
        $event = $this->json($created);
        self::assertSame('Campus de verano', $event['title']);
        self::assertSame('Arqueros y jugadores de campo', $event['subtitle']);
        self::assertSame('Club Alemán, Mendoza', $event['venue']);
        self::assertSame('45000.00', $event['price']);
        self::assertSame('2027-02-10T09:00:00-03:00', $event['date']);
        self::assertNull($event['imageUrl']);

        $id = $event['id'];
        $updated = $this->call('PUT', "/admin/events/$id", ['title' => 'Campus de invierno'] + self::EVENT);
        self::assertSame('Campus de invierno', $this->json($updated)['title']);

        $withImage = $this->call('POST', "/admin/events/$id/image", [], ['image' => ['tmp_name' => '/tmp/x', 'error' => UPLOAD_ERR_OK, 'size' => 10]]);
        self::assertSame("/uploads/events/event-$id-0.webp", $this->json($withImage)['imageUrl']);

        // Replacing the image deletes the previous file
        $this->call('POST', "/admin/events/$id/image", [], ['image' => ['tmp_name' => '/tmp/y', 'error' => UPLOAD_ERR_OK, 'size' => 10]]);
        self::assertSame(["event-$id-0.webp"], $this->images->deleted);

        self::assertCount(1, $this->json($this->call('GET', '/admin/events')));

        self::assertSame(204, $this->call('DELETE', "/admin/events/$id")->status);
        self::assertSame(["event-$id-0.webp", "event-$id-1.webp"], $this->images->deleted);
        self::assertSame(404, $this->call('DELETE', "/admin/events/$id")->status);
        self::assertSame(404, $this->call('PUT', "/admin/events/$id", self::EVENT)->status);
    }

    public function testImageUploadWithoutAFileIsRejected(): void
    {
        $this->login();
        $id = $this->json($this->call('POST', '/admin/events', self::EVENT))['id'];

        self::assertSame(422, $this->call('POST', "/admin/events/$id/image")->status);
    }

    public function testPublicEndpointListsOnlyUpcomingPublishedEvents(): void
    {
        $this->login();
        $this->call('POST', '/admin/events', self::EVENT);
        $this->call('POST', '/admin/events', ['title' => 'Borrador', 'published' => false] + self::EVENT);
        $this->call('POST', '/admin/events', ['title' => 'Pasado', 'date' => '2026-12-01T10:00'] + self::EVENT);
        $this->call('POST', '/auth/logout');

        $response = $this->call('GET', '/events');
        self::assertSame(200, $response->status);
        self::assertSame(['Campus de verano'], array_column($this->json($response), 'title'));
        self::assertStringContainsString('max-age', $response->headers['Cache-Control']);
    }

    public function testLogoutAndIdleTimeoutEndTheSession(): void
    {
        $this->login();
        self::assertSame(204, $this->call('POST', '/auth/logout')->status);
        self::assertSame(401, $this->call('GET', '/admin/events')->status);

        $this->login();
        $this->now = $this->now->modify('+121 minutes');
        self::assertSame(401, $this->call('GET', '/admin/events')->status);
    }

    public function testUnknownRoutesAndMethods(): void
    {
        self::assertSame(404, $this->call('GET', '/nada')->status);
        self::assertSame(405, $this->call('DELETE', '/events')->status);
    }
}
