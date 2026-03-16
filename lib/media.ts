export const FALLBACK_PRODUCT_IMAGE =
  'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635069/neckles-1_rbhzgd.jpg';

export function parseMediaList(value: string | null | undefined): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
        .map((item) => (item.startsWith('/') || item.startsWith('http') ? item : `/${item}`));
    }
  } catch {
    // fall through to plain string handling
  }

  const single = value.trim();
  if (!single) return [];
  return [single.startsWith('/') || single.startsWith('http') ? single : `/${single}`];
}

export function getPrimaryMedia(value: string | null | undefined): string {
  const list = parseMediaList(value);
  return list[0] || FALLBACK_PRODUCT_IMAGE;
}
