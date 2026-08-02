<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SmokeRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_public_routes_are_reachable(): void
    {
        $routes = [
            '/',
            '/collections',
            '/search',
            '/cart',
            '/checkout',
            '/wishlist',
            '/about',
            '/contact',
            '/track-order',
            '/faq',
            '/sign-in',
            '/sign-up',
            '/forgot-password',
            '/admin/login',
        ];

        foreach ($routes as $route) {
            $response = $this->get($route);
            $this->assertTrue(
                $response->status() < 400,
                "Route {$route} returned unexpected status {$response->status()}"
            );
        }
    }
}
