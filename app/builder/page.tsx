"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, CATEGORIES, PLAN_ITEM_COUNTS, Product } from "@/lib/data";
import StepIndicator from "@/components/StepIndicator";

type SelectedItem = { product: Product; variant: string };

// ── Tooltip ──────────────────────────────────────────────────────
function ProductTooltip({ product }: { product: Product }) {
  const { details } = product;
  return (
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 text-left pointer-events-none">
      {/* Arrow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden">
        <div className="w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 translate-y-[-7px] mx-auto" />
      </div>

      <p className="font-semibold text-[#2D2D2D] text-xs mb-1">{product.name}</p>
      <p className="text-xs text-gray-500 mb-2 leading-relaxed">{details.description}</p>

      <div className="border-t border-gray-100 pt-2 mb-2">
        <p className="text-[10px] font-bold text-[#7CAE8E] uppercase tracking-wide mb-0.5">Purpose</p>
        <p className="text-xs text-gray-500 leading-relaxed">{details.purpose}</p>
      </div>

      <div className="border-t border-gray-100 pt-2 mb-2">
        <p className="text-[10px] font-bold text-[#7CAE8E] uppercase tracking-wide mb-0.5">Contents</p>
        <p className="text-xs text-gray-500 leading-relaxed">{details.contents}</p>
      </div>

      {details.nutrition && (
        <div className="border-t border-gray-100 pt-2">
          <p className="text-[10px] font-bold text-[#7CAE8E] uppercase tracking-wide mb-1.5">Nutrition Facts</p>
          <p className="text-[10px] text-gray-400 mb-1">Serving: {details.nutrition.servingSize}</p>
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: "Calories", value: `${details.nutrition.calories} kcal` },
              { label: "Protein", value: details.nutrition.protein },
              { label: "Carbs", value: details.nutrition.carbs },
              { label: "Fat", value: details.nutrition.fat },
              { label: "Sugar", value: details.nutrition.sugar },
            ].filter((n) => n.value).map((n) => (
              <div key={n.label} className="bg-[#FAFAF7] rounded-lg p-1 text-center">
                <p className="text-[9px] text-gray-400">{n.label}</p>
                <p className="text-[10px] font-bold text-[#2D2D2D]">{n.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Variant Modal ─────────────────────────────────────────────────
function VariantModal({
  product,
  onConfirm,
  onClose,
}: {
  product: Product;
  onConfirm: (variant: string) => void;
  onClose: () => void;
}) {
  const [chosen, setChosen] = useState(product.variants[0]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Choose variant for ${product.name}`}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
      >
        {/* Product header */}
        <div className="flex gap-4 p-5 border-b border-gray-100">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
            <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#2D2D2D] text-sm leading-tight">{product.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
            <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">{product.details.description}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-300 hover:text-gray-500 transition-colors shrink-0 p-1 self-start"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Variant picker */}
        <div className="p-5">
          <p className="text-xs font-bold text-[#7CAE8E] uppercase tracking-wide mb-3">Choose a Variant</p>
          <div className="flex flex-col gap-2">
            {product.variants.map((v) => (
              <button
                key={v}
                onClick={() => setChosen(v)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  chosen === v
                    ? "border-[#7CAE8E] bg-[#7CAE8E]/10 text-[#2D2D2D]"
                    : "border-gray-100 text-gray-600 hover:border-[#7CAE8E]/50"
                }`}
              >
                <span className={`mr-2 ${chosen === v ? "text-[#7CAE8E]" : "text-gray-300"}`}>
                  {chosen === v ? "●" : "○"}
                </span>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm */}
        <div className="px-5 pb-5">
          <button
            onClick={() => onConfirm(chosen)}
            className="w-full min-h-[52px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white font-bold rounded-full transition-colors"
          >
            Add to Box →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────
function ProductCard({
  product,
  sel,
  disabled,
  selectedVariant,
  onCardClick,
}: {
  product: Product;
  sel: boolean;
  disabled: boolean;
  selectedVariant?: string;
  onCardClick: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 400);
  };
  const handleMouseLeave = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowTooltip(false);
  };

  return (
    <div className="relative">
      {/* Tooltip */}
      {showTooltip && !disabled && (
        <ProductTooltip product={product} />
      )}

      <button
        onClick={onCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        aria-pressed={sel}
        aria-label={`${product.name}${selectedVariant ? ` — ${selectedVariant}` : ""}${sel ? ", selected" : ""}${disabled ? ", unavailable — box is full" : ""}`}
        className={`w-full bg-white rounded-2xl text-left border-2 transition-all shadow-sm overflow-hidden ${
          sel
            ? "border-[#7CAE8E] ring-2 ring-[#7CAE8E]/20"
            : disabled
            ? "border-gray-100 opacity-40 cursor-not-allowed"
            : "border-gray-100 hover:border-[#7CAE8E] hover:shadow-md"
        }`}
      >
        {/* Image */}
        <div className="relative h-36 bg-gray-50 overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
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
          {/* Info hint */}
          {!disabled && (
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center text-gray-400 text-xs font-bold shadow-sm">ⓘ</span>
          )}
        </div>

        <div className="p-3">
          <p className="font-semibold text-sm text-[#2D2D2D] mb-0.5">{product.name}</p>
          {selectedVariant ? (
            <p className="text-xs text-[#7CAE8E] font-medium truncate">{selectedVariant}</p>
          ) : (
            <p className="text-xs text-gray-400">{product.category}</p>
          )}
        </div>
      </button>
    </div>
  );
}

// ── Builder Page ──────────────────────────────────────────────────
export default function BuilderPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<string>("basic");
  const [maxItems, setMaxItems] = useState<number>(3);
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

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

  const isSelected = (id: string) => selected.some((s) => s.product.id === id);
  const getVariant = (id: string) => selected.find((s) => s.product.id === id)?.variant;

  const handleCardClick = (product: Product) => {
    if (isSelected(product.id)) {
      // Deselect
      setSelected(selected.filter((s) => s.product.id !== product.id));
    } else if (selected.length < maxItems) {
      // Open variant modal
      setModalProduct(product);
    }
  };

  const handleVariantConfirm = (variant: string) => {
    if (!modalProduct) return;
    setSelected([...selected, { product: modalProduct, variant }]);
    setModalProduct(null);
  };

  const handleContinue = () => {
    // Store as flat Product array with variant baked into name for downstream pages
    const items = selected.map((s) => ({
      ...s.product,
      name: `${s.product.name} — ${s.variant}`,
    }));
    localStorage.setItem("selectedItems", JSON.stringify(items));
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
          {" "}<span className="text-xs text-gray-400">Hover a card for details · Click to select</span>
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
                <ProductCard
                  key={product.id}
                  product={product}
                  sel={sel}
                  disabled={disabled}
                  selectedVariant={getVariant(product.id)}
                  onCardClick={() => handleCardClick(product)}
                />
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
                {selected.map((s) => (
                  <li key={s.product.id} className="flex items-center gap-2 text-sm">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image src={s.product.image} alt={s.product.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#2D2D2D] text-xs font-medium leading-tight truncate">{s.product.name}</p>
                      <p className="text-[10px] text-[#7CAE8E] truncate">{s.variant}</p>
                    </div>
                    <button
                      onClick={() => setSelected(selected.filter((x) => x.product.id !== s.product.id))}
                      aria-label={`Remove ${s.product.name}`}
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

      {/* Variant modal */}
      {modalProduct && (
        <VariantModal
          product={modalProduct}
          onConfirm={handleVariantConfirm}
          onClose={() => setModalProduct(null)}
        />
      )}
    </div>
  );
}
