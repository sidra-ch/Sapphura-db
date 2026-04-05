"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Truck, Home, Package, Clock3 } from 'lucide-react';
import { formatCurrency } from '../../lib/currency';
import { buildMetaCartPayload, trackMetaEvent } from '../../lib/meta-pixel';

interface OrderDetails {
  orderId: string;
  orderLookupId?: string;
  legacyOrderId?: number;
  state?: 'confirmed' | 'pending_payment';
  paymentMethod?: string;
  paymentStatus?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
}

export default function OrderConfirmationPageClient() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const urlOrderId = searchParams.get('order')?.trim() || '';
  const urlLookupId = searchParams.get('lookup')?.trim() || '';
  const urlProvider = searchParams.get('provider')?.trim() || '';
  const urlState = searchParams.get('state')?.trim() === 'pending_payment' ? 'pending_payment' : undefined;

  const syncStoredOrder = (updater: (current: OrderDetails) => OrderDetails) => {
    setOrder((current) => {
      if (!current) {
        return current;
      }

      const next = updater(current);
      localStorage.setItem('lastOrder', JSON.stringify(next));
      return next;
    });
  };

  const checkPaymentStatus = useCallback(async () => {
    if (!order?.orderLookupId || order.state !== 'pending_payment') {
      return;
    }

    setIsCheckingStatus(true);
    setStatusMessage('Checking payment status...');

    try {
      const response = await fetch(`/api/orders/${order.orderLookupId}/status`, { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok || !data?.order) {
        setStatusMessage(data?.error || 'Unable to fetch payment status right now.');
        return;
      }

      const nextPaymentStatus = String(data.order.paymentStatus || '').toLowerCase();
      const nextOrderStatus = String(data.order.status || '').toLowerCase();

      syncStoredOrder((current) => ({
        ...current,
        paymentStatus: data.order.paymentStatus,
        paymentMethod: data.order.paymentMethod || current.paymentMethod,
        state: nextPaymentStatus === 'paid' || nextOrderStatus === 'paid' ? 'confirmed' : current.state,
      }));

      if (nextPaymentStatus === 'paid' || nextOrderStatus === 'paid') {
        setStatusMessage('Payment confirmed. Your order is now fully confirmed.');
        return;
      }

      if (nextPaymentStatus === 'failed') {
        setStatusMessage('Payment failed or was declined. You can try again from support or contact the team.');
        return;
      }

      setStatusMessage('Payment is still pending with the provider.');
    } catch {
      setStatusMessage('Unable to fetch payment status right now.');
    } finally {
      setIsCheckingStatus(false);
    }
  }, [order]);

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    let resolvedOrder: OrderDetails | null = null;

    if (storedOrder) {
      try {
        resolvedOrder = JSON.parse(storedOrder);
      } catch (error) {
        console.error('Error parsing order:', error);
      }
    }

    if (resolvedOrder && (urlOrderId || urlLookupId || urlState)) {
      resolvedOrder = {
        ...resolvedOrder,
        orderId: urlOrderId || resolvedOrder.orderId,
        orderLookupId: urlLookupId || resolvedOrder.orderLookupId,
        paymentMethod: urlProvider || resolvedOrder.paymentMethod,
        state: urlState || resolvedOrder.state,
      };
    }

    if (!resolvedOrder && (urlOrderId || urlLookupId)) {
      resolvedOrder = {
        orderId: urlOrderId || urlLookupId,
        orderLookupId: urlLookupId || undefined,
        state: urlState || 'pending_payment',
        paymentMethod: urlProvider || undefined,
        paymentStatus: 'pending',
        items: [],
        total: 0,
        shippingAddress: {
          name: '',
          phone: '',
          address: '',
          city: '',
        },
      };
    }

    if (resolvedOrder) {
      localStorage.setItem('lastOrder', JSON.stringify(resolvedOrder));
      setOrder(resolvedOrder);
    }

    setIsLoading(false);
  }, [urlLookupId, urlOrderId, urlProvider, urlState]);

  useEffect(() => {
    if (!order || order.state !== 'confirmed') {
      return;
    }

    const purchaseKey = `meta-purchase-${order.orderId}`;
    if (sessionStorage.getItem(purchaseKey)) {
      return;
    }

    trackMetaEvent(
      'Purchase',
      buildMetaCartPayload(
        order.items.map((item) => ({ id: item.id, quantity: item.quantity })),
        order.total
      )
    );
    sessionStorage.setItem(purchaseKey, '1');
  }, [order]);

  useEffect(() => {
    if (!order?.orderLookupId || order.state !== 'pending_payment') {
      return;
    }

    void checkPaymentStatus();
    const interval = window.setInterval(() => {
      void checkPaymentStatus();
    }, 10000);

    return () => window.clearInterval(interval);
  }, [checkPaymentStatus, order?.orderLookupId, order?.state]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0a23] to-[#1a1a40]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] px-4">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-24 w-24 text-gold" />
          <h1 className="mb-4 text-3xl font-bold text-gold">No Order Found</h1>
          <p className="mb-8 text-white/70">You haven't placed any order yet.</p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-bold text-[#0a0a23] transition hover:bg-yellow-400">
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const isPendingPayment = order.state === 'pending_payment';
  const hasShippingSummary = Boolean(
    order.shippingAddress.name || order.shippingAddress.phone || order.shippingAddress.address || order.shippingAddress.city
  );
  const hasOrderItems = order.items.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-12 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${isPendingPayment ? 'bg-amber-500' : 'bg-green-500'}`}>
            {isPendingPayment ? <Clock3 className="h-16 w-16 text-white" /> : <CheckCircle className="h-16 w-16 text-white" />}
          </motion.div>
          <h1 className="mb-4 text-4xl font-bold text-gold">{isPendingPayment ? 'Payment Pending' : 'Order Confirmed!'}</h1>
          <p className="text-lg text-white/70">{isPendingPayment ? 'Your order has been created and is waiting for payment confirmation.' : 'Thank you for your purchase at Sapphura'}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6 rounded-2xl border border-gold bg-[#1a1a40] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Order Number</p>
              <p className="text-xl font-bold text-gold">#{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">{isPendingPayment ? 'Payment Status' : 'Estimated Delivery'}</p>
              <p className="font-semibold text-white">{isPendingPayment ? 'Awaiting provider confirmation' : estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[#0a0a23] p-4">
            <Truck className="h-6 w-6 text-gold" />
            <div>
              <p className="font-medium text-white">{isPendingPayment ? 'Payment request initiated' : 'Order verified and processing'}</p>
              <p className="text-sm text-white/60">{isPendingPayment ? 'Complete the wallet payment, then we will confirm your order automatically.' : 'Identity, payment, and fraud checks completed successfully'}</p>
            </div>
          </div>

          {isPendingPayment ? (
            <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/10 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">Pending wallet payment</p>
                  <p className="text-sm text-white/60">We will keep checking for payment confirmation.</p>
                  {statusMessage ? <p className="mt-2 text-sm text-[#f7e4a6]">{statusMessage}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => void checkPaymentStatus()}
                  disabled={isCheckingStatus}
                  className="rounded-lg border border-gold px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-[#0a0a23] disabled:opacity-50"
                >
                  {isCheckingStatus ? 'Checking...' : 'Check Payment Status'}
                </button>
              </div>
            </div>
          ) : null}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6 rounded-2xl border border-gold bg-[#1a1a40] p-6">
          <h2 className="mb-4 text-xl font-bold text-gold">Shipping Address</h2>
          {hasShippingSummary ? (
            <div className="text-white/80">
              <p className="font-semibold">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}</p>
            </div>
          ) : (
            <p className="text-sm text-white/60">Shipping details will appear here once this browser syncs the latest order data.</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-6 rounded-2xl border border-gold bg-[#1a1a40] p-6">
          <h2 className="mb-4 text-xl font-bold text-gold">Order Summary</h2>
          {hasOrderItems ? (
            <>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-gold/20 pt-4">
                <div className="flex justify-between text-lg">
                  <span className="text-white/80">Total</span>
                  <span className="text-xl font-bold text-gold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-white/60">Order line items will appear here once this browser syncs the latest order data.</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col gap-4 sm:flex-row">
          <Link href="/" className="flex-1">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 font-bold text-[#0a0a23] transition hover:bg-yellow-400">
              <Home className="h-5 w-5" />
              Continue Shopping
            </button>
          </Link>
          <Link href="/account" className="flex-1">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold py-3 font-bold text-gold transition hover:bg-gold hover:text-[#0a0a23]">
              <ShoppingBag className="h-5 w-5" />
              {isPendingPayment ? 'Track Order Status' : 'View Orders'}
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}