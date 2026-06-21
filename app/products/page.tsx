"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, CATEGORIES, BRANDS, Product } from "@/lib/data";

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Image */}
        <div className="relative h-56 bg-gray-50 shrink-0">
          <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm transition-colors"
            aria-label="Close"
          >✕</button>
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.isLocal && <span className="text-xs bg-[#7CAE8E] text-white px-2 py-0.5 rounded-full">🇵🇭 Local</span>}
            {product.isEco && <span className="text-xs bg-white text-green-700 px-2 py-0.5 rounded-full border border-green-200">♻️ Eco</span>}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-xs text-[#7CAE8E] font-bold uppercase tracking-widest mb-1">{product.category}</p>
          <h2 className="font-[var(--font-dm-sans)] text-xl font-extrabold text-[#2D2D2D] mb-0.5">{product.name}</h2>
          <p className="text-sm text-gray-400 font-medium mb-4">by {product.brand}</p>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">About</p>
              <p className="text-sm text-gray-600 leading-relaxed">{product.details.description}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Best For</p>
              <p className="text-sm text-gray-600 leading-relaxed">{product.details.purpose}</p>
            </div>
            {product.details.contents && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contents</p>
                <p className="text-sm text-gray-600 leading-relaxed">{product.details.contents}</p>
              </div>
            )}
            {product.variants.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Available Variants</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <span key={v} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{v}</span>
                  ))}
                </div>
              </div>
            )}
            {product.details.nutrition && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nutrition Facts</p>
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 grid grid-cols-3 gap-2">
                  <div><p className="text-gray-400">Serving</p><p className="font-semibold">{product.details.nutrition.servingSize}</p></div>
                  <div><p className="text-gray-400">Calories</p><p className="font-semibold">{product.details.nutrition.calories}</p></div>
                  {product.details.nutrition.protein && <div><p className="text-gray-400">Protein</p><p className="font-semibold">{product.details.nutrition.protein}</p></div>}
                  {product.details.nutrition.carbs && <div><p className="text-gray-400">Carbs</p><p className="font-semibold">{product.details.nutrition.carbs}</p></div>}
                  {product.details.nutrition.fat && <div><p className="text-gray-400">Fat</p><p className="font-semibold">{product.details.nutrition.fat}</p></div>}
                  {product.details.nutrition.sugar && <div><p className="text-gray-400">Sugar</p><p className="font-semibold">{product.details.nutrition.sugar}</p></div>}
                </div>
              </div>
            )}
          </div>

          <Link href="/plans" onClick={onClose}>
            <button className="w-full min-h-[48px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white font-bold rounded-full transition-colors text-sm">
              Add to My Box →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col cursor-pointer"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={onClick}
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
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="w-full min-h-[40px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white text-xs font-bold rounded-full transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [localOnly, setLocalOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = PRODUCTS
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => activeBrand === "All" || p.brand === activeBrand)
    .filter((p) => !localOnly || p.isLocal)
    .filter((p) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.details.description.toLowerCase().includes(q);
    });

  const hasFilters = activeCategory !== "All" || activeBrand !== "All" || localOnly || query.trim() !== "";

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

        {/* Search input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="pl-8 pr-4 py-2 rounded-full text-sm border border-gray-200 bg-gray-50 text-gray-600 focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 w-48 transition-colors"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xs">✕</button>
          )}
        </div>
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
            {hasFilters && (
              <button
                onClick={() => { setActiveCategory("All"); setActiveBrand("All"); setLocalOnly(false); setQuery(""); }}
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
            <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-16">No products match your filters.</p>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

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
