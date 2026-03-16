export function normalizePkPhone(value: string): string {
  const raw = value.replace(/\D/g, '');
  if (raw.startsWith('92')) return `+${raw}`;
  if (raw.startsWith('0')) return `+92${raw.slice(1)}`;
  if (raw.length === 10) return `+92${raw}`;
  return value.startsWith('+') ? value : `+${raw}`;
}

export async function sendWhatsAppOtp(options: {
  to: string;
  otp: string;
  name?: string;
}): Promise<{ sent: boolean; provider: 'twilio-whatsapp' | 'none'; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    return { sent: false, provider: 'none', error: 'Twilio WhatsApp credentials are not configured' };
  }

  try {
    const toPhone = normalizePkPhone(options.to);
    const body = `Your Sapphura OTP is ${options.otp}. It expires in 10 minutes. Do not share this code.`;

    const form = new URLSearchParams();
    form.set('From', from.startsWith('whatsapp:') ? from : `whatsapp:${from}`);
    form.set('To', toPhone.startsWith('whatsapp:') ? toPhone : `whatsapp:${toPhone}`);
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
      return { sent: false, provider: 'twilio-whatsapp', error: text };
    }

    return { sent: true, provider: 'twilio-whatsapp' };
  } catch (error) {
    return {
      sent: false,
      provider: 'twilio-whatsapp',
      error: error instanceof Error ? error.message : 'Unknown WhatsApp error',
    };
  }
}
