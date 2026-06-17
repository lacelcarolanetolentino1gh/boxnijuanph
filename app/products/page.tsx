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

  const filtered = PRODUCTS
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => activeBrand === "All" || p.brand === activeBrand);

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

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-3" role="group" aria-label="Filter by category">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors min-h-[40px] ${
              activeCategory === cat
                ? "bg-[#7CAE8E] text-white border-[#7CAE8E]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#7CAE8E] hover:text-[#7CAE8E]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Brand filters */}
      <div className="flex gap-2 flex-wrap mb-8 items-center" role="group" aria-label="Filter by brand">
        <span className="text-xs text-gray-400 font-medium mr-1">Brand:</span>
        {["All", ...BRANDS].map((brand) => (
          <button
            key={brand}
            onClick={() => setActiveBrand(brand)}
            aria-pressed={activeBrand === brand}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors min-h-[32px] ${
              activeBrand === brand
                ? "bg-[#2D2D2D] text-white border-[#2D2D2D]"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#2D2D2D] hover:text-[#2D2D2D]"
            }`}
          >
            {brand}
          </button>
        ))}
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
