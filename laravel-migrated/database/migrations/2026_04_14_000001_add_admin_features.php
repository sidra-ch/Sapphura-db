<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add tracking & extra shipping fields to orders
        Schema::table('orders', function (Blueprint $table) {
            $table->string('tracking_number')->nullable()->after('shipping_address');
            $table->string('tracking_carrier')->nullable()->after('tracking_number');
            $table->string('shipping_city')->nullable()->after('shipping_address');
            $table->string('shipping_postal_code')->nullable()->after('shipping_city');
            $table->string('shipping_country')->default('Pakistan')->after('shipping_postal_code');
            $table->text('admin_notes')->nullable()->after('notes');
        });

        // Order status history
        Schema::create('order_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('note')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // Coupons
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('description')->nullable();
            $table->enum('type', ['fixed', 'percentage'])->default('fixed');
            $table->double('value');
            $table->double('min_order')->default(0);
            $table->integer('max_uses')->nullable();
            $table->integer('used_count')->default(0);
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Add discount_code to orders
        Schema::table('orders', function (Blueprint $table) {
            $table->string('discount_code')->nullable()->after('discount');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['tracking_number', 'tracking_carrier', 'shipping_city', 'shipping_postal_code', 'shipping_country', 'admin_notes', 'discount_code']);
        });
        Schema::dropIfExists('order_status_history');
        Schema::dropIfExists('coupons');
    }
};
