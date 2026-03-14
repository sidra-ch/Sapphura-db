const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();
  
  try {
    // Create categories
    await client.query(`
      INSERT INTO "Category" (name) VALUES 
      ('Jewelry'), ('Abaya'), ('Accessories'), ('Clothing'), ('Makeup')
      ON CONFLICT (name) DO NOTHING
    `);
    console.log('Categories created');

    // Create users
    await client.query(`
      INSERT INTO "User" (email, password, name, phone, role, "createdAt", "updatedAt") VALUES 
      ('admin@sapphura.com', '$2a$10$rVQ2YqNxLxL5HxkVxqYxXeF5Yx5YxYxYxYxYxYxYxYxYxYxYxYx', 'Admin User', '+923001234567', 'admin', NOW(), NOW()),
      ('manager@sapphura.com', '$2a$10$rVQ2YqNxLxL5HxkVxqYxXeF5Yx5YxYxYxYxYxYxYxYxYxYxYxYx', 'Manager User', '+923001234568', 'manager', NOW(), NOW()),
      ('customer@sapphura.com', '$2a$10$rVQ2YqNxLxL5HxkVxqYxXeF5Yx5YxYxYxYxYxYxYxYxYxYxYxYx', 'Demo Customer', '+923001234569', 'customer', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('Users created');

    // Create products
    await client.query(`
      INSERT INTO "Product" (name, slug, description, price, images, stock, status, "isFeatured", "categoryId", "createdAt", "updatedAt") VALUES 
      ('Gold Crescent Necklace', 'gold-crescent-necklace', 'Luxury gold necklace for Ramadan.', 299, '["/neckles-1.jpeg","/neckles-2.jpeg"]', 50, 'active', true, 1, NOW(), NOW()),
      ('Navy Velvet Abaya', 'navy-velvet-abaya', 'Elegant navy abaya.', 189, '["/suit-31.jpeg"]', 30, 'active', false, 2, NOW(), NOW()),
      ('Diamond Bracelet', 'diamond-bracelet', 'Stunning diamond bracelet.', 399, '["/bracelet-1.jpeg"]', 25, 'active', true, 3, NOW(), NOW()),
      ('Kashmiri Bangals', 'kashmiri-bangals', 'Authentic Kashmiri bangles.', 249, '["/bangals-1.jpeg"]', 40, 'active', false, 1, NOW(), NOW()),
      ('Pearl Earrings', 'pearl-earrings', 'Elegant pearl earrings.', 149, '["/earrings-1.jpeg"]', 35, 'active', true, 1, NOW(), NOW()),
      ('Silk Abaya Set', 'silk-abaya-set', 'Premium silk abaya with scarf.', 279, '["/abaya-2.jpeg"]', 20, 'active', true, 2, NOW(), NOW()),
      ('Crystal Hair Band', 'crystal-hair-band', 'Beautiful crystal hair band.', 89, '["/hairband-1.jpeg"]', 50, 'active', false, 3, NOW(), NOW()),
      ('Luxury Perfume', 'luxury-perfume', 'Exquisite luxury fragrance.', 199, '["/perfume-1.jpeg"]', 45, 'active', true, 5, NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('Products created');

    console.log('\n✅ Seed completed!');
    console.log('Demo accounts:');
    console.log('  Admin: admin@sapphura.com / 123456');
    console.log('  Manager: manager@sapphura.com / 123456');
    console.log('  Customer: customer@sapphura.com / 123456');
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
