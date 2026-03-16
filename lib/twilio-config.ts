function cleanEnv(value: string | undefined): string {
  if (!value) return '';
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function normalizePhoneLike(value: string): string {
  const cleaned = cleanEnv(value);
  if (!cleaned) return '';
  if (cleaned.startsWith('whatsapp:')) {
    return cleaned;
  }

  const raw = cleaned.replace(/[^\d+]/g, '');
  if (!raw) return '';
  if (raw.startsWith('+')) return raw;
  return `+${raw}`;
}

function normalizeWhatsappFrom(value: string): string {
  const cleaned = cleanEnv(value);
  if (!cleaned) return '';

  if (cleaned.startsWith('whatsapp:')) {
    const suffix = cleaned.slice('whatsapp:'.length);
    const normalized = normalizePhoneLike(suffix);
    return normalized ? `whatsapp:${normalized}` : '';
  }

  const normalized = normalizePhoneLike(cleaned);
  return normalized ? `whatsapp:${normalized}` : '';
}

function pickEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = cleanEnv(process.env[key]);
    if (value) return value;
  }
  return '';
}

export function getTwilioBaseConfig() {
  const accountSid = pickEnv('TWILIO_ACCOUNT_SID');
  const authToken = pickEnv('TWILIO_AUTH_TOKEN');

  return {
    accountSid,
    authToken,
    missing: [
      ...(accountSid ? [] : ['TWILIO_ACCOUNT_SID']),
      ...(authToken ? [] : ['TWILIO_AUTH_TOKEN']),
    ],
  };
}

export function getTwilioSmsFrom() {
  const from = normalizePhoneLike(pickEnv('TWILIO_SMS_FROM', 'TWILIO_PHONE_NUMBER', 'TWILIO_FROM_NUMBER'));
  return {
    from,
    missing: from ? [] : ['TWILIO_SMS_FROM (or TWILIO_PHONE_NUMBER)'],
  };
}

export function getTwilioWhatsAppFrom() {
  const from = normalizeWhatsappFrom(pickEnv('TWILIO_WHATSAPP_FROM', 'TWILIO_WHATSAPP_NUMBER'));
  return {
    from,
    missing: from ? [] : ['TWILIO_WHATSAPP_FROM'],
  };
}
