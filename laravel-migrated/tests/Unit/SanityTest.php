<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SanityTest extends TestCase
{
    #[Test]
    public function framework_test_harness_is_working(): void
    {
        $this->assertTrue(true);
    }
}
