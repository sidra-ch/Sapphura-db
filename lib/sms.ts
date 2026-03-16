import { normalizePkPhone } from './whatsapp';

export async function sendSmsOtp(options: {
  to: string;
  otp: string;
  name?: string;
}): Promise<{ sent: boolean; provider: 'twilio-sms' | 'none'; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_SMS_FROM;

  if (!accountSid || !authToken || !from) {
    return { sent: false, provider: 'none', error: 'Twilio SMS credentials are not configured' };
  }

  try {
    const toPhone = normalizePkPhone(options.to);
    const body = `Your Sapphura OTP is ${options.otp}. It expires in 10 minutes. Do not share this code.`;

    const form = new URLSearchParams();
    form.set('From', from);
    form.set('To', toPhone);
    form.set('Body', body);

    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      return { sent: false, provider: 'twilio-sms', error: text };
    }

    return { sent: true, provider: 'twilio-sms' };
  } catch (error) {
    return {
      sent: false,
      provider: 'twilio-sms',
      error: error instanceof Error ? error.message : 'Unknown SMS error',
    };
  }
}
