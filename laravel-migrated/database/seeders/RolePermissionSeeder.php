<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // ── Permissions ──
        $permissions = [
            ['name' => 'manage_products', 'display_name' => 'Manage Products', 'group' => 'products'],
            ['name' => 'manage_categories', 'display_name' => 'Manage Categories', 'group' => 'products'],
            ['name' => 'manage_inventory', 'display_name' => 'Manage Inventory', 'group' => 'inventory'],
            ['name' => 'manage_orders', 'display_name' => 'Manage Orders', 'group' => 'orders'],
            ['name' => 'manage_customers', 'display_name' => 'Manage Customers', 'group' => 'customers'],
            ['name' => 'manage_companies', 'display_name' => 'Manage Companies', 'group' => 'companies'],
            ['name' => 'manage_payments', 'display_name' => 'Manage Payments', 'group' => 'payments'],
            ['name' => 'manage_coupons', 'display_name' => 'Manage Coupons', 'group' => 'marketing'],
            ['name' => 'manage_reviews', 'display_name' => 'Manage Reviews', 'group' => 'content'],
            ['name' => 'manage_suppliers', 'display_name' => 'Manage Suppliers', 'group' => 'inventory'],
            ['name' => 'manage_purchase_orders', 'display_name' => 'Manage Purchase Orders', 'group' => 'inventory'],
            ['name' => 'view_reports', 'display_name' => 'View Reports', 'group' => 'reports'],
            ['name' => 'manage_settings', 'display_name' => 'Manage Settings', 'group' => 'settings'],
            ['name' => 'manage_admin_users', 'display_name' => 'Manage Admin Users', 'group' => 'admin'],
            ['name' => 'view_activity_logs', 'display_name' => 'View Activity Logs', 'group' => 'admin'],
            ['name' => 'view_dashboard', 'display_name' => 'View Dashboard', 'group' => 'dashboard'],
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(['name' => $perm['name']], $perm);
        }

        // ── Roles ──
        $superAdmin = Role::updateOrCreate(
            ['name' => 'super_admin'],
            ['display_name' => 'Super Admin', 'description' => 'Full access to everything']
        );

        $manager = Role::updateOrCreate(
            ['name' => 'manager'],
            ['display_name' => 'Manager', 'description' => 'Can manage most operations except admin users and settings']
        );

        $inventoryStaff = Role::updateOrCreate(
            ['name' => 'inventory_staff'],
            ['display_name' => 'Inventory Staff', 'description' => 'Manages products, inventory, and suppliers']
        );

        $salesStaff = Role::updateOrCreate(
            ['name' => 'sales_staff'],
            ['display_name' => 'Sales Staff', 'description' => 'Manages orders, customers, and companies']
        );

        $financeStaff = Role::updateOrCreate(
            ['name' => 'finance_staff'],
            ['display_name' => 'Finance Staff', 'description' => 'Manages payments, reports, and invoices']
        );

        // ── Assign permissions to roles ──
        $allPermissions = Permission::pluck('id')->toArray();
        $superAdmin->permissions()->sync($allPermissions);

        $manager->permissions()->sync(
            Permission::whereNotIn('name', ['manage_admin_users', 'manage_settings'])->pluck('id')->toArray()
        );

        $inventoryStaff->permissions()->sync(
            Permission::whereIn('name', [
                'view_dashboard', 'manage_products', 'manage_categories',
                'manage_inventory', 'manage_suppliers', 'manage_purchase_orders',
            ])->pluck('id')->toArray()
        );

        $salesStaff->permissions()->sync(
            Permission::whereIn('name', [
                'view_dashboard', 'manage_orders', 'manage_customers',
                'manage_companies', 'manage_coupons', 'manage_reviews',
            ])->pluck('id')->toArray()
        );

        $financeStaff->permissions()->sync(
            Permission::whereIn('name', [
                'view_dashboard', 'manage_payments', 'view_reports', 'manage_orders',
            ])->pluck('id')->toArray()
        );

        // ── Assign super_admin role to existing admin user ──
        $adminUser = \App\Models\User::where('role', 'admin')->first();
        if ($adminUser) {
            $adminUser->update(['role_id' => $superAdmin->id]);
        }
    }
}
