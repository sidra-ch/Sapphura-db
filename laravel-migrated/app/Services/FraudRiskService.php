<?php

namespace App\Services;

use App\Models\Order;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\Http;

class FraudRiskService
{
    public static function evaluate(array $input): array
    {
        $score = 0;
        $flags = [];

        if (empty($input['otpVerifiedAt'])) {
            $score += 30;
            $flags[] = 'missing_otp_proof';
        }

        if (($input['paymentMethod'] ?? '') === 'card' && empty($input['cardAuthorizedAt'])) {
            $score += 40;
            $flags[] = 'missing_card_authorization';
        }

        if (($input['total'] ?? 0) >= 1000) {
            $score += 20;
            $flags[] = 'high_order_value';
        }

        if (($input['itemCount'] ?? 0) >= 8) {
            $score += 10;
            $flags[] = 'large_basket_size';
        }

        if (preg_match('/(mailinator|10minutemail|tempmail|guerrillamail)\./i', $input['email'] ?? '')) {
            $score += 20;
            $flags[] = 'disposable_email_domain';
        }

        $oneHourAgo = now()->subHour();
        $recentOrderCount = Order::whereHas('user', function ($q) use ($input) {
            $q->where('email', $input['email'] ?? '');
        })->where('created_at', '>=', $oneHourAgo)->count();

        if ($recentOrderCount >= 4) {
            $score += 25;
            $flags[] = 'high_order_velocity_email';
        }

        try {
            $recentFailedPayments = PaymentTransaction::where('status', 'failed')
                ->where('created_at', '>=', $oneHourAgo)
                ->count();

            if ($recentFailedPayments >= 5) {
                $score += 10;
                $flags[] = 'elevated_global_payment_failures';
            }
        } catch (\Throwable $e) {
            // Table may not exist yet
        }

        $externalScore = self::fetchExternalRiskSignal($input);
        $externalProviderUsed = $externalScore !== null;

        if ($externalScore !== null) {
            $score = (int) round($score * 0.7 + $externalScore * 0.3);
            if ($externalScore >= 70) {
                $flags[] = 'external_provider_high_risk';
            }
        }

        $score = max(0, min(100, $score));
        $level = self::classify($score);

        return [
            'score' => $score,
            'level' => $level,
            'flags' => $flags,
            'externalProviderUsed' => $externalProviderUsed,
        ];
    }

    private static function classify(int $score): string
    {
        if ($score >= 70) return 'high';
        if ($score >= 35) return 'medium';
        return 'low';
    }

    private static function fetchExternalRiskSignal(array $input): ?int
    {
        $endpoint = config('services.fraud.endpoint', env('FRAUD_PROVIDER_ENDPOINT'));
        if (!$endpoint) return null;

        try {
            $headers = ['Content-Type' => 'application/json'];
            $apiKey = config('services.fraud.api_key', env('FRAUD_PROVIDER_API_KEY'));
            if ($apiKey) {
                $headers['Authorization'] = 'Bearer ' . $apiKey;
            }

            $response = Http::withHeaders($headers)->timeout(5)->post($endpoint, [
                'email' => $input['email'] ?? '',
                'phone' => $input['phone'] ?? '',
                'ip' => $input['ip'] ?? '',
                'paymentMethod' => $input['paymentMethod'] ?? '',
                'amount' => $input['total'] ?? 0,
                'itemCount' => $input['itemCount'] ?? 0,
            ]);

            if (!$response->ok()) return null;

            $riskScore = (int) ($response->json('riskScore') ?? -1);
            if ($riskScore < 0) return null;

            return max(0, min(100, $riskScore));
        } catch (\Throwable $e) {
            return null;
        }
    }
}
