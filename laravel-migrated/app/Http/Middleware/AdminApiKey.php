<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminApiKey
{
    /**
     * Admin routes are protected via a shared API key header.
     * Send `Authorization: Bearer <ADMIN_API_KEY>` on every admin request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $configuredKey = env('ADMIN_API_KEY');
        $allowedIps = array_values(array_filter(array_map('trim', explode(',', (string) env('ADMIN_API_ALLOWED_IPS', '')))));

        if (!$configuredKey) {
            return response()->json(['error' => 'ADMIN_API_KEY is not configured on server'], 500);
        }

        if (!empty($allowedIps) && !in_array((string) $request->ip(), $allowedIps, true)) {
            return response()->json(['error' => 'Forbidden – IP address not allowed'], 403);
        }

        $header = $request->header('Authorization', '');
        $token = '';

        if (str_starts_with($header, 'Bearer ')) {
            $token = substr($header, 7);
        }

        if (!$token || !hash_equals($configuredKey, $token)) {
            return response()->json(['error' => 'Unauthorized – valid admin API key required'], 401);
        }

        return $next($request);
    }
}
