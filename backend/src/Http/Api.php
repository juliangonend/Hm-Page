<?php

declare(strict_types=1);

namespace HmApi\Http;

use Closure;
use DateTimeImmutable;
use HmApi\Application\Authenticator;
use HmApi\Application\EventValidator;
use HmApi\Application\LoginResult;
use HmApi\Domain\Event;
use HmApi\Domain\EventRepository;
use HmApi\Domain\ImageStorage;
use HmApi\Domain\ValidationException;

/**
 * HTTP entry point of the back office.
 *
 * Public:  GET /events
 * Auth:    POST /auth/login · POST /auth/logout · GET /auth/me
 * Admin:   GET|POST /admin/events · PUT|DELETE /admin/events/{id}
 *          POST|DELETE /admin/events/{id}/image
 */
final class Api
{
    private const SESSION_USER = 'admin_username';
    private const SESSION_SEEN = 'admin_last_seen';

    /** @var list<array{string, string, Closure, bool}> method, regex, handler, requiresAdmin */
    private array $routes;

    /** @param Closure(): DateTimeImmutable $clock */
    public function __construct(
        private readonly EventRepository $events,
        private readonly EventValidator $validator,
        private readonly Authenticator $auth,
        private readonly ImageStorage $images,
        private readonly SessionStore $session,
        private readonly Closure $clock,
        private readonly string $uploadsUrl,
        private readonly int $sessionIdleMinutes = 120,
    ) {
        $this->routes = [
            ['GET', '#^/events$#', $this->publicEvents(...), false],
            ['POST', '#^/auth/login$#', $this->login(...), false],
            ['POST', '#^/auth/logout$#', $this->logout(...), false],
            ['GET', '#^/auth/me$#', $this->me(...), true],
            ['GET', '#^/admin/events$#', $this->listEvents(...), true],
            ['POST', '#^/admin/events$#', $this->createEvent(...), true],
            ['PUT', '#^/admin/events/(\d+)$#', $this->updateEvent(...), true],
            ['DELETE', '#^/admin/events/(\d+)$#', $this->deleteEvent(...), true],
            ['POST', '#^/admin/events/(\d+)/image$#', $this->uploadImage(...), true],
            ['DELETE', '#^/admin/events/(\d+)/image$#', $this->removeImage(...), true],
        ];
    }

    public function handle(Request $request): Response
    {
        $pathMatched = false;
        foreach ($this->routes as [$method, $pattern, $handler, $requiresAdmin]) {
            if (!preg_match($pattern, $request->path, $matches)) {
                continue;
            }
            $pathMatched = true;
            if ($method !== $request->method) {
                continue;
            }
            if ($requiresAdmin && !$this->isAuthenticated()) {
                return Response::error('Iniciá sesión para continuar.', 401);
            }
            try {
                return $handler($request, ...array_map('intval', array_slice($matches, 1)));
            } catch (ValidationException $e) {
                return Response::error('Revisá los datos del formulario.', 422, $e->errors);
            }
        }

        return $pathMatched ? Response::error('Método no permitido.', 405) : Response::error('No encontrado.', 404);
    }

    private function now(): DateTimeImmutable
    {
        return ($this->clock)();
    }

    private function isAuthenticated(): bool
    {
        $user = $this->session->get(self::SESSION_USER);
        $lastSeen = $this->session->get(self::SESSION_SEEN);
        $now = $this->now()->getTimestamp();
        if (!is_string($user) || !is_int($lastSeen) || $now - $lastSeen > $this->sessionIdleMinutes * 60) {
            if ($user !== null) {
                $this->session->destroy();
            }

            return false;
        }
        $this->session->set(self::SESSION_SEEN, $now);

        return true;
    }

    private function publicEvents(Request $request): Response
    {
        $events = array_map($this->present(...), $this->events->upcoming($this->now()));

        return Response::json($events, 200, ['Cache-Control' => 'public, max-age=60']);
    }

    private function login(Request $request): Response
    {
        $username = is_string($request->body['username'] ?? null) ? trim($request->body['username']) : '';
        $password = is_string($request->body['password'] ?? null) ? $request->body['password'] : '';
        $outcome = $this->auth->attempt($username, $password, $request->ip, $this->now());

        return match ($outcome->status) {
            LoginResult::TooManyAttempts => Response::error('Demasiados intentos. Probá de nuevo en unos minutos.', 429),
            LoginResult::InvalidCredentials => Response::error('Usuario o contraseña incorrectos.', 401),
            LoginResult::Success => $this->startSession((string) $outcome->username),
        };
    }

    private function startSession(string $username): Response
    {
        $this->session->regenerate();
        $this->session->set(self::SESSION_USER, $username);
        $this->session->set(self::SESSION_SEEN, $this->now()->getTimestamp());

        return Response::json(['username' => $username]);
    }

    private function logout(Request $request): Response
    {
        $this->session->destroy();

        return Response::noContent();
    }

    private function me(Request $request): Response
    {
        return Response::json(['username' => $this->session->get(self::SESSION_USER)]);
    }

    private function listEvents(Request $request): Response
    {
        return Response::json(array_map($this->present(...), $this->events->all()));
    }

    private function createEvent(Request $request): Response
    {
        $event = $this->events->create($this->validator->validate($request->body), $this->now());

        return Response::json($this->present($event), 201);
    }

    private function updateEvent(Request $request, int $id): Response
    {
        $event = $this->events->update($id, $this->validator->validate($request->body), $this->now());

        return $event === null ? $this->notFound() : Response::json($this->present($event));
    }

    private function deleteEvent(Request $request, int $id): Response
    {
        $event = $this->events->find($id);
        if ($event === null || !$this->events->delete($id)) {
            return $this->notFound();
        }
        if ($event->imagePath !== null) {
            $this->images->delete($event->imagePath);
        }

        return Response::noContent();
    }

    private function uploadImage(Request $request, int $id): Response
    {
        $event = $this->events->find($id);
        if ($event === null) {
            return $this->notFound();
        }
        $file = $request->files['image'] ?? null;
        if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_string($file['tmp_name'] ?? null)) {
            throw new ValidationException(['image' => 'Subí una foto JPG, PNG o WebP de hasta 3 MB.']);
        }

        $name = $this->images->store($file['tmp_name'], "event-$id");
        $this->events->setImage($id, $name, $this->now());
        if ($event->imagePath !== null) {
            $this->images->delete($event->imagePath);
        }

        return Response::json($this->present($this->events->find($id) ?? $event));
    }

    private function removeImage(Request $request, int $id): Response
    {
        $event = $this->events->find($id);
        if ($event === null) {
            return $this->notFound();
        }
        if ($event->imagePath !== null) {
            $this->events->setImage($id, null, $this->now());
            $this->images->delete($event->imagePath);
        }

        return Response::json($this->present($this->events->find($id) ?? $event));
    }

    private function notFound(): Response
    {
        return Response::error('El evento no existe.', 404);
    }

    /** @return array<string, mixed> */
    private function present(Event $event): array
    {
        return [
            'id' => $event->id,
            'title' => $event->title,
            'subtitle' => $event->subtitle,
            'venue' => $event->venue,
            'country' => $event->country,
            'description' => $event->description,
            'date' => $event->date->format(DATE_ATOM),
            'endDate' => $event->endDate?->format('Y-m-d'),
            'link' => $event->link,
            'price' => $event->price,
            'currency' => $event->currency,
            'imageUrl' => $event->imagePath === null ? null : $this->uploadsUrl . $event->imagePath,
            'published' => $event->published,
        ];
    }
}
