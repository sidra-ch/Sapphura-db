import crypto from 'crypto';

type PaymentProvider = 'jazzcash' | 'easypaisa';

type ProviderConfigStatus = {
  available: boolean;
  missing: string[];
};

type InitiatePayload = {
  amount: number;
  email: string;
  phone: string;
  merchantReference: string;
  callbackUrl: string;
  returnUrl?: string;
};

type InitiateResult = {
  providerTransactionId?: string;
  paymentUrl?: string;
  status: 'initiated' | 'pending' | 'failed';
  raw: unknown;
};

type ReconcileResult = {
  status: 'paid' | 'failed' | 'pending';
  raw: unknown;
};

function hmacSha256(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function safeTimingCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function getPaymentProviderConfig(provider: PaymentProvider): ProviderConfigStatus {
  const requiredVars = provider === 'jazzcash'
    ? ['JAZZCASH_INITIATE_URL', 'JAZZCASH_STATUS_URL', 'JAZZCASH_INTEGRITY_SALT']
    : ['EASYPAISA_INITIATE_URL', 'EASYPAISA_STATUS_URL', 'EASYPAISA_SECRET'];

  const missing = requiredVars.filter((name) => !process.env[name]);

  return {
    available: missing.length === 0,
    missing,
  };
}

export async function initiateProviderPayment(
  provider: PaymentProvider,
  payload: InitiatePayload
): Promise<InitiateResult> {
  const endpoint = requireEnv(
    provider === 'jazzcash' ? 'JAZZCASH_INITIATE_URL' : 'EASYPAISA_INITIATE_URL'
  );
  const secret = requireEnv(
    provider === 'jazzcash' ? 'JAZZCASH_INTEGRITY_SALT' : 'EASYPAISA_SECRET'
  );

  const requestBody = {
    merchantReference: payload.merchantReference,
    amount: payload.amount,
    currency: 'PKR',
    email: payload.email,
    phone: payload.phone,
    callbackUrl: payload.callbackUrl,
    returnUrl: payload.returnUrl,
    redirectUrl: payload.returnUrl,
    timestamp: new Date().toISOString(),
    provider,
  };

  const signature = hmacSha256(JSON.stringify(requestBody), secret);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': signature,
    },
    body: JSON.stringify(requestBody),
  });

  const raw = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      status: 'failed',
      raw,
    };
  }

  return {
    providerTransactionId: raw.transactionId || raw.providerTransactionId,
    paymentUrl: raw.paymentUrl || raw.redirectUrl,
    status: raw.status === 'failed' ? 'failed' : 'initiated',
    raw,
  };
}

export async function reconcileProviderPayment(
  provider: PaymentProvider,
  merchantReference: string
): Promise<ReconcileResult> {
  const endpoint = requireEnv(
    provider === 'jazzcash' ? 'JAZZCASH_STATUS_URL' : 'EASYPAISA_STATUS_URL'
  );
  const secret = requireEnv(
    provider === 'jazzcash' ? 'JAZZCASH_INTEGRITY_SALT' : 'EASYPAISA_SECRET'
  );

  const payload = { merchantReference, provider };
  const signature = hmacSha256(JSON.stringify(payload), secret);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': signature,
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.json().catch(() => ({}));

  if (!response.ok) {
    return { status: 'pending', raw };
  }

  const normalized = String(raw.status || '').toLowerCase();
  if (['paid', 'success', 'completed'].includes(normalized)) {
    return { status: 'paid', raw };
  }
  if (['failed', 'rejected', 'cancelled'].includes(normalized)) {
    return { status: 'failed', raw };
  }

  return { status: 'pending', raw };
}

export function verifyCallbackSignature(
  provider: PaymentProvider,
  body: string,
  signatureHeader: string | null,
  timestampHeader?: string | null
): boolean {
  if (!signatureHeader) return false;

  const secret =
    provider === 'jazzcash'
      ? process.env.JAZZCASH_INTEGRITY_SALT
      : process.env.EASYPAISA_SECRET;

  if (!secret) return false;

  const normalizedSig = signatureHeader.trim();
  const expectedRaw = hmacSha256(body, secret);
  if (safeTimingCompare(expectedRaw, normalizedSig)) {
    return true;
  }

  if (timestampHeader) {
    const expectedTimestamped = hmacSha256(`${timestampHeader}.${body}`, secret);
    if (safeTimingCompare(expectedTimestamped, normalizedSig)) {
      return true;
    }
  }

  return false;
}

export function isWebhookTimestampFresh(
  timestampHeader: string | null,
  maxAgeMs = 15 * 60 * 1000
): boolean {
  if (!timestampHeader) {
    return true;
  }

  const raw = timestampHeader.trim();
  let timestampMs = Number(raw);

  if (!Number.isFinite(timestampMs)) {
    timestampMs = Date.parse(raw);
  } else if (timestampMs < 1_000_000_000_000) {
    timestampMs *= 1000;
  }

  if (!Number.isFinite(timestampMs)) {
    return false;
  }

  const now = Date.now();
  const futureToleranceMs = 5 * 60 * 1000;
  return timestampMs <= now + futureToleranceMs && now - timestampMs <= maxAgeMs;
}

export function extractStatus(raw: Record<string, unknown>): 'paid' | 'failed' | 'pending' {
  const value = String(raw.status || raw.paymentStatus || '').toLowerCase();
  if (['paid', 'success', 'completed'].includes(value)) return 'paid';
  if (['failed', 'rejected', 'cancelled'].includes(value)) return 'failed';
  return 'pending';
}
