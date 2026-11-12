<?php

declare(strict_types=1);

namespace HmApi\Http;

final class Request
{
    /**
     * @param string $path Path relative to the API base ("/events", "/admin/events/3")
     * @param array<string, mixed> $body Parsed JSON or form fields
     * @param array<string, array<string, mixed>> $files Uploaded files ($_FILES shape)
     */
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        public readonly array $body = [],
        public readonly array $files = [],
        public readonly string $ip = '0.0.0.0',
    ) {
    }

    public static function fromGlobals(string $basePath): self
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        // Some shared hosts filter PUT/DELETE: allow POST + X-HTTP-Method-Override as a fallback
        $override = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? '');
        if ($method === 'POST' && in_array($override, ['PUT', 'DELETE'], true)) {
            $method = $override;
        }

        $path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        if ($basePath !== '' && str_starts_with($path, $basePath)) {
            $path = substr($path, strlen($basePath));
        }
        $path = '/' . trim($path, '/');

        $isJson = str_contains(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json');
        $body = $isJson ? json_decode((string) file_get_contents('php://input'), true) : $_POST;

        return new self($method, $path, is_array($body) ? $body : [], $_FILES, $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    }
}
