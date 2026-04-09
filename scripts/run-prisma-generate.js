const path = require('path');
const { spawnSync } = require('child_process');

function runPrismaGenerate() {
  const projectRoot = path.resolve(__dirname, '..');
  const prismaBin = require.resolve('prisma/build/index.js', { paths: [projectRoot] });

  const result = spawnSync(process.execPath, [prismaBin, 'generate'], {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env,
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