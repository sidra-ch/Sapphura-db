const path = require('path');
const { spawnSync } = require('child_process');

function runPrismaGenerate() {
  const projectRoot = path.resolve(__dirname, '..');
  const prismaBin = require.resolve('prisma/build/index.js', { paths: [projectRoot] });
  const env = { ...process.env };

  // Prisma config expects DATABASE_URL to exist during generate.
  // Use a local fallback only for build-time code generation when missing.
  if (!env.DATABASE_URL) {
    env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/sapphura';
    console.warn('[build] DATABASE_URL was not set. Using fallback value for prisma generate.');
  }

  const result = spawnSync(process.execPath, [prismaBin, 'generate'], {
    cwd: projectRoot,
    stdio: 'inherit',
    env,
  });

  if (result.error) {
    console.error(result.error);
    return 1;
  }

  return result.status ?? 1;
}

module.exports = { runPrismaGenerate };

if (require.main === module) {
  process.exit(runPrismaGenerate());
}