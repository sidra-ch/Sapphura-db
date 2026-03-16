require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/check-user.js <email>');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const query = `
    SELECT id, email, name, role, "isActive" as is_active, "createdAt" as created_at, "updatedAt" as updated_at
    FROM "User"
    WHERE lower(email) = lower($1)
    LIMIT 1
  `;

  const result = await pool.query(query, [email]);
  console.log(JSON.stringify(result.rows, null, 2));
  await pool.end();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
