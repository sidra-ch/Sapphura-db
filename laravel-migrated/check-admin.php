<?php
chdir(__DIR__);
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$u = App\Models\User::where('email', 'sapphura@gmail.com')->first();
if ($u) {
    echo "Found: {$u->email}\n";
    echo "Role: {$u->role}\n";
    echo "Name: {$u->name}\n";
    echo "Pass '123456' matches: " . (Illuminate\Support\Facades\Hash::check('123456', $u->password) ? 'YES' : 'NO') . "\n";
} else {
    echo "User NOT FOUND in database\n";
    echo "\nAll users:\n";
    foreach (App\Models\User::all() as $user) {
        echo "  - {$user->email} (role: {$user->role})\n";
    }
}
