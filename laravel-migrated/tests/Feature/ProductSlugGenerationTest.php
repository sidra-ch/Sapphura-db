<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProductSlugGenerationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
        ]);

        DB::purge('sqlite');
        Artisan::call('migrate:fresh', ['--database' => 'sqlite', '--force' => true]);
    }

    public function test_it_generates_unique_slugs_for_duplicate_product_names(): void
    {
        $category = Category::query()->create([
            'name' => 'Bridals',
            'slug' => 'bridals',
        ]);

        $first = Product::query()->create([
            'public_id' => (string) Str::uuid(),
            'name' => 'Ivory Silk Suit',
            'slug' => Product::generateUniqueSlug('Ivory Silk Suit'),
            'description' => 'First product',
            'price' => 1000,
            'stock' => 1,
            'status' => 'active',
            'images' => '[]',
            'category_id' => $category->id,
        ]);

        $second = Product::query()->create([
            'public_id' => (string) Str::uuid(),
            'name' => 'Ivory Silk Suit',
            'slug' => Product::generateUniqueSlug('Ivory Silk Suit'),
            'description' => 'Second product',
            'price' => 1200,
            'stock' => 1,
            'status' => 'active',
            'images' => '[]',
            'category_id' => $category->id,
        ]);

        $this->assertSame('ivory-silk-suit', $first->slug);
        $this->assertSame('ivory-silk-suit-2', $second->slug);
    }
}