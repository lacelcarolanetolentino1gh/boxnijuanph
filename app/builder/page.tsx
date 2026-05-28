"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, CATEGORIES, PLAN_ITEM_COUNTS, Product } from "@/lib/data";
import StepIndicator from "@/components/StepIndicator";

export default function BuilderPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<string>("basic");
  const [maxItems, setMaxItems] = useState<number>(3);
  const [selected, setSelected] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan") || "basic";
    setPlan(storedPlan);
    setMaxItems(PLAN_ITEM_COUNTS[storedPlan] || 3);
    const storedItems = localStorage.getItem("selectedItems");
    if (storedItems) setSelected(JSON.parse(storedItems));
  }, []);

  const filteredProducts = activeCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const isSelected = (id: string) => selected.some((p) => p.id === id);

  const toggleProduct = (product: Product) => {
    if (isSelected(product.id)) {
      setSelected(selected.filter((p) => p.id !== product.id));
    } else if (selected.length < maxItems) {
      setSelected([...selected, product]);
    }
  };

  const handleContinue = () => {
    localStorage.setItem("selectedItems", JSON.stringify(selected));
    router.push("/summary");
  };

  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const remaining = maxItems - selected.length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <StepIndicator current="builder" />

      {/* Back link — User Control & Freedom (Nielsen #3) */}
      <div className="mb-6">
        <Link href="/plans" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#7D9B76] transition-colors">
          ← Back to Plans
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-[var(--font-dm-sans)] text-3xl font-bold text-[#2D2D2D] mb-1">Build Your Box</h1>
        <p className="text-gray-500">
          {planLabel} Plan — Choose <span className="font-semibold text-[#7D9B76]">{maxItems} items</span> for your box.
        </p>
      </div>

      {/* Progress bar — Visibility of System Status (Chapter 8 Heuristic) */}
      <div className="mb-8" role="progressbar" aria-valuenow={selected.length} aria-valuemin={0} aria-valuemax={maxItems} aria-label={`${selected.length} of ${maxItems} items selected`}>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{selected.length} of {maxItems} items selected</span>
          <span className={remaining > 0 ? "text-gray-400" : "text-[#7D9B76] font-semibold"}>
            {remaining > 0 ? `${remaining} remaining` : "Box full!"}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-[#7D9B76] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(selected.length / maxItems) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left: filters + products */}
        <div className="flex-1">
          {/* Category filters */}
          <div className="flex gap-2 flex-wrap mb-6" role="group" aria-label="Filter by category">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors min-h-[40px] ${
                  activeCategory === cat
                    ? "bg-[#7D9B76] text-white border-[#7D9B76]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#7D9B76] hover:text-[#7D9B76]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const sel = isSelected(product.id);
              const disabled = !sel && selected.length >= maxItems;
              return (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product)}
                  disabled={disabled}
                  aria-pressed={sel}
                  aria-label={`${product.name}${sel ? ", selected" : ""}${disabled ? ", unavailable — box is full" : ""}`}
                  className={`bg-white rounded-2xl p-4 text-left border-2 transition-all shadow-sm ${
                    sel
                      ? "border-[#7D9B76] bg-green-50"
                      : disabled
                      ? "border-gray-100 opacity-40 cursor-not-allowed"
                      : "border-gray-100 hover:border-[#7D9B76] hover:shadow-md"
                  }`}
                >
                  <div className="text-3xl mb-2" aria-hidden="true">{product.emoji}</div>
                  <p className="font-semibold text-sm text-[#2D2D2D] mb-1">{product.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                  <div className="flex gap-1 flex-wrap">
                    {product.isLocal && (
                      <span className="text-xs bg-[#7D9B76] text-white px-2 py-0.5 rounded-full">🇵🇭 Local</span>
                    )}
                    {product.isEco && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">♻️ Eco</span>
                    )}
                  </div>
                  {sel && (
                    <div className="mt-2 text-[#7D9B76] text-xs font-semibold" aria-hidden="true">✓ Added</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-12">No items in this category.</p>
          )}
        </div>

        {/* Right: sticky summary panel */}
        <div className="w-72 shrink-0 hidden md:block">
          <div className="bg-[#F5EFE6] rounded-2xl p-6 sticky top-24">
            <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-4">Your Box</h3>
            {selected.length === 0 ? (
              <p className="text-sm text-gray-400">No items selected yet. Choose from the products on the left.</p>
            ) : (
              <ul className="space-y-2 mb-4" aria-label="Selected items">
                {selected.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span>{p.emoji} {p.name}</span>
                    <button
                      onClick={() => toggleProduct(p)}
                      aria-label={`Remove ${p.name}`}
                      className="text-gray-400 hover:text-red-400 text-xs ml-2 min-w-[24px] min-h-[24px] flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-xs text-gray-400 text-center mb-3">{selected.length}/{maxItems} items</p>
              <button
                onClick={handleContinue}
                disabled={selected.length < maxItems}
                aria-disabled={selected.length < maxItems}
                className={`w-full py-3 rounded-full text-sm font-semibold transition-colors min-h-[48px] ${
                  selected.length >= maxItems
                    ? "bg-[#7D9B76] text-white hover:bg-[#5e7a58]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selected.length >= maxItems
                  ? "Review My Box →"
                  : `Add ${remaining} more item${remaining !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile continue bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>{selected.length}/{maxItems} items selected</span>
        </div>
        <button
          onClick={handleContinue}
          disabled={selected.length < maxItems}
          className={`w-full py-3 rounded-full text-sm font-semibold transition-colors ${
            selected.length >= maxItems
              ? "bg-[#7D9B76] text-white hover:bg-[#5e7a58]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {selected.length >= maxItems
            ? "Review My Box →"
            : `Add ${remaining} more item${remaining !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}
