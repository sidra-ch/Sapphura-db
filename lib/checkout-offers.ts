type CheckoutOfferDefinition = {
  code: string
  discountType: 'percent'
  amount: number
  minSubtotal: number
}

const CHECKOUT_OFFERS: Record<string, CheckoutOfferDefinition> = {
  SARPHURA10: {
    code: 'SARPHURA10',
    discountType: 'percent',
    amount: 10,
    minSubtotal: 0,
  },
  EID20: {
    code: 'EID20',
    discountType: 'percent',
    amount: 20,
    minSubtotal: 0,
  },
}

function roundMoney(value: number): number {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

export function calculateShippingCost(shippingMethod: string | undefined): number {
  return shippingMethod === 'express' ? 25 : 0
}

export function resolveCheckoutOffer(couponCode: string | null | undefined, subtotal: number) {
  const normalizedCode = String(couponCode || '').trim().toUpperCase()

  if (!normalizedCode) {
    return {
      couponCode: '',
      discount: 0,
      error: '',
    }
  }

  const offer = CHECKOUT_OFFERS[normalizedCode]
  if (!offer) {
    return {
      couponCode: '',
      discount: 0,
      error: 'Invalid coupon code',
    }
  }

  if (subtotal < offer.minSubtotal) {
    return {
      couponCode: '',
      discount: 0,
      error: `Coupon requires a minimum subtotal of $${offer.minSubtotal.toFixed(2)}`,
    }
  }

  const discount = offer.discountType === 'percent'
    ? roundMoney(subtotal * (offer.amount / 100))
    : 0

  return {
    couponCode: offer.code,
    discount,
    error: '',
  }
}

export function calculateOrderTotal(subtotal: number, shippingCost: number, discount: number): number {
  return roundMoney(Math.max(0, subtotal + shippingCost - discount))
}
