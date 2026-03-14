const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();
  
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await client.query(`
      UPDATE "User" SET password = $1 WHERE email IN ('admin@sapphura.com', 'manager@sapphura.com', 'customer@sapphura.com')
    `, [hashedPassword]);
    
    console.log('✅ Passwords updated to: 123456');
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
