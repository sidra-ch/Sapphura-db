<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Orders: speed up user order history queries
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (Schema::hasColumn('orders', 'user_id') && Schema::hasColumn('orders', 'created_at')) {
                    $table->index(['user_id', 'created_at'], 'orders_user_created_idx');
                }
            });
        }

        // Product variants: quick lookup by product + attributes
        if (Schema::hasTable('product_variants')) {
            Schema::table('product_variants', function (Blueprint $table) {
                if (Schema::hasColumn('product_variants', 'product_id')) {
                    $table->index(['product_id', 'size', 'color'], 'pv_product_size_color_idx');
                }
            });
        }

        // Order items: common lookup by product
        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                if (Schema::hasColumn('order_items', 'product_id')) {
                    $table->index('product_id', 'order_items_product_idx');
                }
            });
        }

        // Purchase order items: lookup by PO and product
        if (Schema::hasTable('purchase_order_items')) {
            Schema::table('purchase_order_items', function (Blueprint $table) {
                if (Schema::hasColumn('purchase_order_items', 'purchase_order_id') && Schema::hasColumn('purchase_order_items', 'product_id')) {
                    $table->index(['purchase_order_id', 'product_id'], 'poi_po_product_idx');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropIndex('orders_user_created_idx');
            });
        }

        if (Schema::hasTable('product_variants')) {
            Schema::table('product_variants', function (Blueprint $table) {
                $table->dropIndex('pv_product_size_color_idx');
            });
        }

        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                $table->dropIndex('order_items_product_idx');
            });
        }

        if (Schema::hasTable('purchase_order_items')) {
            Schema::table('purchase_order_items', function (Blueprint $table) {
                $table->dropIndex('poi_po_product_idx');
            });
        }
    }
};
