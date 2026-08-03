<?php

namespace Tests\Feature;

use Illuminate\Http\Request;
use Tests\TestCase;

class SmokeRoutesTest extends TestCase
{
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
            $request = Request::create($route, 'GET');
            $matchedRoute = app('router')->getRoutes()->match($request);

            $this->assertNotNull($matchedRoute, "Route {$route} is not registered");
        }
    }
}
