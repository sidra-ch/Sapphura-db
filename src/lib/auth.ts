// Simple authentication utility (placeholder)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  // Replace with real password hash check
  if (user.password !== password) return null;
  return user;
}

export async function register(email: string, password: string, name?: string) {
  return await prisma.user.create({ data: { email, password, name } });
}

export async function isAdmin(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.role === 'admin';
}
