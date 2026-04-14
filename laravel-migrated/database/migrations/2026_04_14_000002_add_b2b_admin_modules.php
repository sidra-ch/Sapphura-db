<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ─── 1. RBAC ───
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();       // super_admin, manager, inventory_staff, sales_staff, finance_staff
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();        // manage_products, manage_orders, etc.
            $table->string('display_name');
            $table->string('group')->nullable();      // products, orders, inventory, etc.
            $table->timestamps();
        });

        Schema::create('role_permission', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->primary(['role_id', 'permission_id']);
        });

        // Add role_id to users table (nullable – existing users keep working)
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('role')->constrained('roles')->nullOnDelete();
        });

        // ─── 2. Enhanced Products ───
        Schema::table('products', function (Blueprint $table) {
            $table->string('barcode')->nullable()->after('sku');
            $table->double('cost_price')->nullable()->after('sale_price');
            $table->double('wholesale_price')->nullable()->after('cost_price');
            $table->double('tax_percentage')->nullable()->default(0)->after('wholesale_price');
            $table->integer('min_order_qty')->default(1)->after('tax_percentage');
            $table->string('brand')->nullable()->after('category_id');
            $table->softDeletes();
        });

        // ─── 3. Enhanced Categories ───
        Schema::table('categories', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
            $table->text('description')->nullable()->after('slug');
            $table->string('image')->nullable()->after('description');
            $table->boolean('is_active')->default(true)->after('image');
            $table->integer('sort_order')->default(0)->after('is_active');
            $table->timestamps();
        });

        // Subcategories
        Schema::create('subcategories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Add subcategory FK to products
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('subcategory_id')->nullable()->after('category_id')
                  ->constrained('subcategories')->nullOnDelete();
        });

        // ─── 4. B2B Companies ───
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('company_email')->unique();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->default('Pakistan');
            $table->string('ntn')->nullable();             // National Tax Number
            $table->string('strn')->nullable();             // Sales Tax Registration Number
            $table->string('contact_person_name')->nullable();
            $table->string('contact_person_phone')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'blocked'])->default('pending');
            $table->double('credit_limit')->default(0);
            $table->string('payment_terms')->nullable();    // Net-7, Net-15, Net-30
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Link users to companies
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->after('role_id')
                  ->constrained('companies')->nullOnDelete();
        });

        // ─── 5. Inventory Logs ───
        Schema::create('inventory_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('action');                       // stock_in, stock_out, adjustment
            $table->integer('quantity_before');
            $table->integer('quantity_after');
            $table->integer('quantity_changed');
            $table->string('reason')->nullable();           // manual, order, purchase, return
            $table->foreignId('admin_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
        });

        // ─── 6. Suppliers & Purchase Orders ───
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->default('Pakistan');
            $table->string('contact_person')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->foreignId('supplier_id')->constrained('suppliers')->cascadeOnDelete();
            $table->enum('status', ['draft', 'ordered', 'partial', 'received', 'cancelled'])->default('draft');
            $table->double('total_amount')->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('expected_date')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamps();
        });

        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity_ordered');
            $table->integer('quantity_received')->default(0);
            $table->double('unit_cost');
            $table->double('total_cost');
        });

        // ─── 7. Activity Logs ───
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action');                       // created, updated, deleted, status_change
            $table->string('module');                       // products, orders, companies, etc.
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->json('properties')->nullable();         // before/after data
            $table->timestamp('created_at')->useCurrent();
        });

        // ─── 8. Admin Notifications ───
        Schema::create('admin_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type');                         // new_order, low_stock, company_registration, etc.
            $table->string('title');
            $table->text('message');
            $table->string('link')->nullable();             // URL to navigate to
            $table->boolean('is_read')->default(false);
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // target admin
            $table->timestamps();
        });

        // ─── 9. Settings (key-value store) ───
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');    // general, shipping, payment, tax, email
            $table->string('type')->default('text');        // text, number, boolean, json, image
            $table->timestamps();
        });

        // ─── 10. Enhanced Orders – add billing fields ───
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->after('user_id')
                  ->constrained('companies')->nullOnDelete();
            $table->string('order_number')->nullable()->unique()->after('public_id');
            $table->double('tax')->default(0)->after('discount');
            $table->double('subtotal')->default(0)->after('total');
            $table->text('billing_address')->nullable()->after('shipping_country');
            $table->string('billing_city')->nullable()->after('billing_address');
            $table->text('cancel_reason')->nullable()->after('admin_notes');
            $table->timestamp('refunded_at')->nullable()->after('cancel_reason');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn(['company_id', 'order_number', 'tax', 'subtotal', 'billing_address', 'billing_city', 'cancel_reason', 'refunded_at']);
        });
        Schema::dropIfExists('settings');
        Schema::dropIfExists('admin_notifications');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('inventory_logs');
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn('company_id');
        });
        Schema::dropIfExists('companies');
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['subcategory_id']);
            $table->dropColumn(['subcategory_id', 'barcode', 'cost_price', 'wholesale_price', 'tax_percentage', 'min_order_qty', 'brand']);
            $table->dropSoftDeletes();
        });
        Schema::dropIfExists('subcategories');
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['slug', 'description', 'image', 'is_active', 'sort_order']);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
