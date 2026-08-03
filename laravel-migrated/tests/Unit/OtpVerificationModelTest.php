<?php

namespace Tests\Unit;

use App\Models\OtpVerification;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class OtpVerificationModelTest extends TestCase
{
    public function test_it_can_read_and_write_the_otp_hash_from_a_legacy_otp_code_column(): void
    {
        Schema::shouldReceive('hasColumn')
            ->with('otp_verifications', 'otp_hash')
            ->andReturn(false);
        Schema::shouldReceive('hasColumn')
            ->with('otp_verifications', 'otp_code')
            ->andReturn(true);

        $model = new OtpVerification();
        $model->setAttribute('otp_hash', 'hashed-value');

        $this->assertSame('hashed-value', $model->getAttribute('otp_hash'));
        $this->assertSame('hashed-value', $model->getAttribute('otp_code'));
    }
}
