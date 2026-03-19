import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    channels: {
      email: true,
      sms: false,
      whatsapp: false,
    },
    missing: {
      base: ['Twilio removed'],
      sms: ['Twilio removed'],
      whatsapp: ['Twilio removed'],
    },
    notes: {
      whatsappFrom: 'disabled',
      smsFrom: 'disabled',
    },
  });
}
