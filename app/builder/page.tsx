"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

      <div className="mb-6">
        <Link href="/plans" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#7CAE8E] transition-colors">
          ← Back to Plans
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-[var(--font-dm-sans)] text-3xl font-extrabold text-[#2D2D2D] mb-1">Build Your Box</h1>
        <p className="text-gray-500">
          {planLabel} Plan — Choose <span className="font-bold text-[#7CAE8E]">{maxItems} items</span> for your box.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8" role="progressbar" aria-valuenow={selected.length} aria-valuemin={0} aria-valuemax={maxItems} aria-label={`${selected.length} of ${maxItems} items selected`}>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{selected.length} of {maxItems} items selected</span>
          <span className={remaining > 0 ? "text-gray-400" : "text-[#7CAE8E] font-bold"}>
            {remaining > 0 ? `${remaining} remaining` : "✓ Box complete!"}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-[#7CAE8E] h-3 rounded-full transition-all duration-300"
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
                  className={`bg-white rounded-2xl text-left border-2 transition-all shadow-sm overflow-hidden ${
                    sel
                      ? "border-[#7CAE8E] ring-2 ring-[#7CAE8E]/20"
                      : disabled
                      ? "border-gray-100 opacity-40 cursor-not-allowed"
                      : "border-gray-100 hover:border-[#7CAE8E] hover:shadow-md"
                  }`}
                >
                  {/* Product image */}
                  <div className="relative h-36 bg-gray-50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {sel && (
                      <div className="absolute inset-0 bg-[#7CAE8E]/20 flex items-center justify-center">
                        <div className="w-8 h-8 bg-[#7CAE8E] rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                      </div>
                    )}
                    {product.isLocal && (
                      <span className="absolute top-2 left-2 text-xs bg-[#7CAE8E] text-white px-2 py-0.5 rounded-full">🇵🇭</span>
                    )}
                    {product.isEco && (
                      <span className="absolute top-2 right-2 text-xs bg-white text-green-700 px-2 py-0.5 rounded-full border border-green-200">♻️</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-[#2D2D2D] mb-0.5">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.category}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-12">No items in this category.</p>
          )}
        </div>

        {/* Right: sticky summary panel */}
        <div className="w-72 shrink-0 hidden md:block">
          <div className="bg-[#FAFAF7] border border-green-100 rounded-2xl p-6 sticky top-24">
            <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-4">Your Box</h3>
            {selected.length === 0 ? (
              <p className="text-sm text-gray-400">No items selected yet.</p>
            ) : (
              <ul className="space-y-3 mb-4" aria-label="Selected items">
                {selected.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-sm">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                    </div>
                    <span className="flex-1 text-[#2D2D2D] text-xs font-medium leading-tight">{p.name}</span>
                    <button
                      onClick={() => toggleProduct(p)}
                      aria-label={`Remove ${p.name}`}
                      className="text-gray-300 hover:text-red-400 text-xs shrink-0 min-w-[24px] min-h-[24px] flex items-center justify-center"
                    >✕</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-green-100 pt-3 mt-3">
              <p className="text-xs text-gray-400 text-center mb-3">{selected.length}/{maxItems} items</p>
              <button
                onClick={handleContinue}
                disabled={selected.length < maxItems}
                aria-disabled={selected.length < maxItems}
                className={`w-full py-3 rounded-full text-sm font-bold transition-colors min-h-[48px] ${
                  selected.length >= maxItems
                    ? "bg-[#7CAE8E] hover:bg-[#5F8F72] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selected.length >= maxItems ? "Review My Box →" : `Add ${remaining} more item${remaining !== 1 ? "s" : ""}`}
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
          className={`w-full py-3 rounded-full text-sm font-bold transition-colors ${
            selected.length >= maxItems
              ? "bg-[#7CAE8E] hover:bg-[#5F8F72] text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {selected.length >= maxItems ? "Review My Box →" : `Add ${remaining} more item${remaining !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}
