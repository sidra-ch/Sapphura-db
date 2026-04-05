"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../lib/currency';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface BillingDetailsInput {
  email?: string;
  fullName?: string;
  phone?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  addressLine1?: string;
}

interface CheckoutSuccessPayload {
  paymentIntentId: string;
  status: string;
  amount: number;
}

function CheckoutForm({
  amount,
  billingDetails,
  onSuccess,
  onCancel,
}: {
  amount: number;
  billingDetails?: BillingDetailsInput;
  onSuccess: (payload: CheckoutSuccessPayload) => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          email: billingDetails?.email,
          orderFingerprint: `${billingDetails?.email || 'guest'}-${Math.round(amount * 100)}`,
        }),
      });

      const { clientSecret, error: apiError } = await res.json();

      if (apiError) {
        setError(apiError);
        setLoading(false);
        return;
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card element not found');
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails?.fullName,
            email: billingDetails?.email,
            phone: billingDetails?.phone,
            address: {
              city: billingDetails?.city,
              country: billingDetails?.country,
              postal_code: billingDetails?.postalCode,
              line1: billingDetails?.addressLine1,
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess({
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          amount,
        });
      } else {
        setError('Payment requires additional action or is not completed yet.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#0a0a23] p-4 rounded-lg border border-gold/30">
        <CardElement
          options={{
            style: {
              base: {
                color: '#ffffff',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#fa755a', iconColor: '#fa755a' },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gold/30 text-white rounded-lg hover:bg-gold/10 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 py-3 bg-gold text-[#0a0a23] rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#0a0a23] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay {formatCurrency(amount)}
            </>
          )}
        </button>
      </div>

      <p className="text-white/50 text-xs text-center">
        Your payment is secured with Stripe encryption
      </p>
    </form>
  );
}

interface StripePaymentProps {
  amount: number;
  billingDetails?: BillingDetailsInput;
  onSuccess: (payload: CheckoutSuccessPayload) => void;
  onCancel: () => void;
}

export default function StripePayment({ amount, billingDetails, onSuccess, onCancel }: StripePaymentProps) {
  if (!stripePromise) {
    return (
      <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
        Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY before enabling card payments.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} billingDetails={billingDetails} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}