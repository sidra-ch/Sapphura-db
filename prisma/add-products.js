const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();
  
  try {
    // Add more products
    await client.query(`
      INSERT INTO "Product" (name, slug, description, price, images, stock, status, "isFeatured", "categoryId", "createdAt", "updatedAt") VALUES 
      ('Pearl Earrings', 'pearl-earrings', 'Elegant pearl earrings for special occasions.', 149, '["/earrings-1.jpeg"]', 35, 'active', true, 1, NOW(), NOW()),
      ('Silk Abaya Set', 'silk-abaya-set', 'Premium silk abaya with matching scarf.', 279, '["/suit-1.jpeg"]', 20, 'active', true, 2, NOW(), NOW()),
      ('Crystal Hair Band', 'crystal-hair-band', 'Beautiful crystal hair band for elegant look.', 89, '["/accessories.jpeg"]', 50, 'active', false, 3, NOW(), NOW()),
      ('Luxury Perfume', 'luxury-perfume', 'Exquisite long-lasting fragrance.', 199, '["/make-up.jpeg"]', 45, 'active', true, 5, NOW(), NOW()),
      ('Gold Ring Set', 'gold-ring-set', 'Elegant gold ring set with traditional design.', 179, '["/earing-4.jpeg"]', 30, 'active', false, 1, NOW(), NOW()),
      ('Summer Suit', 'summer-suit', 'Light and breezy summer suit.', 199, '["/summer-1.jpeg"]', 40, 'active', false, 4, NOW(), NOW()),
      ('Winter Collection', 'winter-collection', 'Warm and stylish winter wear.', 299, '["/wintercollection-1.jpeg"]', 25, 'active', true, 4, NOW(), NOW()),
      ('Bridal Necklace Set', 'bridal-necklace-set', 'Stunning bridal necklace with earrings.', 599, '["/neckles-1.jpeg"]', 15, 'active', true, 1, NOW(), NOW()),
      ('Royal Embroidered Abaya', 'royal-abaya', 'Beautiful embroidered abaya for special events.', 249, '["/suit-5.jpeg"]', 20, 'active', false, 2, NOW(), NOW()),
      ('Diamond Stud Earrings', 'diamond-stud-earrings', 'Classic diamond stud earrings.', 349, '["/earing-2.jpeg"]', 25, 'active', true, 1, NOW(), NOW()),
      ('Kashmiri Shawl', 'kashmiri-shawl', 'Authentic Kashmiri pashmina shawl.', 199, '["/clothes-collection.jpeg"]', 30, 'active', false, 4, NOW(), NOW()),
      ('Party Wear Saree', 'party-wear-saree', 'Elegant party wear saree.', 289, '["/suit-10.jpeg"]', 20, 'active', true, 4, NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('✅ More products added!');

    // Show all products
    const result = await client.query('SELECT id, name, slug, price, "categoryId" FROM "Product" ORDER BY id');
    console.log('\n📦 Products in database:');
    result.rows.forEach(p => console.log(`  ${p.id}. ${p.name} - $${p.price}`));

  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
