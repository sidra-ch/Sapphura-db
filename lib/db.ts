import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    ''
  ).trim();
}

function getNormalizedPassword(connectionString: string): string | undefined {
  try {
    const parsed = new URL(connectionString);
    // Force a string password for pg SASL auth path to avoid runtime type errors.
    return typeof parsed.password === 'string' ? decodeURIComponent(parsed.password) : '';
  } catch {
    return undefined;
  }
}

function resolvePoolSsl(connectionString: string) {
  const url = connectionString.trim();
  if (!url) return false;

  const lower = url.toLowerCase();
  const disableSsl = lower.includes('sslmode=disable') || lower.includes('ssl=false');
  if (disableSsl) return false;

  const localHost =
    lower.includes('@localhost:') ||
    lower.includes('@127.0.0.1:') ||
    lower.includes('@host.docker.internal:') ||
    lower.includes('@0.0.0.0:');
  if (localHost) return false;

  const enforceSsl =
    lower.includes('sslmode=require') ||
    lower.includes('sslmode=verify-full') ||
    lower.includes('sslmode=verify-ca') ||
    lower.includes('ssl=true') ||
    process.env.NODE_ENV === 'production';

  return enforceSsl ? { rejectUnauthorized: false } : false;
}

function createPrismaClient() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    return new PrismaClient();
  }

  const ssl = resolvePoolSsl(connectionString);
  const password = getNormalizedPassword(connectionString);
  
  // Standard PG Pool for better stability on shared hosting (cPanel)
  const pool = new Pool({ 
    connectionString,
    ...(password !== undefined ? { password } : {}),
    max: 5, // Limit connections to prevent overwhelming shared hosting
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl,
  });
  
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;  
