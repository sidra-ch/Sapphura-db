<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'business_name', 'value' => 'Sapphura', 'group' => 'general', 'type' => 'text'],
            ['key' => 'business_email', 'value' => 'ms.sidrachaudhary@gmail.com', 'group' => 'general', 'type' => 'text'],
            ['key' => 'business_phone', 'value' => '+923001234567', 'group' => 'general', 'type' => 'text'],
            ['key' => 'currency', 'value' => 'PKR', 'group' => 'general', 'type' => 'text'],
            ['key' => 'currency_symbol', 'value' => 'Rs.', 'group' => 'general', 'type' => 'text'],
            ['key' => 'country', 'value' => 'Pakistan', 'group' => 'general', 'type' => 'text'],
            ['key' => 'logo_url', 'value' => '', 'group' => 'general', 'type' => 'image'],

            // Shipping
            ['key' => 'shipping_karachi', 'value' => '200', 'group' => 'shipping', 'type' => 'number'],
            ['key' => 'shipping_major_cities', 'value' => '250', 'group' => 'shipping', 'type' => 'number'],
            ['key' => 'shipping_other', 'value' => '300', 'group' => 'shipping', 'type' => 'number'],
            ['key' => 'free_shipping_threshold', 'value' => '5000', 'group' => 'shipping', 'type' => 'number'],

            // Tax
            ['key' => 'default_tax_percentage', 'value' => '0', 'group' => 'tax', 'type' => 'number'],
            ['key' => 'tax_enabled', 'value' => '0', 'group' => 'tax', 'type' => 'boolean'],

            // Orders
            ['key' => 'min_order_amount', 'value' => '0', 'group' => 'orders', 'type' => 'number'],
            ['key' => 'low_stock_threshold', 'value' => '5', 'group' => 'inventory', 'type' => 'number'],

            // Payment
            ['key' => 'cod_enabled', 'value' => '1', 'group' => 'payment', 'type' => 'boolean'],
            ['key' => 'bank_transfer_enabled', 'value' => '1', 'group' => 'payment', 'type' => 'boolean'],
            ['key' => 'stripe_enabled', 'value' => '0', 'group' => 'payment', 'type' => 'boolean'],
            ['key' => 'jazzcash_enabled', 'value' => '0', 'group' => 'payment', 'type' => 'boolean'],
            ['key' => 'easypaisa_enabled', 'value' => '0', 'group' => 'payment', 'type' => 'boolean'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
