const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const prismaBin = require.resolve('prisma/build/index.js', { paths: [projectRoot] });

const result = spawnSync(process.execPath, [prismaBin, 'generate'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);