<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;

trait CreatesApplication
{
    public function createApplication()
    {
        putenv('APP_ENV=testing');
        putenv('APP_DEBUG=true');
        putenv('DB_CONNECTION=sqlite');
        putenv('DB_DATABASE=:memory:');
        putenv('DB_URL=');
        putenv('CACHE_STORE=array');
        putenv('QUEUE_CONNECTION=sync');
        putenv('SESSION_DRIVER=array');
        putenv('MAIL_MAILER=array');

        $_ENV['APP_ENV'] = 'testing';
        $_ENV['APP_DEBUG'] = 'true';
        $_ENV['DB_CONNECTION'] = 'sqlite';
        $_ENV['DB_DATABASE'] = ':memory:';
        $_ENV['DB_URL'] = '';
        $_ENV['CACHE_STORE'] = 'array';
        $_ENV['QUEUE_CONNECTION'] = 'sync';
        $_ENV['SESSION_DRIVER'] = 'array';
        $_ENV['MAIL_MAILER'] = 'array';

        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        return $app;
    }
}
