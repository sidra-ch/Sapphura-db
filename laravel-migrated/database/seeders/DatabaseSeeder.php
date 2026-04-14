<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin user
        User::updateOrCreate(
            ['email' => env('ADMIN_DEFAULT_EMAIL', 'Sapphura@gmail.com')],
            [
                'public_id' => (string) Str::uuid(),
                'password' => Hash::make(env('ADMIN_DEFAULT_PASSWORD', '123456')),
                'name' => env('ADMIN_DEFAULT_NAME', 'Admin User'),
                'phone' => env('ADMIN_DEFAULT_PHONE', '+923001234567'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // 2. Roles & Permissions
        $this->call(RolePermissionSeeder::class);

        // 3. Settings
        $this->call(SettingsSeeder::class);

        // 4. Categories
        $categoryNames = ['Jewelry', 'Abaya', 'Accessories', 'Clothing', 'Makeup'];
        $categories = [];
        foreach ($categoryNames as $name) {
            $categories[$name] = Category::firstOrCreate(['name' => $name]);
        }

        // 3. Products
        $products = [
            // Jewelry
            ['name' => 'Gold Crescent Necklace', 'slug' => 'gold-crescent-necklace', 'description' => 'Luxury gold necklace for Ramadan. Handcrafted with premium materials for a truly elegant look.', 'price' => 2999, 'sale_price' => 2499, 'images' => '["/neckles-1.jpeg","/neckles-2.jpeg","/neckles-3.jpeg"]', 'stock' => 50, 'is_featured' => true, 'category' => 'Jewelry'],
            ['name' => 'Kashmiri Bangles Set', 'slug' => 'kashmiri-bangals', 'description' => 'Authentic Kashmiri bangles with intricate hand-carved designs. A timeless piece of heritage art.', 'price' => 2490, 'sale_price' => null, 'images' => '["/bangals-1.jpeg","/bangals-2.jpeg","/bangals-3.jpeg","/bangals-4.jpeg"]', 'stock' => 40, 'is_featured' => false, 'category' => 'Jewelry'],
            ['name' => 'Pearl Earrings', 'slug' => 'pearl-earrings', 'description' => 'Elegant freshwater pearl earrings for special occasions. Classic design that complements any outfit.', 'price' => 1490, 'sale_price' => null, 'images' => '["/earing-1.jpeg","/earing-2.jpeg"]', 'stock' => 35, 'is_featured' => true, 'category' => 'Jewelry'],
            ['name' => 'Diamond Stud Earrings', 'slug' => 'diamond-stud-earrings', 'description' => 'Classic diamond stud earrings with brilliant cut stones. Perfect for everyday luxury.', 'price' => 3490, 'sale_price' => 2990, 'images' => '["/earing-3.jpeg","/earing-4.jpeg"]', 'stock' => 20, 'is_featured' => true, 'category' => 'Jewelry'],
            ['name' => 'Bridal Necklace Set', 'slug' => 'bridal-necklace-set', 'description' => 'Stunning bridal necklace with matching earrings. Designed to make your special day unforgettable.', 'price' => 5990, 'sale_price' => 4990, 'images' => '["/neckles-2.jpeg","/neckles-3.jpeg"]', 'stock' => 15, 'is_featured' => true, 'category' => 'Jewelry'],
            ['name' => 'Gold Ring Set', 'slug' => 'gold-ring-set', 'description' => 'Elegant gold ring set with traditional Mughal-inspired design. Stackable rings for versatile styling.', 'price' => 1790, 'sale_price' => null, 'images' => '["/bangals-5.jpeg","/bangals-4.jpeg"]', 'stock' => 30, 'is_featured' => false, 'category' => 'Jewelry'],
            ['name' => 'Emerald Drop Earrings', 'slug' => 'emerald-drop-earrings', 'description' => 'Handcrafted emerald drop earrings with gold accents. A statement piece for evening events.', 'price' => 2990, 'sale_price' => null, 'images' => '["/earing-1.jpeg","/earing-3.jpeg"]', 'stock' => 18, 'is_featured' => false, 'category' => 'Jewelry'],
            ['name' => 'Traditional Bangle Collection', 'slug' => 'traditional-bangle-collection', 'description' => 'A curated set of traditional bangles in vibrant colors. Each piece reflects artisan craftsmanship.', 'price' => 1990, 'sale_price' => 1590, 'images' => '["/bangals-2.jpeg","/bangals-3.jpeg","/bangals-5.jpeg"]', 'stock' => 25, 'is_featured' => false, 'category' => 'Jewelry'],

            // Abaya
            ['name' => 'Navy Velvet Abaya', 'slug' => 'navy-velvet-abaya', 'description' => 'Elegant navy velvet abaya with subtle gold embroidery. Perfect for formal events and special occasions.', 'price' => 4890, 'sale_price' => 3890, 'images' => '["/suit-31.jpeg","/suit-32.jpeg","/suit-33.jpeg"]', 'stock' => 30, 'is_featured' => false, 'category' => 'Abaya'],
            ['name' => 'Silk Abaya Set', 'slug' => 'silk-abaya-set', 'description' => 'Premium silk abaya with matching dupatta. Luxurious fabric that drapes beautifully.', 'price' => 5790, 'sale_price' => null, 'images' => '["/suit-1.jpeg","/suit-2.jpeg","/suit-3.jpeg"]', 'stock' => 20, 'is_featured' => true, 'category' => 'Abaya'],
            ['name' => 'Royal Embroidered Abaya', 'slug' => 'royal-abaya', 'description' => 'Beautiful hand-embroidered abaya for special events. Intricate thread work with pearl accents.', 'price' => 6490, 'sale_price' => 5490, 'images' => '["/suit-5.jpeg","/suit-6.jpeg","/suit-7.jpeg"]', 'stock' => 12, 'is_featured' => true, 'category' => 'Abaya'],
            ['name' => 'Classic Black Abaya', 'slug' => 'classic-black-abaya', 'description' => 'Timeless black abaya with minimalist design. Versatile and elegant for everyday wear.', 'price' => 3490, 'sale_price' => null, 'images' => '["/suit-8.jpeg","/suit-9.jpeg"]', 'stock' => 35, 'is_featured' => false, 'category' => 'Abaya'],
            ['name' => 'Floral Embroidered Abaya', 'slug' => 'floral-embroidered-abaya', 'description' => 'Delicate floral embroidery on premium fabric. A fresh and modern take on traditional abaya design.', 'price' => 4290, 'sale_price' => null, 'images' => '["/suit-10.jpeg","/suit-11.jpeg","/suit-12.jpeg"]', 'stock' => 18, 'is_featured' => false, 'category' => 'Abaya'],
            ['name' => 'Luxury Kaftan Abaya', 'slug' => 'luxury-kaftan-abaya', 'description' => 'Flowing kaftan-style abaya with gold trim. Combines comfort with opulent style.', 'price' => 5290, 'sale_price' => 4590, 'images' => '["/suit-13.jpeg","/suit-14.jpeg"]', 'stock' => 15, 'is_featured' => false, 'category' => 'Abaya'],

            // Clothing
            ['name' => 'Summer Lawn Suit', 'slug' => 'summer-suit', 'description' => 'Light and breezy summer lawn suit with digital print. Perfect for the season.', 'price' => 3990, 'sale_price' => 2990, 'images' => '["/summer-1.jpeg","/summer-2.jpeg","/summer-3.jpeg"]', 'stock' => 40, 'is_featured' => true, 'category' => 'Clothing'],
            ['name' => 'Winter Collection Suit', 'slug' => 'winter-collection', 'description' => 'Warm and stylish winter khaddar suit with embroidery. Premium winter fabric.', 'price' => 4490, 'sale_price' => null, 'images' => '["/winter-collection1.jpeg","/wintercollection-2.jpeg","/wintercollection-3.jpeg"]', 'stock' => 25, 'is_featured' => true, 'category' => 'Clothing'],
            ['name' => 'Kashmiri Shawl', 'slug' => 'kashmiri-shawl', 'description' => 'Authentic Kashmiri pashmina shawl with hand embroidery. Luxuriously warm and elegant.', 'price' => 3990, 'sale_price' => null, 'images' => '["/clothes-collection.jpeg","/clothes collection-3.jpeg"]', 'stock' => 20, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Party Wear Saree', 'slug' => 'party-wear-saree', 'description' => 'Elegant georgette party wear saree with elaborate border work. A showstopper at any event.', 'price' => 4890, 'sale_price' => 3890, 'images' => '["/suit-15.jpeg","/suit-16.jpeg","/suit-17.jpeg"]', 'stock' => 15, 'is_featured' => true, 'category' => 'Clothing'],
            ['name' => 'Designer Lawn Collection', 'slug' => 'designer-lawn', 'description' => 'Premium designer lawn with chiffon dupatta and embroidered trouser. 3-piece unstitched.', 'price' => 5490, 'sale_price' => 4490, 'images' => '["/summer-4.jpeg","/summer-5.jpeg","/summer-6.jpeg"]', 'stock' => 30, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Casual Cotton Suit', 'slug' => 'casual-cotton-suit', 'description' => 'Comfortable cotton suit for daily wear. Simple yet elegant design with printed dupatta.', 'price' => 2490, 'sale_price' => null, 'images' => '["/summer-7.jpeg","/summer-8.jpeg"]', 'stock' => 50, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Festive Formal Suit', 'slug' => 'festive-formal-suit', 'description' => 'Heavily embroidered formal suit for Eid and weddings. Comes with organza dupatta.', 'price' => 7990, 'sale_price' => 6990, 'images' => '["/suit-18.jpeg","/suit-19.jpeg","/suit-20.jpeg"]', 'stock' => 10, 'is_featured' => true, 'category' => 'Clothing'],
            ['name' => 'Printed Cambric Suit', 'slug' => 'printed-cambric-suit', 'description' => 'Vibrant printed cambric suit with lawn dupatta. A must-have for your summer wardrobe.', 'price' => 2990, 'sale_price' => 2490, 'images' => '["/summer-9.jpeg","/summer10.jpeg"]', 'stock' => 45, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Velvet Winter Dress', 'slug' => 'velvet-winter-dress', 'description' => 'Premium velvet dress with gold thread embroidery. Stay warm and stylish.', 'price' => 5990, 'sale_price' => null, 'images' => '["/wintercollection-4.jpeg","/wintercollection-5.jpeg"]', 'stock' => 15, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Silk Formal Collection', 'slug' => 'silk-formal-collection', 'description' => 'Pure silk formal suit with hand-crafted details. Ideal for weddings and celebrations.', 'price' => 8990, 'sale_price' => 7490, 'images' => '["/suit-21.jpeg","/suit-22.jpeg","/suit-23.jpeg"]', 'stock' => 8, 'is_featured' => true, 'category' => 'Clothing'],
            ['name' => 'Embroidered Khaddar', 'slug' => 'embroidered-khaddar', 'description' => 'Warm khaddar suit with colorful embroidery. Perfect blend of tradition and warmth.', 'price' => 3490, 'sale_price' => null, 'images' => '["/suit-24.jpeg","/suit-25.jpeg"]', 'stock' => 28, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Summer Chiffon Collection', 'slug' => 'summer-chiffon', 'description' => 'Lightweight chiffon suit with delicate embroidery. Flowing silhouettes for summer elegance.', 'price' => 4990, 'sale_price' => 3990, 'images' => '["/summer11.jpeg","/summer12.jpeg","/summer-collection.jpeg"]', 'stock' => 22, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Bridal Lehenga Set', 'slug' => 'bridal-lehenga-set', 'description' => 'Exquisite bridal lehenga with heavy zari work and mirror embellishments. Your dream bridal outfit.', 'price' => 14990, 'sale_price' => 12990, 'images' => '["/suit-26.jpeg","/suit-27.jpeg","/suit-28.jpeg"]', 'stock' => 5, 'is_featured' => true, 'category' => 'Clothing'],
            ['name' => 'Casual Kurti Collection', 'slug' => 'casual-kurti', 'description' => 'Trendy printed kurtis for everyday style. Mix and match with your favorite bottoms.', 'price' => 1490, 'sale_price' => null, 'images' => '["/suit-29.jpeg","/suit-30.jpeg"]', 'stock' => 60, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'New Season Edit', 'slug' => 'new-season-edit', 'description' => 'Exclusive new season collection featuring contemporary designs and premium fabrics.', 'price' => 4290, 'sale_price' => 3490, 'images' => '["/new-collection.jpeg","/newcollection-1.jpeg","/newcollection-2.jpeg"]', 'stock' => 20, 'is_featured' => true, 'category' => 'Clothing'],
            ['name' => 'Signature Pret Collection', 'slug' => 'signature-pret', 'description' => 'Ready-to-wear designer pret with modern cuts and elegant finishing. Just wear and go.', 'price' => 3790, 'sale_price' => null, 'images' => '["/newcollection-3.jpeg","/newcollection-4.jpeg","/newcollection-5.jpeg"]', 'stock' => 30, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Premium Cloth Collection', 'slug' => 'premium-cloth-collection', 'description' => 'Handpicked premium fabrics tailored for sophistication. Each piece is a work of art.', 'price' => 5290, 'sale_price' => 4290, 'images' => '["/cloth collection-5.jpeg","/cloth collection-6.jpeg","/cloth collection-7.jpeg"]', 'stock' => 14, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Luxury Unstitched Suit', 'slug' => 'luxury-unstitched-suit', 'description' => 'Premium unstitched fabric with exclusive print design. Get it tailored to your perfect fit.', 'price' => 3290, 'sale_price' => null, 'images' => '["/cloth collection-8.jpeg","/cloth collection-9.jpeg"]', 'stock' => 35, 'is_featured' => false, 'category' => 'Clothing'],
            ['name' => 'Formal Suit Collection', 'slug' => 'formal-suit-collection', 'description' => 'Elegant formal suits for special occasions. Premium embroidery with rich color palettes.', 'price' => 6790, 'sale_price' => 5790, 'images' => '["/suit-34.jpeg","/suit-4.jpeg","/suits.jpeg"]', 'stock' => 12, 'is_featured' => false, 'category' => 'Clothing'],

            // Accessories
            ['name' => 'Diamond Bracelet', 'slug' => 'diamond-bracelet', 'description' => 'Stunning diamond bracelet with white gold setting. A luxurious statement piece.', 'price' => 3990, 'sale_price' => 3490, 'images' => '["/bracelet-1.jpeg"]', 'stock' => 25, 'is_featured' => true, 'category' => 'Accessories'],
            ['name' => 'Crystal Hair Band', 'slug' => 'crystal-hair-band', 'description' => 'Beautiful crystal-encrusted hair band for an elegant and sophisticated look.', 'price' => 890, 'sale_price' => null, 'images' => '["/accessories.jpeg"]', 'stock' => 50, 'is_featured' => false, 'category' => 'Accessories'],

            // Makeup
            ['name' => 'Luxury Perfume', 'slug' => 'luxury-perfume', 'description' => 'Exquisite long-lasting fragrance with notes of oud, rose, and sandalwood. A signature scent.', 'price' => 3990, 'sale_price' => 2990, 'images' => '["/make-up.jpeg"]', 'stock' => 45, 'is_featured' => true, 'category' => 'Makeup'],
        ];

        foreach ($products as $p) {
            Product::updateOrCreate(
                ['slug' => $p['slug']],
                [
                    'public_id' => (string) Str::uuid(),
                    'name' => $p['name'],
                    'description' => $p['description'],
                    'price' => $p['price'],
                    'sale_price' => $p['sale_price'] ?? null,
                    'images' => $p['images'],
                    'stock' => $p['stock'],
                    'status' => 'active',
                    'is_featured' => $p['is_featured'],
                    'category_id' => $categories[$p['category']]->id,
                ]
            );
        }

        $this->command->info('Seeded: admin user, 5 categories, '.count($products).' products.');
    }
}
