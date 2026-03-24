export const FALLBACK_PRODUCT_IMAGE =
  'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635069/neckles-1_rbhzgd.jpg';

export function isVideoUrl(value: string | null | undefined): boolean {
  if (!value) return false;

  const normalized = value.toLowerCase();
  return normalized.includes('/video/upload/') || /\.(mp4|mov|webm|ogg|m4v|avi)(\?|$)/i.test(normalized);
}

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

export function getPrimaryImageFromList(items: string[]): string {
  const normalizedItems = items.filter(Boolean);
  const firstImage = normalizedItems.find((item) => !isVideoUrl(item));
  return firstImage || normalizedItems[0] || FALLBACK_PRODUCT_IMAGE;
}

export function getPrimaryMedia(value: string | null | undefined): string {
  return getPrimaryImageFromList(parseMediaList(value));
}
