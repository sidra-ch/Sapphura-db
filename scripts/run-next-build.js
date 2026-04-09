const { spawnSync } = require('child_process');
const { runPrismaGenerate } = require('./run-prisma-generate');

const prismaStatus = runPrismaGenerate();
if (prismaStatus !== 0) {
  process.exit(prismaStatus);
}

const nextBin = require.resolve('next/dist/bin/next');
const result = spawnSync(process.execPath, [nextBin, 'build', '--webpack'], {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);