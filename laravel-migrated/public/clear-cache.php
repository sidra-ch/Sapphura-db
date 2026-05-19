<?php
// TEMPORARY FILE - DELETE AFTER USE
define('LARAVEL_START', microtime(true));
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$results = [];
$kernel->call('view:clear');   $results[] = "view:clear ✓";
$kernel->call('cache:clear');  $results[] = "cache:clear ✓";
$kernel->call('config:clear'); $results[] = "config:clear ✓";
$kernel->call('route:clear');  $results[] = "route:clear ✓";

echo "<pre>Done!\n" . implode("\n", $results) . "\n\nDELETE THIS FILE NOW!</pre>";
