import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { hashPassword, comparePassword, generateToken, generateOTP, hashOTP, compareOTP } from '../../../lib/auth';
import { getOTPEmail, sendEmail } from '../../../lib/email';

const OTP_MAX_ATTEMPTS = 5;
const otpAttempts = new Map<string, number>();

function getAttemptKey(userId: number, purpose: 'signup' | 'login'): string {
  return `${purpose}:${userId}`;
}

function consumeAttempt(key: string): number {
  const next = (otpAttempts.get(key) || 0) + 1;
  otpAttempts.set(key, next);
  return next;
}

function clearAttempts(key: string) {
  otpAttempts.delete(key);
}

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, name, phone } = await req.json();

    // Signup with OTP
    if (action === 'signup') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      const hashedPassword = await hashPassword(password);
      const otpCode = generateOTP();
      const hashedOtp = await hashOTP(otpCode);
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
          otp: hashedOtp,
          otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      await sendEmail({
        to: email,
        subject: 'Your Sapphura Verification Code',
        html: getOTPEmail(otpCode, name),
      });

      return NextResponse.json({ message: 'OTP sent to your email', userId: user.id });
    }

    // Verify OTP
    if (action === 'verify-otp') {
      const { userId, otp: verifyOtp } = await req.json();

      if (!userId || !verifyOtp) {
        return NextResponse.json({ error: 'User ID and OTP are required' }, { status: 400 });
      }
      
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const attemptKey = getAttemptKey(user.id, 'signup');
      const attempts = otpAttempts.get(attemptKey) || 0;
      if (attempts >= OTP_MAX_ATTEMPTS) {
        return NextResponse.json({ error: 'Too many OTP attempts. Please request a new code.' }, { status: 429 });
      }

      if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

      const otpValid = await compareOTP(verifyOtp, user.otp);
      if (!otpValid) {
        const used = consumeAttempt(attemptKey);
        const remaining = Math.max(OTP_MAX_ATTEMPTS - used, 0);
        return NextResponse.json({ error: `Invalid OTP. ${remaining} attempts remaining.` }, { status: 400 });
      }

      clearAttempts(attemptKey);

      await prisma.user.update({
        where: { id: userId },
        data: { otp: null, otpExpiry: null, isActive: true },
      });

      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      return NextResponse.json({ 
        token, 
        user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone } 
      });
    }

    // Verify login OTP
    if (action === 'verify-login-otp') {
      const { userId, otp: verifyOtp } = await req.json();

      if (!userId || !verifyOtp) {
        return NextResponse.json({ error: 'User ID and OTP are required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const attemptKey = getAttemptKey(user.id, 'login');
      const attempts = otpAttempts.get(attemptKey) || 0;
      if (attempts >= OTP_MAX_ATTEMPTS) {
        return NextResponse.json({ error: 'Too many OTP attempts. Please request a new code.' }, { status: 429 });
      }

      if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

      const otpValid = await compareOTP(verifyOtp, user.otp);
      if (!otpValid) {
        const used = consumeAttempt(attemptKey);
        const remaining = Math.max(OTP_MAX_ATTEMPTS - used, 0);
        return NextResponse.json({ error: `Invalid OTP. ${remaining} attempts remaining.` }, { status: 400 });
      }

      clearAttempts(attemptKey);

      await prisma.user.update({
        where: { id: userId },
        data: { otp: null, otpExpiry: null },
      });

      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      return NextResponse.json({ 
        token, 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
      });
    }

    // Login
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      if (!user.isActive) {
        return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 });
      }

      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      return NextResponse.json({ 
        token, 
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role } 
      });
    }

    // Login with OTP
    if (action === 'login-otp') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Email not registered' }, { status: 404 });
      }

      const otpCode = generateOTP();
      const hashedOtp = await hashOTP(otpCode);
      await prisma.user.update({
        where: { id: user.id },
        data: { otp: hashedOtp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) },
      });

      clearAttempts(getAttemptKey(user.id, 'login'));

      await sendEmail({
        to: user.email,
        subject: 'Your Sapphura Login Code',
        html: getOTPEmail(otpCode, user.name || 'Customer'),
      });

      return NextResponse.json({ message: 'OTP sent', userId: user.id });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const { verifyToken } = await import('../../../lib/auth');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, phone: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}