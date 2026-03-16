interface AddressInput {
  address: string;
  city: string;
  country?: string;
  postalCode?: string;
}

interface NormalizedAddress {
  line1: string;
  city: string;
  country: string;
  postalCode: string;
  fullAddress: string;
}

function sanitizePart(value: string): string {
  return value
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeShippingAddress(input: AddressInput): NormalizedAddress {
  const line1 = sanitizePart(String(input.address || ''));
  const city = sanitizePart(String(input.city || ''));
  const country = sanitizePart(String(input.country || 'Pakistan')) || 'Pakistan';
  const postalCode = sanitizePart(String(input.postalCode || ''));

  const parts = [line1, city, country, postalCode].filter(Boolean);

  return {
    line1,
    city,
    country,
    postalCode,
    fullAddress: parts.join(', '),
  };
}
