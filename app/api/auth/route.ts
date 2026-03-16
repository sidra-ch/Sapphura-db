import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { hashPassword, comparePassword, generateToken, generateOTP, hashOTP, compareOTP } from '../../../lib/auth';
import { getOTPEmail, sendEmail } from '../../../lib/email';
import { checkRateLimit } from '../../../lib/rate-limit';
import { getClientIp, normalizeEmail } from '../../../lib/request';
import { sendWhatsAppOtp } from '../../../lib/whatsapp';
import { sendSmsOtp } from '../../../lib/sms';

type OtpChannel = 'email' | 'whatsapp' | 'sms' | 'all';

function toOtpChannel(value: string): OtpChannel {
  const normalized = value.toLowerCase();
  if (normalized === 'email' || normalized === 'whatsapp' || normalized === 'sms' || normalized === 'all') {
    return normalized;
  }
  return 'email';
}

const OTP_MAX_ATTEMPTS = 5;
const OTP_TTL_MS = 10 * 60 * 1000;

function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const globalLimit = checkRateLimit({ key: `auth:ip:${ip}`, max: 40, windowMs: 60_000 });
    if (!globalLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many authentication requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(globalLimit.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const action = String(body.action || '');
    const email = body.email ? normalizeEmail(String(body.email)) : '';
    const password = body.password ? String(body.password) : '';
    const name = body.name ? String(body.name).trim() : '';
    const phone = body.phone ? String(body.phone).trim() : '';
    const userId = Number(body.userId || 0);
    const otpInput = body.otp ? String(body.otp).trim() : '';
    const requestedOtpChannel = toOtpChannel(String(body.otpChannel || 'email'));
    const otpChannel: OtpChannel = requestedOtpChannel;

    if (email) {
      const emailLimit = checkRateLimit({ key: `auth:email:${email}`, max: 15, windowMs: 15 * 60_000 });
      if (!emailLimit.allowed) {
        return NextResponse.json(
          { error: 'Too many attempts for this account. Please try later.' },
          { status: 429, headers: { 'Retry-After': String(emailLimit.retryAfterSeconds) } }
        );
      }
    }

    if (action === 'signup') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
      }

      if (!isStrongPassword(password)) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters and include 1 uppercase letter and 1 number' },
          { status: 400 }
        );
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      const canUpgradeGuest =
        !!existingUser &&
        existingUser.role === 'customer' &&
        (!existingUser.name || !existingUser.isActive);

      if (existingUser && !canUpgradeGuest) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      const hashedPassword = await hashPassword(password);
      const otpCode = generateOTP();
      const hashedOtp = await hashOTP(otpCode);

      const user = existingUser && canUpgradeGuest
        ? await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              password: hashedPassword,
              name,
              phone: phone || existingUser.phone,
              otp: hashedOtp,
              otpExpiry: new Date(Date.now() + OTP_TTL_MS),
              isActive: false,
            },
          })
        : await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              name,
              phone: phone || null,
              otp: hashedOtp,
              otpExpiry: new Date(Date.now() + OTP_TTL_MS),
              isActive: false,
            },
          });

      const deliveryResults: Array<{ channel: 'email' | 'whatsapp' | 'sms'; sent: boolean; error?: string }> = [];
      const deliveryPhone = phone || '';

      if (otpChannel === 'email' || otpChannel === 'all') {
        try {
          await sendEmail({
            to: email,
            subject: 'Your Sapphura Verification Code',
            html: getOTPEmail(otpCode, name),
          });
          deliveryResults.push({ channel: 'email', sent: true });
        } catch (error) {
          deliveryResults.push({
            channel: 'email',
            sent: false,
            error: error instanceof Error ? error.message : 'Email delivery failed',
          });
        }
      }

      if (otpChannel === 'whatsapp' || otpChannel === 'all') {
        if (!deliveryPhone) {
          deliveryResults.push({ channel: 'whatsapp', sent: false, error: 'Phone number is required for WhatsApp OTP' });
        } else {
          const waResult = await sendWhatsAppOtp({ to: deliveryPhone, otp: otpCode, name });
          deliveryResults.push({ channel: 'whatsapp', sent: waResult.sent, error: waResult.error });
        }
      }

      if (otpChannel === 'sms' || otpChannel === 'all') {
        if (!deliveryPhone) {
          deliveryResults.push({ channel: 'sms', sent: false, error: 'Phone number is required for SMS OTP' });
        } else {
          const smsResult = await sendSmsOtp({ to: deliveryPhone, otp: otpCode, name });
          deliveryResults.push({ channel: 'sms', sent: smsResult.sent, error: smsResult.error });
        }
      }

      const sentChannels = deliveryResults.filter((item: any) => item.sent).map((item: any) => item.channel);

      if (sentChannels.length === 0) {
        const reasons = deliveryResults
          .filter((item: any) => !item.sent)
          .map((item: any) => `${item.channel}: ${item.error || 'delivery failed'}`)
          .join(' | ');
        return NextResponse.json(
          { error: reasons || 'Failed to deliver OTP on selected channel(s)', delivery: deliveryResults },
          { status: 502 }
        );
      }

      return NextResponse.json({
        message: `OTP sent via ${sentChannels.join(', ')}`,
        requestedChannel: requestedOtpChannel,
        effectiveChannel: otpChannel,
        channels: sentChannels,
        delivery: deliveryResults,
        userId: user.id,
      });
    }

    if (action === 'resend-signup-otp') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'No account found for this email' }, { status: 404 });
      }

      if (user.isActive) {
        return NextResponse.json({ error: 'Account already verified. Please sign in.' }, { status: 400 });
      }

      const otpCode = generateOTP();
      const hashedOtp = await hashOTP(otpCode);
      await prisma.user.update({
        where: { id: user.id },
        data: { otp: hashedOtp, otpExpiry: new Date(Date.now() + OTP_TTL_MS) },
      });

      try {
        await sendEmail({
          to: user.email,
          subject: 'Your Sapphura Verification Code',
          html: getOTPEmail(otpCode, user.name || 'Customer'),
        });
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Failed to deliver OTP via email' },
          { status: 502 }
        );
      }

      return NextResponse.json({
        message: 'Verification OTP resent to your email.',
        requestedChannel: requestedOtpChannel,
        effectiveChannel: 'email',
        channels: ['email'],
        userId: user.id,
      });
    }

    if (action === 'verify-otp') {
      if (!userId || !otpInput) {
        return NextResponse.json({ error: 'User ID and OTP are required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

      const otpAttemptLimit = checkRateLimit({ key: `auth:signup-otp:${user.id}`, max: OTP_MAX_ATTEMPTS, windowMs: OTP_TTL_MS });
      if (!otpAttemptLimit.allowed) {
        return NextResponse.json(
          { error: 'Too many OTP attempts. Please request a new code.' },
          { status: 429, headers: { 'Retry-After': String(otpAttemptLimit.retryAfterSeconds) } }
        );
      }

      const otpValid = await compareOTP(otpInput, user.otp);
      if (!otpValid) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { otp: null, otpExpiry: null, isActive: true },
      });

      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      return NextResponse.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
      });
    }

    if (action === 'verify-login-otp') {
      if (!userId || !otpInput) {
        return NextResponse.json({ error: 'User ID and OTP are required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

      const otpAttemptLimit = checkRateLimit({ key: `auth:login-otp:${user.id}`, max: OTP_MAX_ATTEMPTS, windowMs: OTP_TTL_MS });
      if (!otpAttemptLimit.allowed) {
        return NextResponse.json(
          { error: 'Too many OTP attempts. Please request a new code.' },
          { status: 429, headers: { 'Retry-After': String(otpAttemptLimit.retryAfterSeconds) } }
        );
      }

      const otpValid = await compareOTP(otpInput, user.otp);
      if (!otpValid) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { otp: null, otpExpiry: null },
      });

      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      return NextResponse.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
      });
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      if (!user.name) {
        return NextResponse.json(
          { error: 'This email is pending registration. Please use Register to complete account setup.' },
          { status: 403 }
        );
      }

      if (!user.isActive) {
        return NextResponse.json(
          { error: 'Account is not verified. Please complete OTP verification from register flow.' },
          { status: 403 }
        );
      }

      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      return NextResponse.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      });
    }

    if (action === 'login-otp') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      if (!user.name) {
        return NextResponse.json(
          { error: 'This email is pending registration. Please complete signup first.' },
          { status: 403 }
        );
      }

      if (!user.isActive) {
        return NextResponse.json({ error: 'Account is not verified. Please verify signup OTP first.' }, { status: 403 });
      }

      const otpCode = generateOTP();
      const hashedOtp = await hashOTP(otpCode);
      await prisma.user.update({
        where: { id: user.id },
        data: { otp: hashedOtp, otpExpiry: new Date(Date.now() + OTP_TTL_MS) },
      });

      const deliveryResults: Array<{ channel: 'email' | 'whatsapp' | 'sms'; sent: boolean; error?: string }> = [];
      const deliveryPhone = user.phone || phone;

      if (otpChannel === 'email' || otpChannel === 'all') {
        try {
          await sendEmail({
            to: user.email,
            subject: 'Your Sapphura Login Code',
            html: getOTPEmail(otpCode, user.name || 'Customer'),
          });
          deliveryResults.push({ channel: 'email', sent: true });
        } catch (error) {
          deliveryResults.push({
            channel: 'email',
            sent: false,
            error: error instanceof Error ? error.message : 'Email delivery failed',
          });
        }
      }

      if (otpChannel === 'whatsapp' || otpChannel === 'all') {
        if (!deliveryPhone) {
          deliveryResults.push({ channel: 'whatsapp', sent: false, error: 'Phone number is required for WhatsApp OTP' });
        } else {
          const waResult = await sendWhatsAppOtp({ to: deliveryPhone, otp: otpCode, name: user.name || 'Customer' });
          deliveryResults.push({ channel: 'whatsapp', sent: waResult.sent, error: waResult.error });
        }
      }

      if (otpChannel === 'sms' || otpChannel === 'all') {
        if (!deliveryPhone) {
          deliveryResults.push({ channel: 'sms', sent: false, error: 'Phone number is required for SMS OTP' });
        } else {
          const smsResult = await sendSmsOtp({ to: deliveryPhone, otp: otpCode, name: user.name || 'Customer' });
          deliveryResults.push({ channel: 'sms', sent: smsResult.sent, error: smsResult.error });
        }
      }

      const sentChannels = deliveryResults.filter((item: any) => item.sent).map((item: any) => item.channel);
      if (sentChannels.length === 0 && otpChannel !== 'email') {
        try {
          await sendEmail({
            to: user.email,
            subject: 'Your Sapphura Login Code',
            html: getOTPEmail(otpCode, user.name || 'Customer'),
          });
          deliveryResults.push({ channel: 'email', sent: true });
          sentChannels.push('email');
        } catch (error) {
          deliveryResults.push({
            channel: 'email',
            sent: false,
            error: error instanceof Error ? error.message : 'Email fallback failed',
          });
        }
      }

      if (sentChannels.length === 0) {
        const reasons = deliveryResults
          .filter((item: any) => !item.sent)
          .map((item: any) => `${item.channel}: ${item.error || 'delivery failed'}`)
          .join(' | ');
        return NextResponse.json(
          { error: reasons || 'Failed to deliver OTP on selected channel(s)', delivery: deliveryResults },
          { status: 502 }
        );
      }

      return NextResponse.json({
        message: `OTP sent via ${sentChannels.join(', ')}`,
        requestedChannel: requestedOtpChannel,
        effectiveChannel: otpChannel,
        channels: sentChannels,
        delivery: deliveryResults,
        userId: user.id,
      });
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
