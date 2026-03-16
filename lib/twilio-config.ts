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

export interface TwilioBaseConfig {
  accountSid: string;
  authUsername: string;
  authPassword: string;
  authMode: 'auth-token' | 'api-key' | 'none';
  missing: string[];
}

export function getTwilioBaseConfig(): TwilioBaseConfig {
  const accountSid = pickEnv('TWILIO_ACCOUNT_SID', 'TWILIO_MAIN_ACCOUNT_SID');
  const authToken = pickEnv('TWILIO_AUTH_TOKEN');
  const apiKeySid = pickEnv('TWILIO_API_KEY_SID', 'TWILIO_KEY_SID');
  const apiKeySecret = pickEnv('TWILIO_API_KEY_SECRET', 'TWILIO_API_SECRET', 'TWILIO_KEY_SECRET');

  if (accountSid && authToken) {
    return {
      accountSid,
      authUsername: accountSid,
      authPassword: authToken,
      authMode: 'auth-token',
      missing: [],
    };
  }

  if (accountSid && apiKeySid && apiKeySecret) {
    return {
      accountSid,
      authUsername: apiKeySid,
      authPassword: apiKeySecret,
      authMode: 'api-key',
      missing: [],
    };
  }

  const missing: string[] = [];
  if (!accountSid) {
    missing.push('TWILIO_ACCOUNT_SID (or TWILIO_MAIN_ACCOUNT_SID)');
  }

  if (!authToken && !(apiKeySid && apiKeySecret)) {
    missing.push('TWILIO_AUTH_TOKEN or (TWILIO_API_KEY_SID + TWILIO_API_KEY_SECRET)');
  }

  if ((apiKeySid && !apiKeySecret) || (!apiKeySid && apiKeySecret)) {
    missing.push('TWILIO_API_KEY_SID and TWILIO_API_KEY_SECRET must be set together');
  }

  return {
    accountSid,
    authUsername: '',
    authPassword: '',
    authMode: 'none',
    missing,
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
