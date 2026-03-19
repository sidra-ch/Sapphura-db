import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-only-sapphura-secret');

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

interface OtpProofPayload {
  email: string;
  purpose: string;
}

export function generateOtpProofToken(payload: OtpProofPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      email: payload.email,
      purpose: payload.purpose,
      scope: 'payment-otp-proof',
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

export function verifyOtpProofToken(token: string): OtpProofPayload | null {
  try {
    if (!JWT_SECRET) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      email?: string;
      purpose?: string;
      scope?: string;
    };

    if (decoded.scope !== 'payment-otp-proof' || !decoded.email || !decoded.purpose) {
      return null;
    }

    return {
      email: decoded.email,
      purpose: decoded.purpose,
    };
  } catch {
    return null;
  }
}