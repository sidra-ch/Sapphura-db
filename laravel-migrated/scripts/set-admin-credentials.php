<?php

chdir(dirname(__DIR__));
require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';
$app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();

$admin = new App\Models\User();
$email = env('ADMIN_DEFAULT_EMAIL', 'sapphura@gmail.com');
$password = env('ADMIN_DEFAULT_PASSWORD');
$name = env('ADMIN_DEFAULT_NAME', 'Admin User');
$phone = env('ADMIN_DEFAULT_PHONE', '+923001234567');

if (!is_string($email) || trim($email) === '') {
    fwrite(STDERR, "ADMIN_DEFAULT_EMAIL is missing\n");
    exit(1);
}

if (!is_string($password) || trim($password) === '') {
    fwrite(STDERR, "ADMIN_DEFAULT_PASSWORD is missing\n");
    exit(1);
}

$passwordHash = Illuminate\Support\Facades\Hash::make($password);

$existing = App\Models\User::query()
    ->where('role', '=', 'admin')
    ->orWhere('email', '=', $email)
    ->first();

if ($existing) {
    $existing->forceFill([
        'public_id' => $existing->public_id ?: (string) Illuminate\Support\Str::uuid(),
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'password' => $passwordHash,
        'role' => 'admin',
        'is_active' => true,
    ]);
    $existing->save();

    echo "ADMIN_UPDATED: {$email}\n";
    exit(0);
}

$admin->forceFill([
    'public_id' => (string) Illuminate\Support\Str::uuid(),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'password' => $passwordHash,
    'role' => 'admin',
    'is_active' => true,
])->save();

echo "ADMIN_CREATED: {$email}\n";
