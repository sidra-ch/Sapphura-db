<?php

namespace App\Services;

class CheckoutOfferService
{
    private const CHECKOUT_OFFERS = [
        'SARPHURA10' => [
            'code' => 'SARPHURA10',
            'discountType' => 'percent',
            'amount' => 10,
            'minSubtotal' => 0,
        ],
        'EID20' => [
            'code' => 'EID20',
            'discountType' => 'percent',
            'amount' => 20,
            'minSubtotal' => 0,
        ],
    ];

    public static function roundMoney(float $value): float
    {
        return round((float) $value + PHP_FLOAT_EPSILON, 2);
    }

    public static function calculateShippingCost(?string $shippingMethod): float
    {
        return $shippingMethod === 'express' ? 25.0 : 0.0;
    }

    public static function resolveCheckoutOffer(?string $couponCode, float $subtotal): array
    {
        $normalizedCode = strtoupper(trim((string) ($couponCode ?? '')));

        if ($normalizedCode === '') {
            return [
                'couponCode' => '',
                'discount' => 0.0,
                'error' => '',
            ];
        }

        $offer = self::CHECKOUT_OFFERS[$normalizedCode] ?? null;
        if (!$offer) {
            return [
                'couponCode' => '',
                'discount' => 0.0,
                'error' => 'Invalid coupon code',
            ];
        }

        if ($subtotal < $offer['minSubtotal']) {
            return [
                'couponCode' => '',
                'discount' => 0.0,
                'error' => sprintf('Coupon requires a minimum subtotal of Rs. %.2f', $offer['minSubtotal']),
            ];
        }

        $discount = $offer['discountType'] === 'percent'
            ? self::roundMoney($subtotal * ($offer['amount'] / 100))
            : 0.0;

        return [
            'couponCode' => $offer['code'],
            'discount' => $discount,
            'error' => '',
        ];
    }

    public static function calculateOrderTotal(float $subtotal, float $shippingCost, float $discount): float
    {
        return self::roundMoney(max(0, $subtotal + $shippingCost - $discount));
    }
}
