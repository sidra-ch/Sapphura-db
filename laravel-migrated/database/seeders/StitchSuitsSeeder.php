<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StitchSuitsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create "Stitch Suits" category if not exists
        $category = Category::firstOrCreate(
            ['name' => 'Stitch Suits'],
            [
                'slug'  => 'stitch-suits',
                'image' => '/stitch suit/img-1.jpeg',
            ]
        );

        // 2. Suit designs data — img-1 to img-11
        $suits = [
            ['num' => 1,  'name' => 'Embroidered Lawn Suit',         'price' => 3200, 'sale' => 2800],
            ['num' => 2,  'name' => 'Chiffon Printed Suit',           'price' => 3500, 'sale' => 2999],
            ['num' => 3,  'name' => 'Classic Khaddar Suit',           'price' => 2800, 'sale' => 2400],
            ['num' => 4,  'name' => 'Digital Print Suit',             'price' => 3100, 'sale' => null],
            ['num' => 5,  'name' => 'Floral Embroidery Suit',         'price' => 3800, 'sale' => 3200],
            ['num' => 6,  'name' => 'Party Wear Net Suit',            'price' => 4500, 'sale' => 3999],
            ['num' => 7,  'name' => 'Casual Cotton Suit',             'price' => 2500, 'sale' => 2100],
            ['num' => 8,  'name' => 'Premium Silk Suit',              'price' => 5200, 'sale' => 4500],
            ['num' => 9,  'name' => 'Georgette Formal Suit',          'price' => 4200, 'sale' => 3600],
            ['num' => 10, 'name' => 'Eid Special Embroidered Suit',   'price' => 4800, 'sale' => 4200],
            ['num' => 11, 'name' => 'Luxury Bridal Inspired Suit',    'price' => 6500, 'sale' => 5800],
        ];

        foreach ($suits as $suit) {
            $slug = Str::slug($suit['name']) . '-' . $suit['num'];

            // Skip if already exists
            if (Product::where('slug', $slug)->exists()) {
                continue;
            }

            Product::create([
                'public_id'   => (string) Str::uuid(),
                'name'        => $suit['name'],
                'slug'        => $slug,
                'description' => 'Premium quality stitched suit. Available in standard sizes (S, M, L, XL, XXL). See size chart before ordering. Material: high-grade fabric. Includes shirt, trouser, and dupatta.',
                'price'       => $suit['price'],
                'sale_price'  => $suit['sale'],
                'sku'         => 'SS-' . str_pad($suit['num'], 3, '0', STR_PAD_LEFT),
                'stock'       => 20,
                'status'      => 'active',
                'is_featured'  => in_array($suit['num'], [1, 5, 10]),
                'images'      => json_encode(['/stitch suit/img-' . $suit['num'] . '.jpeg']),
                'category_id' => $category->id,
            ]);
        }

        $this->command->info('Stitch Suits seeded: ' . count($suits) . ' products under category ID ' . $category->id);
    }
}
