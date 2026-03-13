"use client";
import React from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Dummy cart items (replace with real cart logic)
const cartItems = [
  {
    id: 1,
    name: "Gold Crescent Necklace",
    price: 299,
    imageUrl:
      "https://res.cloudinary.com/dwmxdyvd2/image/upload/sapphura/products/gold-crescent-necklace.jpg",
    quantity: 1,
  },
  {
    id: 2,
    name: "Navy Velvet Abaya",
    price: 189,
    imageUrl:
      "https://res.cloudinary.com/dwmxdyvd2/image/upload/sapphura/products/navy-velvet-abaya.jpg",
    quantity: 2,
  },
];

export default function CartPage() {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-20 px-4 md:px-24">
      <div className="max-w-5xl mx-auto bg-[#18182f] rounded-3xl shadow-2xl p-12 border-4 border-gold">
        <h1 className="text-5xl font-extrabold text-gold mb-12 flex items-center gap-6">
          <ShoppingCart className="w-10 h-10 text-gold" /> Your Cart
        </h1>
        {cartItems.length === 0 ? (
          <div className="text-center text-white/80 text-2xl py-32">
            Your cart is empty.
            <Link href="/collections">
              <Button className="mt-10 bg-gold text-[#0a0a23] text-xl font-bold py-4 px-8 rounded-full shadow-xl hover:bg-yellow-400 transition">
                Shop Collections
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-[#23234a] border-2 border-gold rounded-2xl p-8 shadow-xl gap-10"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={160}
                  height={160}
                  className="rounded-xl object-cover border-2 border-gold shadow-lg"
                />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gold mb-4 drop-shadow-lg">
                    {item.name}
                  </h2>
                  <div className="text-white/90 mb-4 text-xl">Rs. {item.price}</div>
                  <div className="text-white/70 mb-2 text-lg">Qty: {item.quantity}</div>
                  <span className="bg-gold text-[#0a0a23] font-bold px-4 py-2 rounded-full text-base shadow">In Stock</span>
                </div>
                <Button variant="destructive" size="icon" title="Remove" className="bg-black/60 p-4 rounded-full text-gold hover:text-red-500 transition">
                  <Trash2 className="w-7 h-7" />
                </Button>
              </div>
            ))}
            <div className="flex justify-end mt-12">
              <div className="text-4xl font-bold text-gold">Total: Rs. {total}</div>
            </div>
            <div className="flex justify-end gap-8 mt-12">
              <Button className="px-10 py-4 rounded-full bg-gold text-[#0a0a23] font-bold text-2xl shadow-xl hover:bg-yellow-400 transition">Checkout</Button>
              <Button className="px-10 py-4 rounded-full bg-black/60 text-gold font-bold text-2xl shadow-xl hover:text-red-500 transition">Continue Shopping</Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
