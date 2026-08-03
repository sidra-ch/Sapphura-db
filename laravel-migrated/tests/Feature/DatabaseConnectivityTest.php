<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DatabaseConnectivityTest extends TestCase
{
    public function test_database_connection_is_available(): void
    {
        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
        ]);

        DB::purge('sqlite');
        $connection = DB::connection('sqlite');
        $connection->getPdo();

        $result = $connection->select('select 1 as health_check');

        $this->assertSame(1, $result[0]->health_check);
    }
}
