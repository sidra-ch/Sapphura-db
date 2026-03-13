import { defineConfig } from '@prisma/cli';

export default defineConfig({
  db: {
    adapter: 'postgresql',
    url: process.env.DATABASE_URL,
  },
});
