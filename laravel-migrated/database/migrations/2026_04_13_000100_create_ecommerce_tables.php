<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('public_id')->nullable()->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->double('price');
            $table->double('sale_price')->nullable();
            $table->string('sku')->nullable();
            $table->integer('stock')->default(0);
            $table->string('status')->default('active');
            $table->boolean('is_featured')->default(false);
            $table->longText('images')->default('[]');
            $table->foreignId('category_id')->constrained('categories');
            $table->timestamps();
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->string('material')->nullable();
            $table->string('sku')->nullable();
            $table->integer('stock')->default(0);
            $table->double('price');
            $table->string('image')->nullable();
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
        });

        Schema::create('product_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('tag_id')->constrained('tags');
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('public_id')->nullable()->unique();
            $table->foreignId('user_id')->constrained('users');
            $table->double('total');
            $table->double('discount')->default(0);
            $table->double('shipping_cost')->default(0);
            $table->string('status')->default('pending');
            $table->string('shipping_name')->nullable();
            $table->string('shipping_phone')->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('provider');
            $table->string('merchant_reference')->unique();
            $table->string('provider_transaction_id')->nullable();
            $table->double('amount');
            $table->string('currency')->default('PKR');
            $table->string('status')->default('initiated');
            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();
            $table->json('callback_payload')->nullable();
            $table->boolean('signature_valid')->nullable();
            $table->timestamp('reconciled_at')->nullable();
            $table->timestamps();
            $table->index(['provider', 'status']);
            $table->index('created_at');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity')->default(1);
            $table->double('price');
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('password_resets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('token_hash');
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index('expires_at');
        });

        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('otp_hash');
            $table->string('purpose');
            $table->timestamp('expires_at');
            $table->integer('attempts')->default(0);
            $table->timestamp('consumed_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['user_id', 'purpose']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_verifications');
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('payment_transactions');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('product_tags');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
