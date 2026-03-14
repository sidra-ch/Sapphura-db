import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sapphuraofficial@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'btrn dphx qfjw qpxb'
  }
});

export async function POST(req: NextRequest) {
  try {
    const { action, email, orderId, otp } = await req.json();

    if (action === 'send') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      const generatedOTP = generateOTP();
      const expiry = generateOTPExpiry();

      const mailOptions = {
        from: 'Sapphura <sapphuraofficial@gmail.com>',
        to: email,
        subject: 'Your Sapphura Order Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to bottom, #0a0a23, #1a1a40); padding: 30px; text-align: center;">
              <h1 style="color: #d4af37; margin: 0;">Sapphura</h1>
              <p style="color: #fff; margin-top: 10px;">Order Verification</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p style="color: #333; font-size: 16px;">Your verification code is:</p>
              <div style="background: #d4af37; color: #0a0a23; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; letter-spacing: 5px; margin: 20px 0;">
                ${generatedOTP}
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
              <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            </div>
            <div style="background: #0a0a23; padding: 20px; text-align: center;">
              <p style="color: #d4af37; margin: 0; font-size: 14px;">Sapphura - Luxury E-Commerce</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        message: 'OTP sent to your email',
        otp: generatedOTP,
        expiry: expiry.toISOString()
      });
    }

    if (action === 'verify') {
      if (!otp || !orderId) {
        return NextResponse.json({ error: 'OTP and order ID are required' }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        orderId
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('OTP Error:', error);
    return NextResponse.json({ error: 'Failed to process OTP' }, { status: 500 });
  }
}
