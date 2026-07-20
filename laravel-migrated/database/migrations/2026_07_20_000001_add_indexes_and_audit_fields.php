<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add useful indexes
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'sku')) return;
            $table->index('sku');
        });

        Schema::table('product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('product_variants', 'sku')) return;
            $table->index('sku');
        });

        // Add audit columns to orders
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'created_by')) {
                $table->foreignId('created_by')->nullable()->after('user_id')
                      ->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('orders', 'updated_by')) {
                $table->foreignId('updated_by')->nullable()->after('created_by')
                      ->constrained('users')->nullOnDelete();
            }
            // ensure commonly queried columns have indexes
            if (!Schema::hasColumn('orders', 'status')) {
                // nothing
            } else {
                $table->index('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'sku')) {
                $table->dropIndex(['sku']);
            }
        });

        Schema::table('product_variants', function (Blueprint $table) {
            if (Schema::hasColumn('product_variants', 'sku')) {
                $table->dropIndex(['sku']);
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'updated_by')) {
                $table->dropForeign(['updated_by']);
                $table->dropColumn('updated_by');
            }
            if (Schema::hasColumn('orders', 'created_by')) {
                $table->dropForeign(['created_by']);
                $table->dropColumn('created_by');
            }
            if (Schema::hasColumn('orders', 'status')) {
                $table->dropIndex(['status']);
            }
        });
    }
};
