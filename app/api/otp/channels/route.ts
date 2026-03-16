import { NextResponse } from 'next/server';
import { getTwilioBaseConfig, getTwilioSmsFrom, getTwilioWhatsAppFrom } from '../../../../lib/twilio-config';

export async function GET() {
  const base = getTwilioBaseConfig();
  const sms = getTwilioSmsFrom();
  const whatsapp = getTwilioWhatsAppFrom();

  const twilioBaseConfigured = Boolean(base.accountSid && base.authToken);
  const smsConfigured = twilioBaseConfigured && Boolean(sms.from);
  const whatsappConfigured = twilioBaseConfigured && Boolean(whatsapp.from);

  return NextResponse.json({
    channels: {
      email: true,
      sms: smsConfigured,
      whatsapp: whatsappConfigured,
    },
    missing: {
      base: base.missing,
      sms: sms.missing,
      whatsapp: whatsapp.missing,
    },
    notes: {
      whatsappFrom: whatsapp.from ? 'configured' : 'missing',
      smsFrom: sms.from ? 'configured' : 'missing',
    },
  });
}
