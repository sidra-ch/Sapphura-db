<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DatabaseConnectivityTest extends TestCase
{
    public function test_database_connection_is_available(): void
    {
        $result = DB::select('select 1 as health_check');

        $this->assertSame(1, $result[0]->health_check);
    }
}
