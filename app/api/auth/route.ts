import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { hashPassword, comparePassword, generateToken, generateOTP } from '../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, name, phone } = await req.json();

    // Signup with OTP
    if (action === 'signup') {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      const hashedPassword = await hashPassword(password);
      const otpCode = generateOTP();
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
          otp: otpCode,
          otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      // In production, send OTP via SMS/Email
      console.log('OTP:', otpCode);

      return NextResponse.json({ message: 'OTP sent to your email', userId: user.id });
    }

    // Verify OTP
    if (action === 'verify-otp') {
      const { userId, otp: verifyOtp } = await req.json();
      
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (user.otp !== verifyOtp || !user.otpExpiry || user.otpExpiry < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

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
      // Demo login bypass (remove in production)
      if (email === 'admin@sapphura.com' && password === 'demo123') {
        return NextResponse.json({ 
          token: 'demo-admin-token', 
          user: { id: '1', email: 'admin@sapphura.com', name: 'Admin User', phone: '+923320924951', role: 'admin' } 
        });
      }
      if (email === 'manager@sapphura.com' && password === 'demo123') {
        return NextResponse.json({ 
          token: 'demo-manager-token', 
          user: { id: '2', email: 'manager@sapphura.com', name: 'Manager User', phone: '+923320924951', role: 'manager' } 
        });
      }
      if (email === 'customer@sapphura.com' && password === 'demo123') {
        return NextResponse.json({ 
          token: 'demo-customer-token', 
          user: { id: '3', email: 'customer@sapphura.com', name: 'Customer User', phone: '+923320924951', role: 'customer' } 
        });
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
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Email not registered' }, { status: 404 });
      }

      const otpCode = generateOTP();
      await prisma.user.update({
        where: { id: user.id },
        data: { otp: otpCode, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) },
      });

      console.log('Login OTP:', otpCode);
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