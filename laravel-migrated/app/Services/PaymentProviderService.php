<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PaymentProviderService
{
    public static function getProviderConfig(string $provider): array
    {
        $requiredVars = $provider === 'jazzcash'
            ? ['JAZZCASH_INITIATE_URL', 'JAZZCASH_STATUS_URL', 'JAZZCASH_INTEGRITY_SALT']
            : ['EASYPAISA_INITIATE_URL', 'EASYPAISA_STATUS_URL', 'EASYPAISA_SECRET'];

        $missing = array_filter($requiredVars, fn ($name) => empty(env($name)));

        return [
            'available' => count($missing) === 0,
            'missing' => array_values($missing),
        ];
    }

    public static function initiatePayment(string $provider, array $payload): array
    {
        $endpoint = self::requireEnv(
            $provider === 'jazzcash' ? 'JAZZCASH_INITIATE_URL' : 'EASYPAISA_INITIATE_URL'
        );
        $secret = self::requireEnv(
            $provider === 'jazzcash' ? 'JAZZCASH_INTEGRITY_SALT' : 'EASYPAISA_SECRET'
        );

        $requestBody = [
            'merchantReference' => $payload['merchantReference'],
            'amount' => $payload['amount'],
            'currency' => 'PKR',
            'email' => $payload['email'],
            'phone' => $payload['phone'],
            'callbackUrl' => $payload['callbackUrl'],
            'returnUrl' => $payload['returnUrl'] ?? null,
            'redirectUrl' => $payload['returnUrl'] ?? null,
            'timestamp' => now()->toISOString(),
            'provider' => $provider,
        ];

        $signature = self::hmacSha256(json_encode($requestBody), $secret);

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'X-Signature' => $signature,
            ])->timeout(15)->post($endpoint, $requestBody);

            $raw = $response->json() ?? [];

            if (!$response->ok()) {
                return [
                    'status' => 'failed',
                    'providerTransactionId' => null,
                    'paymentUrl' => null,
                    'raw' => $raw,
                ];
            }

            return [
                'providerTransactionId' => $raw['transactionId'] ?? $raw['providerTransactionId'] ?? null,
                'paymentUrl' => $raw['paymentUrl'] ?? $raw['redirectUrl'] ?? null,
                'status' => ($raw['status'] ?? '') === 'failed' ? 'failed' : 'initiated',
                'raw' => $raw,
            ];
        } catch (\Throwable $e) {
            return [
                'status' => 'failed',
                'providerTransactionId' => null,
                'paymentUrl' => null,
                'raw' => ['error' => $e->getMessage()],
            ];
        }
    }

    public static function reconcilePayment(string $provider, string $merchantReference): array
    {
        $endpoint = self::requireEnv(
            $provider === 'jazzcash' ? 'JAZZCASH_STATUS_URL' : 'EASYPAISA_STATUS_URL'
        );
        $secret = self::requireEnv(
            $provider === 'jazzcash' ? 'JAZZCASH_INTEGRITY_SALT' : 'EASYPAISA_SECRET'
        );

        $requestPayload = ['merchantReference' => $merchantReference, 'provider' => $provider];
        $signature = self::hmacSha256(json_encode($requestPayload), $secret);

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'X-Signature' => $signature,
            ])->timeout(15)->post($endpoint, $requestPayload);

            $raw = $response->json() ?? [];

            if (!$response->ok()) {
                return ['status' => 'pending', 'raw' => $raw];
            }

            $normalized = strtolower((string) ($raw['status'] ?? ''));
            if (in_array($normalized, ['paid', 'success', 'completed'])) {
                return ['status' => 'paid', 'raw' => $raw];
            }
            if (in_array($normalized, ['failed', 'rejected', 'cancelled'])) {
                return ['status' => 'failed', 'raw' => $raw];
            }

            return ['status' => 'pending', 'raw' => $raw];
        } catch (\Throwable $e) {
            return ['status' => 'pending', 'raw' => ['error' => $e->getMessage()]];
        }
    }

    public static function verifyCallbackSignature(string $provider, string $body, ?string $signatureHeader, ?string $timestampHeader = null): bool
    {
        if (!$signatureHeader) return false;

        $secret = $provider === 'jazzcash'
            ? env('JAZZCASH_INTEGRITY_SALT')
            : env('EASYPAISA_SECRET');

        if (!$secret) return false;

        $normalizedSig = trim($signatureHeader);
        $expectedRaw = self::hmacSha256($body, $secret);

        if (hash_equals($expectedRaw, $normalizedSig)) {
            return true;
        }

        if ($timestampHeader) {
            $expectedTimestamped = self::hmacSha256($timestampHeader . '.' . $body, $secret);
            if (hash_equals($expectedTimestamped, $normalizedSig)) {
                return true;
            }
        }

        return false;
    }

    public static function isWebhookTimestampFresh(?string $timestampHeader, int $maxAgeMs = 900000): bool
    {
        if (!$timestampHeader) return true;

        $raw = trim($timestampHeader);
        $timestampMs = is_numeric($raw) ? (float) $raw : null;

        if ($timestampMs === null) {
            $parsed = strtotime($raw);
            if ($parsed === false) return false;
            $timestampMs = $parsed * 1000;
        } elseif ($timestampMs < 1_000_000_000_000) {
            $timestampMs *= 1000;
        }

        if (!is_finite($timestampMs)) return false;

        $nowMs = round(microtime(true) * 1000);
        $futureToleranceMs = 5 * 60 * 1000;

        return $timestampMs <= $nowMs + $futureToleranceMs && $nowMs - $timestampMs <= $maxAgeMs;
    }

    public static function extractStatus(array $raw): string
    {
        $value = strtolower((string) ($raw['status'] ?? $raw['paymentStatus'] ?? ''));
        if (in_array($value, ['paid', 'success', 'completed'])) return 'paid';
        if (in_array($value, ['failed', 'rejected', 'cancelled'])) return 'failed';
        return 'pending';
    }

    public static function hmacSha256(string $data, string $secret): string
    {
        return hash_hmac('sha256', $data, $secret);
    }

    private static function requireEnv(string $name): string
    {
        $value = env($name);
        if (!$value) {
            throw new \RuntimeException("{$name} is not configured");
        }
        return $value;
    }
}
