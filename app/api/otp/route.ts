import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { compareOTP, hashOTP } from '../../../lib/auth';
import { getOTPEmail, sendEmail } from '../../../lib/email';
import { sendWhatsAppOtp } from '../../../lib/whatsapp';
import { checkRateLimit } from '../../../lib/rate-limit';
import { sendSmsOtp } from '../../../lib/sms';
import { normalizeEmail } from '../../../lib/request';

type OtpChannel = 'email' | 'whatsapp' | 'sms' | 'all';
const OTP_EMAIL_ONLY_MODE = process.env.OTP_EMAIL_ONLY_MODE !== 'false';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}

const OTP_MAX_ATTEMPTS = 5;
const OTP_TTL_MS = 10 * 60 * 1000;

function getPurposeKey(purpose: string): string {
  return `payment:${String(purpose || 'payment').toLowerCase()}`;
}

function isOtpVerificationTableMissing(error: unknown): boolean {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('OTPVerification') && message.toLowerCase().includes('does not exist');
}

export async function POST(req: NextRequest) {
  try {
    const { action, email, orderId, otp, purpose = 'payment', phone, otpChannel = 'email' } = await req.json();
    const normalizedEmail = email ? normalizeEmail(String(email)) : '';
    const purposeKey = getPurposeKey(purpose);

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: {
        email: normalizedEmail,
        password: await hashOTP(`guest-${Date.now()}-${Math.random()}`),
        role: 'customer',
        isActive: false,
      },
    });

    if (action === 'send') {
      const generatedOTP = generateOTP();
      const expiry = generateOTPExpiry();
      const hashedOtp = await hashOTP(generatedOTP);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          phone: phone ? String(phone) : user.phone,
        },
      });

      let otpExpiryIso = expiry.toISOString();

      try {
        await prisma.oTPVerification.updateMany({
          where: { userId: user.id, purpose: purposeKey, consumedAt: null },
          data: { consumedAt: new Date() },
        });

        const otpRecord = await prisma.oTPVerification.create({
          data: {
            userId: user.id,
            otpHash: hashedOtp,
            purpose: purposeKey,
            expiresAt: expiry,
          },
        });

        otpExpiryIso = otpRecord.expiresAt.toISOString();
      } catch (error) {
        if (!isOtpVerificationTableMissing(error)) {
          throw error;
        }

        // Backward compatible fallback for databases that don't have OTPVerification table yet.
        await prisma.user.update({
          where: { id: user.id },
          data: {
            otp: hashedOtp,
            otpExpiry: expiry,
          },
        });
      }

      const requestedChannel = String(otpChannel).toLowerCase() as OtpChannel;
      const channel: OtpChannel = OTP_EMAIL_ONLY_MODE ? 'email' : requestedChannel;
      const deliveryTargetPhone = phone ? String(phone) : user.phone || '';
      const results: Array<{ channel: 'email' | 'whatsapp' | 'sms'; sent: boolean; error?: string }> = [];

      if (channel === 'email' || channel === 'all') {
        try {
          await sendEmail({
            to: normalizedEmail,
            subject: 'Your Sapphura Verification Code',
            html: getOTPEmail(generatedOTP, user.name || 'Customer'),
          });
          results.push({ channel: 'email', sent: true });
        } catch (error) {
          results.push({
            channel: 'email',
            sent: false,
            error: error instanceof Error ? error.message : 'Email delivery failed',
          });
        }
      }

      if (channel === 'whatsapp' || channel === 'all') {
        if (!deliveryTargetPhone) {
          results.push({ channel: 'whatsapp', sent: false, error: 'Phone number is required for WhatsApp OTP' });
        } else {
          const waResult = await sendWhatsAppOtp({ to: deliveryTargetPhone, otp: generatedOTP, name: user.name || 'Customer' });
          results.push({ channel: 'whatsapp', sent: waResult.sent, error: waResult.error });
        }
      }

      if (channel === 'sms' || channel === 'all') {
        if (!deliveryTargetPhone) {
          results.push({ channel: 'sms', sent: false, error: 'Phone number is required for SMS OTP' });
        } else {
          const smsResult = await sendSmsOtp({ to: deliveryTargetPhone, otp: generatedOTP, name: user.name || 'Customer' });
          results.push({ channel: 'sms', sent: smsResult.sent, error: smsResult.error });
        }
      }

      const sentChannels = results.filter((item: any) => item.sent).map((item: any) => item.channel);
      if (sentChannels.length === 0 && channel !== 'email') {
        try {
          await sendEmail({
            to: normalizedEmail,
            subject: 'Your Sapphura Verification Code',
            html: getOTPEmail(generatedOTP, user.name || 'Customer'),
          });
          results.push({ channel: 'email', sent: true });
          sentChannels.push('email');
        } catch (error) {
          results.push({
            channel: 'email',
            sent: false,
            error: error instanceof Error ? error.message : 'Email fallback failed',
          });
        }
      }

      if (sentChannels.length === 0) {
        const reasons = results
          .filter((item: any) => !item.sent)
          .map((item: any) => `${item.channel}: ${item.error || 'delivery failed'}`)
          .join(' | ');
        return NextResponse.json(
          {
            error: reasons || 'Failed to deliver OTP on selected channel(s)',
            delivery: results,
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `OTP sent via ${sentChannels.join(', ')}`,
        requestedChannel,
        effectiveChannel: channel,
        channels: sentChannels,
        delivery: results,
        expiry: otpExpiryIso,
        requestId: user.id,
      });
    }

    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
      }

      let latestOtp: { id: number; otpHash: string; expiresAt: Date; attempts: number } | null = null;
      let fallbackToUserOtp = false;

      try {
        latestOtp = await prisma.oTPVerification.findFirst({
          where: { userId: user.id, purpose: purposeKey, consumedAt: null },
          orderBy: { createdAt: 'desc' },
        });
      } catch (error) {
        if (!isOtpVerificationTableMissing(error)) {
          throw error;
        }
        fallbackToUserOtp = true;
      }

      if (!fallbackToUserOtp) {
        if (!latestOtp) {
          return NextResponse.json({ error: 'No active OTP request found' }, { status: 404 });
        }

        if (latestOtp.expiresAt < new Date()) {
          return NextResponse.json({ error: 'OTP expired. Please request a new code.' }, { status: 400 });
        }

        if (latestOtp.attempts >= OTP_MAX_ATTEMPTS) {
          return NextResponse.json({ error: 'Too many attempts. Please request a new OTP.' }, { status: 429 });
        }
      }

      const attemptLimit = checkRateLimit({
        key: `otp:verify:${user.id}:${purposeKey}`,
        max: OTP_MAX_ATTEMPTS,
        windowMs: OTP_TTL_MS,
      });

      if (!attemptLimit.allowed) {
        return NextResponse.json({ error: 'Too many attempts. Please request a new OTP.' }, { status: 429 });
      }

      let valid = false;

      if (fallbackToUserOtp) {
        const userOtp = await prisma.user.findUnique({
          where: { id: user.id },
          select: { otp: true, otpExpiry: true },
        });

        if (!userOtp?.otp || !userOtp.otpExpiry) {
          return NextResponse.json({ error: 'No active OTP request found' }, { status: 404 });
        }

        if (userOtp.otpExpiry < new Date()) {
          return NextResponse.json({ error: 'OTP expired. Please request a new code.' }, { status: 400 });
        }

        valid = await compareOTP(otp, userOtp.otp);
      } else {
        valid = await compareOTP(otp, latestOtp!.otpHash);
      }

      if (!valid) {
        if (!fallbackToUserOtp) {
          await prisma.oTPVerification.update({
            where: { id: latestOtp!.id },
            data: { attempts: { increment: 1 } },
          });
        }
        const remaining = attemptLimit.remaining;
        return NextResponse.json({ error: `Invalid OTP. ${remaining} attempts remaining.` }, { status: 400 });
      }

      if (fallbackToUserOtp) {
        await prisma.user.update({
          where: { id: user.id },
          data: { otp: null, otpExpiry: null },
        });
      } else {
        await prisma.oTPVerification.update({
          where: { id: latestOtp!.id },
          data: { consumedAt: new Date(), attempts: { increment: 1 } },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        orderId: orderId || null,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('OTP Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process OTP';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
