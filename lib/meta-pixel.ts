declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type MetaContent = {
  id: string;
  quantity: number;
};

export function trackMetaEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    return;
  }

  window.fbq('track', eventName, parameters || {});
}

export function buildMetaCartPayload(items: MetaContent[], value: number) {
  return {
    content_type: 'product',
    content_ids: items.map((item) => item.id),
    contents: items,
    currency: 'USD',
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    value,
  };
}