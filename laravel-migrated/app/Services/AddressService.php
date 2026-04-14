<?php

namespace App\Services;

class AddressService
{
    public static function normalize(array $input): array
    {
        $line1 = self::sanitizePart((string) ($input['address'] ?? ''));
        $city = self::sanitizePart((string) ($input['city'] ?? ''));
        $country = self::sanitizePart((string) ($input['country'] ?? 'Pakistan')) ?: 'Pakistan';
        $postalCode = self::sanitizePart((string) ($input['postalCode'] ?? ''));

        $parts = array_filter([$line1, $city, $country, $postalCode]);

        return [
            'line1' => $line1,
            'city' => $city,
            'country' => $country,
            'postalCode' => $postalCode,
            'fullAddress' => implode(', ', $parts),
        ];
    }

    private static function sanitizePart(string $value): string
    {
        $cleaned = preg_replace('/[\r\n\t]+/', ' ', $value);
        $cleaned = preg_replace('/\s+/', ' ', $cleaned);
        return trim($cleaned);
    }
}
