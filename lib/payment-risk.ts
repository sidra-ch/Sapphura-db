import prisma from './db';

export type PaymentMethod = 'cod' | 'card' | 'jazzcash' | 'easypaisa';

export interface CheckoutRiskInput {
  email: string;
  phone: string;
  ip: string;
  paymentMethod: PaymentMethod;
  total: number;
  itemCount: number;
  otpVerifiedAt?: string;
  cardAuthorizedAt?: string;
}

export interface CheckoutRiskResult {
  score: number;
  level: 'low' | 'medium' | 'high';
  flags: string[];
  externalProviderUsed: boolean;
}

function classify(score: number): 'low' | 'medium' | 'high' {
  if (score >= 70) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

async function fetchExternalRiskSignal(input: CheckoutRiskInput): Promise<number | null> {
  const endpoint = process.env.FRAUD_PROVIDER_ENDPOINT;
  if (!endpoint) return null;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.FRAUD_PROVIDER_API_KEY
          ? { Authorization: `Bearer ${process.env.FRAUD_PROVIDER_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        email: input.email,
        phone: input.phone,
        ip: input.ip,
        paymentMethod: input.paymentMethod,
        amount: input.total,
        itemCount: input.itemCount,
      }),
    });

    if (!response.ok) return null;

    const payload = await response.json().catch(() => ({}));
    const score = Number(payload.riskScore);
    if (!Number.isFinite(score)) return null;

    return Math.max(0, Math.min(100, score));
  } catch {
    return null;
  }
}

export async function evaluateCheckoutRisk(input: CheckoutRiskInput): Promise<CheckoutRiskResult> {
  let score = 0;
  const flags: string[] = [];

  if (!input.otpVerifiedAt) {
    score += 30;
    flags.push('missing_otp_proof');
  }

  if (input.paymentMethod === 'card' && !input.cardAuthorizedAt) {
    score += 40;
    flags.push('missing_card_authorization');
  }

  if (input.total >= 1000) {
    score += 20;
    flags.push('high_order_value');
  }

  if (input.itemCount >= 8) {
    score += 10;
    flags.push('large_basket_size');
  }

  const suspiciousDomain = /(mailinator|10minutemail|tempmail|guerrillamail)\./i.test(input.email);
  if (suspiciousDomain) {
    score += 20;
    flags.push('disposable_email_domain');
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentOrderCount = await prisma.order.count({
    where: {
      user: { email: input.email },
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentOrderCount >= 4) {
    score += 25;
    flags.push('high_order_velocity_email');
  }

  const recentFailedPayments = await prisma.paymentTransaction.count({
    where: {
      status: 'failed',
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentFailedPayments >= 5) {
    score += 10;
    flags.push('elevated_global_payment_failures');
  }

  const externalScore = await fetchExternalRiskSignal(input);
  const externalProviderUsed = externalScore !== null;
  if (externalScore !== null) {
    score = Math.round(score * 0.7 + externalScore * 0.3);
    if (externalScore >= 70) {
      flags.push('external_provider_high_risk');
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    level: classify(score),
    flags,
    externalProviderUsed,
  };
}
