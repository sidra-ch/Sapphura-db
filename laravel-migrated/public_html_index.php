<?php

/**
 * Sapphura – cPanel public_html bridge
 *
 * Place this file as /home/YOUR_CPANEL_USER/public_html/index.php
 * Upload laravel-migrated/ folder to /home/YOUR_CPANEL_USER/laravel-migrated/
 */

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../laravel-migrated/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../laravel-migrated/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../laravel-migrated/bootstrap/app.php';

$app->handleRequest(Request::capture());
