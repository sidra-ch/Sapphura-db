require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const email = process.argv[2];
  const nextPassword = process.argv[3];

  if (!email || !nextPassword) {
    console.error('Usage: node scripts/reset-user-password.js <email> <newPassword>');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const hash = await bcrypt.hash(nextPassword, 10);

  const result = await pool.query(
    'UPDATE "User" SET password = $1, "updatedAt" = NOW() WHERE lower(email) = lower($2) RETURNING id, email',
    [hash, email]
  );

  console.log(JSON.stringify(result.rows, null, 2));
  await pool.end();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
