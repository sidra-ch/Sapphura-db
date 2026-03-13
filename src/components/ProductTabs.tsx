import React, { useState } from "react";

export default function ProductTabs({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState("Description");
  return (
    <div className="max-w-6xl mx-auto mt-12">
      <div className="flex gap-4 mb-4">
        {['Description', 'Details', 'Shipping', 'Returns'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full font-bold ${activeTab === tab ? 'bg-gold text-[#0a0a23]' : 'bg-black/60 text-gold'} border border-gold transition`}>{tab}</button>
        ))}
      </div>
      <div className="bg-[#1a1a40] rounded-xl p-6 shadow-lg text-white">
        {activeTab === "Description" && <div>{product.description}</div>}
        {activeTab === "Details" && <div>Material: Gold-plated<br />Weight: 50g<br />Dimensions: 20cm</div>}
        {activeTab === "Shipping" && <div>Free Shipping. Delivery in 3–5 days.</div>}
        {activeTab === "Returns" && <div>Easy returns within 7 days.</div>}
      </div>
    </div>
  );
}
