"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Truck, Mail, ArrowRight, Home, Package } from 'lucide-react';

interface OrderDetails {
  orderId: string;
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

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      try {
        setOrder(JSON.parse(storedOrder));
      } catch (e) {
        console.error('Error parsing order:', e);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="w-24 h-24 text-gold mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gold mb-4">No Order Found</h1>
          <p className="text-white/70 mb-8">You haven't placed any order yet.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-gold text-[#0a0a23] px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gold mb-4">Order Confirmed!</h1>
          <p className="text-white/70 text-lg">Thank you for your purchase at Sapphura</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1a1a40] border border-gold rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/60 text-sm">Order Number</p>
              <p className="text-gold font-bold text-xl">#{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Estimated Delivery</p>
              <p className="text-white font-semibold">{estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#0a0a23] rounded-xl">
            <Truck className="w-6 h-6 text-gold" />
            <div>
              <p className="text-white font-medium">Order is being processed</p>
              <p className="text-white/60 text-sm">You will receive updates via email</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1a1a40] border border-gold rounded-2xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gold mb-4">Shipping Address</h2>
          <div className="text-white/80">
            <p className="font-semibold">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1a1a40] border border-gold rounded-2xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="text-gold font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gold/20 mt-4 pt-4">
            <div className="flex justify-between text-lg">
              <span className="text-white/80">Total</span>
              <span className="text-gold font-bold text-xl">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-gold text-[#0a0a23] py-3 rounded-lg font-bold hover:bg-yellow-400 transition">
              <Home className="w-5 h-5" />
              Continue Shopping
            </button>
          </Link>
          <Link href="/account" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 border border-gold text-gold py-3 rounded-lg font-bold hover:bg-gold hover:text-[#0a0a23] transition">
              <ShoppingBag className="w-5 h-5" />
              View Orders
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
