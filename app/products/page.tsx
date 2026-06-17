"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, CATEGORIES, BRANDS, Product } from "@/lib/data";

function ProductCard({ product }: { product: Product }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        {product.isLocal && (
          <span className="absolute top-2 left-2 text-xs bg-[#7CAE8E] text-white px-2 py-0.5 rounded-full">🇵🇭 Local</span>
        )}
        {product.isEco && (
          <span className="absolute top-2 right-2 text-xs bg-white text-green-700 px-2 py-0.5 rounded-full border border-green-200">♻️ Eco</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="font-semibold text-sm text-[#2D2D2D] mb-0.5">{product.name}</p>
        <p className="text-xs text-[#7CAE8E] font-medium mb-1">{product.brand}</p>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed flex-1">
          {flipped ? product.details.purpose : product.details.description}
        </p>
        <p className="text-[10px] text-gray-300 mb-3">{product.category}</p>
        <Link href="/plans">
          <button className="w-full min-h-[40px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white text-xs font-bold rounded-full transition-colors">
            Add to My Box →
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [localOnly, setLocalOnly] = useState(false);

  const filtered = PRODUCTS
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => activeBrand === "All" || p.brand === activeBrand)
    .filter((p) => !localOnly || p.isLocal);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-[#5F8F72] font-bold text-sm uppercase tracking-widest">Full Catalog</span>
        <h1 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#2D2D2D] mt-2 mb-3">Browse All Products</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Explore our full range of Filipino wellness products. Pick a plan and build your box.
        </p>
        <Link href="/plans">
          <button className="mt-6 bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-8 py-3 rounded-full font-bold transition-colors min-h-[48px] shadow-sm">
            Choose a Plan to Start Building →
          </button>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mr-1">Filter</span>

        {/* Category dropdown */}
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            aria-label="Filter by category"
            className={`appearance-none pl-4 pr-8 py-2 rounded-full text-sm font-semibold border cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#7CAE8E]/30 ${
              activeCategory !== "All"
                ? "bg-[#7CAE8E] text-white border-[#7CAE8E]"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#7CAE8E]"
            }`}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${activeCategory !== "All" ? "text-white" : "text-gray-400"}`}>▾</span>
        </div>

        {/* Brand dropdown */}
        <div className="relative">
          <select
            value={activeBrand}
            onChange={(e) => setActiveBrand(e.target.value)}
            aria-label="Filter by brand"
            className={`appearance-none pl-4 pr-8 py-2 rounded-full text-sm font-semibold border cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#7CAE8E]/30 ${
              activeBrand !== "All"
                ? "bg-[#2D2D2D] text-white border-[#2D2D2D]"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#2D2D2D]"
            }`}
          >
            <option value="All">All Brands</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs ${activeBrand !== "All" ? "text-white" : "text-gray-400"}`}>▾</span>
        </div>

        {/* Local only toggle */}
        <label className="flex items-center gap-2 cursor-pointer ml-1">
          <input
            type="checkbox"
            checked={localOnly}
            onChange={(e) => setLocalOnly(e.target.checked)}
            className="accent-[#7CAE8E] w-4 h-4"
          />
          <span className="text-sm text-gray-600 font-medium">🇵🇭 Local brands only</span>
        </label>

        {/* Clear filters */}
        {(activeCategory !== "All" || activeBrand !== "All" || localOnly) && (
          <button
            onClick={() => { setActiveCategory("All"); setActiveBrand("All"); setLocalOnly(false); }}
            className="ml-auto text-xs text-gray-400 hover:text-red-400 transition-colors underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 mb-4">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-16">No products match your filters.</p>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 text-center bg-[#FAFAF7] border border-green-100 rounded-3xl p-10">
        <h2 className="font-[var(--font-dm-sans)] text-2xl font-extrabold text-[#2D2D2D] mb-2">Ready to build your box?</h2>
        <p className="text-gray-500 text-sm mb-6">Choose a plan and pick exactly the products you want. Plans start at ₱399/mo.</p>
        <Link href="/plans">
          <button className="bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-10 py-4 rounded-full font-bold transition-colors min-h-[52px] shadow-md">
            See Plans & Pricing →
          </button>
        </Link>
      </div>
    </div>
  );
}
