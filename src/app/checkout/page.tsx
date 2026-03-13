"use client";
import React, { useState } from "react";

export default function CheckoutPage() {
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-[#0a0a23] py-16 px-4 md:px-16">
      <div className="max-w-3xl mx-auto bg-[#1a1a40] rounded-xl shadow-xl p-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gold mb-8 text-center">Checkout</h1>
        <form className="mb-8 grid grid-cols-1 gap-6">
          <input name="name" value={shipping.name} onChange={handleChange} placeholder="Full Name" className="rounded bg-black/60 text-gold border border-gold p-3" />
          <input name="address" value={shipping.address} onChange={handleChange} placeholder="Address" className="rounded bg-black/60 text-gold border border-gold p-3" />
          <input name="city" value={shipping.city} onChange={handleChange} placeholder="City" className="rounded bg-black/60 text-gold border border-gold p-3" />
          <input name="postal" value={shipping.postal} onChange={handleChange} placeholder="Postal Code" className="rounded bg-black/60 text-gold border border-gold p-3" />
          <input name="phone" value={shipping.phone} onChange={handleChange} placeholder="Phone Number" className="rounded bg-black/60 text-gold border border-gold p-3" />
        </form>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gold mb-4">Order Summary</h2>
          {/* Demo order summary */}
          <div className="bg-black/60 rounded p-4 text-white">
            <div className="flex justify-between mb-2"><span>Luxury Necklace</span><span>Rs. 3999</span></div>
            <div className="flex justify-between mb-2"><span>Gold Ring</span><span>Rs. 1499</span></div>
            <div className="flex justify-between font-bold text-gold"><span>Total</span><span>Rs. 5498</span></div>
          </div>
        </div>
        <button className="w-full px-6 py-3 rounded-full bg-green-500 text-white font-semibold shadow hover:bg-green-400 transition text-xl">Pay with Stripe</button>
      </div>
    </main>
  );
}
