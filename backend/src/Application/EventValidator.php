<?php

declare(strict_types=1);

namespace HmApi\Application;

use DateTimeImmutable;
use DateTimeZone;
use HmApi\Domain\EventData;
use HmApi\Domain\ValidationException;

/** Turns a raw request payload into EventData, collecting every field error at once. */
final class EventValidator
{
    private const DATE_FORMATS = ['Y-m-d\TH:i', 'Y-m-d\TH:i:s', 'Y-m-d H:i', 'Y-m-d H:i:s'];
    private const MAX_PRICE = 99_999_999.99;
    /** Countries with a Hockey Management WhatsApp line. */
    public const COUNTRIES = ['AR', 'CL', 'ES'];

    public function __construct(private readonly DateTimeZone $timezone)
    {
    }

    /** @param array<string, mixed> $input */
    public function validate(array $input): EventData
    {
        $errors = [];

        $title = $this->text($input['title'] ?? null);
        if ($title === '' || mb_strlen($title) > 150) {
            $errors['title'] = 'El título es obligatorio (máximo 150 caracteres).';
        }

        $subtitle = $this->text($input['subtitle'] ?? null);
        if (mb_strlen($subtitle) > 200) {
            $errors['subtitle'] = 'El subtítulo puede tener hasta 200 caracteres.';
        }

        $venue = $this->text($input['venue'] ?? null);
        if (mb_strlen($venue) > 150) {
            $errors['venue'] = 'La sede puede tener hasta 150 caracteres.';
        }

        $country = strtoupper($this->text($input['country'] ?? null) ?: 'AR');
        if (!in_array($country, self::COUNTRIES, true)) {
            $errors['country'] = 'Elegí un país: Argentina, Chile o España.';
        }

        $description = $this->text($input['description'] ?? null);
        if ($description === '' || mb_strlen($description) > 5000) {
            $errors['description'] = 'La descripción es obligatoria (máximo 5000 caracteres).';
        }

        $date = $this->date($this->text($input['date'] ?? null));
        if ($date === null) {
            $errors['date'] = 'La fecha no es válida.';
        }

        $endDateInput = $this->text($input['endDate'] ?? null);
        $endDate = $endDateInput === '' ? null : $this->day($endDateInput);
        if ($endDateInput !== '' && $endDate === null) {
            $errors['endDate'] = 'La fecha de fin no es válida.';
        } elseif ($endDate !== null && $date !== null && $endDate < $date->setTime(0, 0)) {
            $errors['endDate'] = 'La fecha de fin no puede ser anterior a la de inicio.';
        }

        $link = $this->text($input['link'] ?? null);
        if ($link !== '' && !$this->isHttpUrl($link)) {
            $errors['link'] = 'El link tiene que empezar con http:// o https://';
        }

        $priceInput = $this->text($input['price'] ?? null);
        $price = $priceInput === '' ? null : $this->price($priceInput);
        if ($priceInput !== '' && $price === null) {
            $errors['price'] = 'El valor tiene que ser un número positivo.';
        }

        $currency = strtoupper($this->text($input['currency'] ?? null) ?: 'ARS');
        if (!preg_match('/^[A-Z]{3}$/', $currency)) {
            $errors['currency'] = 'La moneda tiene que ser un código de 3 letras (ARS, USD...).';
        }

        $published = filter_var($input['published'] ?? true, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($published === null) {
            $errors['published'] = 'El estado de publicación no es válido.';
        }

        if ($errors !== [] || $date === null) {
            throw new ValidationException($errors);
        }

        return new EventData(
            title: $title,
            subtitle: $subtitle === '' ? null : $subtitle,
            venue: $venue === '' ? null : $venue,
            country: $country,
            description: $description,
            date: $date,
            endDate: $endDate,
            link: $link === '' ? null : $link,
            price: $price,
            currency: $currency,
            published: (bool) $published,
        );
    }

    private function text(mixed $value): string
    {
        return is_scalar($value) ? trim((string) $value) : '';
    }

    private function date(string $value): ?DateTimeImmutable
    {
        foreach (self::DATE_FORMATS as $format) {
            $date = DateTimeImmutable::createFromFormat('!' . $format, $value, $this->timezone);
            // Round-trip check rejects overflowing dates such as Feb 31
            if ($date !== false && $date->format($format) === $value) {
                return $date;
            }
        }

        return null;
    }

    /** "2027-01-17" → that day at 00:00, or null (rejects overflowing days such as Feb 31). */
    private function day(string $value): ?DateTimeImmutable
    {
        $day = DateTimeImmutable::createFromFormat('!Y-m-d', $value, $this->timezone);

        return $day !== false && $day->format('Y-m-d') === $value ? $day : null;
    }

    private function isHttpUrl(string $url): bool
    {
        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));

        return mb_strlen($url) <= 500
            && in_array($scheme, ['http', 'https'], true)
            && filter_var($url, FILTER_VALIDATE_URL) !== false;
    }

    /** Accepts "45000", "45000.5", "45000,50" and "45.000,50". Returns "45000.50" or null. */
    private function price(string $value): ?string
    {
        $normalized = str_contains($value, ',') ? str_replace(['.', ','], ['', '.'], $value) : $value;
        if (!preg_match('/^\d+(\.\d{1,2})?$/', $normalized) || (float) $normalized > self::MAX_PRICE) {
            return null;
        }

        return number_format((float) $normalized, 2, '.', '');
    }
}
