const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const productImages = {
  'gold-crescent-necklace': '["/neckles-1.jpeg"]',
  'navy-velvet-abaya': '["/suit-31.jpeg"]',
  'diamond-bracelet': '["/bracelet-1.jpeg"]',
  'kashmiri-bangals': '["/bangals-1.jpeg"]',
  'pearl-earrings': '["/earrings-1.jpeg"]',
  'silk-abaya-set': '["/suit-1.jpeg"]',
  'crystal-hair-band': '["/accessories.jpeg"]',
  'luxury-perfume': '["/make-up.jpeg"]',
  'gold-ring-set': '["/earing-4.jpeg"]',
  'summer-suit': '["/summer-1.jpeg"]',
  'winter-collection': '["/wintercollection-1.jpeg"]',
  'bridal-necklace-set': '["/neckles-1.jpeg"]',
  'royal-abaya': '["/suit-5.jpeg"]',
  'diamond-stud-earrings': '["/earing-2.jpeg"]',
  'kashmiri-shawl': '["/clothes-collection.jpeg"]',
  'party-wear-saree': '["/suit-10.jpeg"]',
};

async function main() {
  const client = await pool.connect();
  
  try {
    for (const [slug, images] of Object.entries(productImages)) {
      await client.query(`UPDATE "Product" SET images = $1 WHERE slug = $2`, [images, slug]);
    }
    
    console.log('✅ Products updated with local image paths!');

    const result = await client.query('SELECT id, name, slug FROM "Product" ORDER BY id');
    console.log('\n📦 Total products:', result.rows.length);

  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
