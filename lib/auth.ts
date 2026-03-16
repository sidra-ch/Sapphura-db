import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const FALLBACK_JWT_SECRET = 'sapphura-fallback-jwt-secret-change-in-env';
const JWT_SECRET = process.env.JWT_SECRET || FALLBACK_JWT_SECRET;

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('JWT_SECRET is not set. Using fallback secret. Set JWT_SECRET in environment variables.');
}

export function generateToken(user: { id: number; email: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function compareOTP(otp: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(otp, hashed);
}