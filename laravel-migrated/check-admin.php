<?php
chdir(__DIR__);
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$u = App\Models\User::where('email', 'admin@sapphura.com')->first();
if ($u) {
    echo "Found: {$u->email}\n";
    echo "Role: {$u->role}\n";
    echo "Name: {$u->name}\n";
    echo "Pass 'admin@123' matches: " . (Illuminate\Support\Facades\Hash::check('admin@123', $u->password) ? 'YES' : 'NO') . "\n";
} else {
    echo "User NOT FOUND in database\n";
    echo "\nAll users:\n";
    foreach (App\Models\User::all() as $user) {
        echo "  - {$user->email} (role: {$user->role})\n";
    }
}
