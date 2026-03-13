import React, { useState } from "react";

const categories = ["Necklace Sets", "Earrings", "Rings", "Bracelets", "Bangles", "Bridal Sets", "Makeup", "Clothing"];
const colors = ["Gold", "Silver", "Rose Gold", "Black", "Blue", "Red"];
const sizes = ["XS", "S", "M", "L", "XL"];

export default function FiltersSidebar({ onFilter }: { onFilter?: (filters: any) => void }) {
  const [price, setPrice] = useState([1000, 10000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [rating, setRating] = useState(0);

  return (
    <aside className="bg-[#1a1a40] border border-gold rounded-xl p-6 shadow-lg w-full max-w-xs">
      <h3 className="text-xl font-bold text-gold mb-6">Filters</h3>
      {/* Price Range */}
      <div className="mb-6">
        <label className="text-gold font-semibold mb-2 block">Price Range</label>
        <div className="flex items-center gap-2">
          <input type="range" min={1000} max={10000} value={price[0]} onChange={e => setPrice([+e.target.value, price[1]])} className="w-1/2" />
          <input type="range" min={1000} max={10000} value={price[1]} onChange={e => setPrice([price[0], +e.target.value])} className="w-1/2" />
        </div>
        <div className="text-white mt-2">Rs. {price[0]} – Rs. {price[1]}</div>
      </div>
      {/* Category */}
      <div className="mb-6">
        <label className="text-gold font-semibold mb-2 block">Category</label>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full rounded bg-black/60 text-gold border border-gold p-2">
          <option value="">All</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      {/* Color */}
      <div className="mb-6">
        <label className="text-gold font-semibold mb-2 block">Color</label>
        <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className="w-full rounded bg-black/60 text-gold border border-gold p-2">
          <option value="">All</option>
          {colors.map(color => <option key={color} value={color}>{color}</option>)}
        </select>
      </div>
      {/* Size */}
      <div className="mb-6">
        <label className="text-gold font-semibold mb-2 block">Size</label>
        <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="w-full rounded bg-black/60 text-gold border border-gold p-2">
          <option value="">All</option>
          {sizes.map(size => <option key={size} value={size}>{size}</option>)}
        </select>
      </div>
      {/* Rating */}
      <div className="mb-6">
        <label className="text-gold font-semibold mb-2 block">Rating</label>
        <input type="number" min={0} max={5} value={rating} onChange={e => setRating(+e.target.value)} className="w-full rounded bg-black/60 text-gold border border-gold p-2" />
        <div className="text-white mt-2">{rating} Stars & Up</div>
      </div>
      {/* Apply Filters Button */}
      <button className="w-full px-6 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition mt-4">Apply Filters</button>
    </aside>
  );
}
