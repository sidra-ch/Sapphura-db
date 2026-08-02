<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyHeaderSecret
{
    public function handle(Request $request, Closure $next, string $envKey, string $headerName): Response
    {
        $candidateKeys = array_values(array_filter(array_map('trim', explode('|', $envKey))));
        $configuredSecrets = [];

        foreach ($candidateKeys as $candidateKey) {
            $candidateValue = env($candidateKey);
            if (is_string($candidateValue) && trim($candidateValue) !== '') {
                $configuredSecrets[] = $candidateValue;
            }
        }

        if (empty($configuredSecrets)) {
            return response()->json(['error' => $envKey . ' is not configured on server'], 500);
        }

        $providedSecret = trim((string) $request->header($headerName, ''));
        $authorized = false;
        foreach ($configuredSecrets as $configuredSecret) {
            if ($providedSecret !== '' && hash_equals($configuredSecret, $providedSecret)) {
                $authorized = true;
                break;
            }
        }

        if (!$authorized) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
