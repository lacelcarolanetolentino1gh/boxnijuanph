"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, CATEGORIES, BRANDS, PLAN_ITEM_COUNTS, Product } from "@/lib/data";
import StepIndicator from "@/components/StepIndicator";

type SelectedItem = { product: Product; variant: string; qty: number };

// ── Tooltip ──────────────────────────────────────────────────────
function ProductTooltip({ product }: { product: Product }) {
  const { details } = product;
  return (
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-68 text-left pointer-events-none"
      style={{ width: "272px" }}>
      {/* Card */}
      <div className="bg-[#2D2D2D] rounded-2xl shadow-2xl overflow-hidden">
        {/* Sage green top accent bar */}
        <div className="h-1.5 w-full bg-[#7CAE8E]" />

        <div className="p-4">
          {/* Product name */}
          <p className="font-bold text-white text-sm mb-1 leading-tight">{product.name}</p>
          <p className="text-xs text-gray-300 mb-3 leading-relaxed">{details.description}</p>

          {/* Purpose */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7CAE8E] shrink-0" />
              <p className="text-[10px] font-bold text-[#7CAE8E] uppercase tracking-widest">Purpose</p>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed pl-3">{details.purpose}</p>
          </div>

          {/* Contents */}
          <div className={details.nutrition ? "mb-3" : ""}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7CAE8E] shrink-0" />
              <p className="text-[10px] font-bold text-[#7CAE8E] uppercase tracking-widest">Contents</p>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed pl-3">{details.contents}</p>
          </div>

          {/* Nutrition Facts */}
          {details.nutrition && (
            <div className="bg-[#1a1a1a] rounded-xl p-3 mt-1">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold text-[#7CAE8E] uppercase tracking-widest">Nutrition Facts</p>
                <p className="text-[9px] text-gray-500">per {details.nutrition.servingSize}</p>
              </div>
              {/* Calories row — prominent */}
              <div className="flex items-baseline justify-between border-b border-gray-700 pb-1.5 mb-1.5">
                <span className="text-xs text-gray-300">Calories</span>
                <span className="text-base font-extrabold text-white">{details.nutrition.calories} <span className="text-xs font-normal text-gray-400">kcal</span></span>
              </div>
              {/* Other nutrients */}
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: "Protein", value: details.nutrition.protein },
                  { label: "Carbs", value: details.nutrition.carbs },
                  { label: "Fat", value: details.nutrition.fat },
                  { label: "Sugar", value: details.nutrition.sugar },
                ].filter((n) => n.value).map((n) => (
                  <div key={n.label} className="bg-[#2D2D2D] rounded-lg p-1.5 text-center">
                    <p className="text-[8px] text-gray-500 mb-0.5">{n.label}</p>
                    <p className="text-[10px] font-bold text-[#7CAE8E]">{n.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Arrow pointing down to the card */}
      <div className="flex justify-center">
        <div className="w-0 h-0" style={{
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid #2D2D2D",
        }} />
      </div>
    </div>
  );
}

// ── Variant Modal ─────────────────────────────────────────────────
function VariantModal({
  product,
  takenVariants,
  isCustom,
  onConfirm,
  onClose,
}: {
  product: Product;
  takenVariants: string[];
  isCustom: boolean;
  onConfirm: (variant: string, qty: number) => void;
  onClose: () => void;
}) {
  // Default to first variant not already in the box, or the first one
  const firstAvailable = product.variants.find((v) => !takenVariants.includes(v)) ?? product.variants[0];
  const [chosen, setChosen] = useState(firstAvailable);
  const [qty, setQty] = useState(1);
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

  const isTaken = (v: string) => takenVariants.includes(v);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Choose an option for ${product.name}`}
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

        {/* Option picker */}
        <div className="p-5 pb-3">
          <p className="text-xs font-bold text-[#7CAE8E] uppercase tracking-wide mb-3">Choose an Option</p>
          <div className="flex flex-col gap-2">
            {product.variants.map((v) => {
              const taken = isTaken(v);
              return (
                <button
                  key={v}
                  onClick={() => { if (!taken) setChosen(v); }}
                  disabled={taken}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    taken
                      ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                      : chosen === v
                      ? "border-[#7CAE8E] bg-[#7CAE8E]/10 text-[#2D2D2D]"
                      : "border-gray-100 text-gray-600 hover:border-[#7CAE8E]/50"
                  }`}
                >
                  <span className={`mr-2 ${taken ? "text-gray-200" : chosen === v ? "text-[#7CAE8E]" : "text-gray-300"}`}>
                    {taken ? "✓" : chosen === v ? "●" : "○"}
                  </span>
                  {v}
                  {taken && <span className="ml-2 text-[10px] text-gray-300">already in box</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity stepper — Custom plan only */}
        {isCustom && (
          <div className="px-5 pb-4">
            <p className="text-xs font-bold text-[#7CAE8E] uppercase tracking-wide mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#7CAE8E] hover:text-[#7CAE8E] transition-colors font-bold text-lg disabled:opacity-40"
                disabled={qty <= 1}
              >
                −
              </button>
              <span className="text-xl font-extrabold text-[#2D2D2D] w-8 text-center" aria-live="polite">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#7CAE8E] hover:text-[#7CAE8E] transition-colors font-bold text-lg"
              >
                +
              </button>
              <span className="text-xs text-gray-400 ml-1">pcs</span>
            </div>
          </div>
        )}

        {/* Confirm */}
        <div className="px-5 pb-5">
          <button
            onClick={() => onConfirm(chosen, isCustom ? qty : 1)}
            disabled={isTaken(chosen)}
            className={`w-full min-h-[52px] font-bold rounded-full transition-colors ${
              isTaken(chosen)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#7CAE8E] hover:bg-[#5F8F72] text-white"
            }`}
          >
            {isCustom && qty > 1 ? `Add to Box (×${qty}) →` : "Add to Box →"}
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
  selectedVariants,
  isCustom,
  onCardClick,
}: {
  product: Product;
  sel: boolean;
  disabled: boolean;
  selectedVariants: { variant: string; qty: number }[];
  isCustom: boolean;
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

  const totalQty = selectedVariants.reduce((sum, s) => sum + s.qty, 0);
  const allVariantsTaken = product.variants.every((v) => selectedVariants.some((s) => s.variant === v));

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
        disabled={disabled && !sel}
        aria-pressed={sel}
        aria-label={`${product.name}${selectedVariants.length > 0 ? ` — ${selectedVariants.map((s) => `${s.variant}${s.qty > 1 ? ` ×${s.qty}` : ""}`).join(", ")}` : ""}${sel ? ", selected" : ""}${disabled && !sel ? ", unavailable — box is full" : ""}`}
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
              <div className="w-8 h-8 bg-[#7CAE8E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {selectedVariants.length > 1 ? selectedVariants.length : "✓"}
              </div>
            </div>
          )}
          {/* Qty badge — Custom plan only */}
          {isCustom && totalQty > 1 && (
            <div className="absolute top-2 right-2 bg-[#2D2D2D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              ×{totalQty}
            </div>
          )}
          {product.isLocal && (
            <span className="absolute top-2 left-2 text-xs bg-[#7CAE8E] text-white px-2 py-0.5 rounded-full">🇵🇭</span>
          )}
          {product.isEco && (
            <span className={`absolute text-xs bg-white text-green-700 px-2 py-0.5 rounded-full border border-green-200 ${totalQty > 1 ? "top-7 right-2" : "top-2 right-2"}`}>♻️</span>
          )}
          {/* Info hint */}
          {!disabled && (
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center text-gray-400 text-xs font-bold shadow-sm">ⓘ</span>
          )}
        </div>

        <div className="p-3">
          <p className="font-semibold text-sm text-[#2D2D2D] mb-0.5">{product.name}</p>
          {selectedVariants.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {selectedVariants.map((s) => (
                <p key={s.variant} className="text-xs text-[#7CAE8E] font-medium truncate">
                  {s.variant}{s.qty > 1 ? ` ×${s.qty}` : ""}
                </p>
              ))}
              {!allVariantsTaken && !disabled && (
                <p className="text-[10px] text-gray-400 mt-0.5">+ Add another variant</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 truncate">{product.brand} · {product.category}</p>
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
  const [activeBrand, setActiveBrand] = useState<string>("All");
  const [localOnly, setLocalOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const isCustom = plan === "custom";

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan") || "basic";
    setPlan(storedPlan);
    setMaxItems(PLAN_ITEM_COUNTS[storedPlan] || 3);
    const storedItems = localStorage.getItem("selectedItems");
    if (storedItems) {
      try {
        const parsed = JSON.parse(storedItems);
        // Support both SelectedItem[] {product, variant} and flat Product[] formats
        if (Array.isArray(parsed) && parsed.length > 0) {
          if ("product" in parsed[0]) {
            // Ensure qty exists (backwards compat with old saves that lack qty)
            setSelected(parsed.map((s: SelectedItem) => ({ ...s, qty: s.qty ?? 1 })));
          } else {
            // Flat product array — convert to SelectedItem[]
            const converted = parsed.map((item: Product) => {
              const dashIdx = item.name.lastIndexOf(" — ");
              const baseName = dashIdx !== -1 ? item.name.slice(0, dashIdx) : item.name;
              const variantRaw = dashIdx !== -1 ? item.name.slice(dashIdx + 3) : (item.variants?.[0] ?? "");
              // Parse "Variant ×qty" format
              const qtyMatch = variantRaw.match(/^(.*)\s×(\d+)$/);
              const variant = qtyMatch ? qtyMatch[1] : variantRaw;
              const qty = qtyMatch ? parseInt(qtyMatch[2], 10) : 1;
              return { product: { ...item, name: baseName }, variant, qty };
            });
            setSelected(converted);
          }
        }
      } catch {
        // Malformed data — start with empty selection
      }
    }
  }, []);

  const filteredProducts = PRODUCTS
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => activeBrand === "All" || p.brand === activeBrand)
    .filter((p) => !localOnly || p.isLocal)
    .filter((p) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.details.description.toLowerCase().includes(q);
    });

  const hasFilters = activeCategory !== "All" || activeBrand !== "All" || localOnly || query.trim() !== "";

  const isSelected = (id: string) => selected.some((s) => s.product.id === id);
  const getSelectedVariants = (id: string) =>
    selected.filter((s) => s.product.id === id).map((s) => ({ variant: s.variant, qty: s.qty }));
  const getTakenVariants = (id: string) => selected.filter((s) => s.product.id === id).map((s) => s.variant);

  const handleCardClick = (product: Product) => {
    const productEntries = selected.filter((s) => s.product.id === product.id);
    const allVariantsTaken = product.variants.every((v) => productEntries.some((s) => s.variant === v));

    if (productEntries.length > 0 && allVariantsTaken) {
      // All variants taken — clicking removes all entries for this product
      setSelected(selected.filter((s) => s.product.id !== product.id));
    } else if (productEntries.length === 0 && !isCustom && selected.length >= maxItems) {
      // Box full, not selected yet — do nothing
    } else {
      // Open modal to pick a (new) variant
      setModalProduct(product);
    }
  };

  const handleVariantConfirm = (variant: string, qty: number) => {
    if (!modalProduct) return;
    setSelected([...selected, { product: modalProduct, variant, qty }]);
    setModalProduct(null);
  };

  const handleQtyChange = (productId: string, variant: string, delta: number) => {
    setSelected(selected.map((s) => {
      if (s.product.id === productId && s.variant === variant) {
        const newQty = Math.max(1, s.qty + delta);
        return { ...s, qty: newQty };
      }
      return s;
    }));
  };

  const handleRemoveVariant = (productId: string, variant: string) => {
    setSelected(selected.filter((s) => !(s.product.id === productId && s.variant === variant)));
  };

  const handleContinue = () => {
    const items = selected.map((s) => ({
      ...s.product,
      name: `${s.product.name} — ${s.variant}${s.qty > 1 ? ` ×${s.qty}` : ""}`,
    }));
    localStorage.setItem("selectedItems", JSON.stringify(items));
    router.push("/summary");
  };

  // For custom plan, save box without going to checkout (just persist)
  const handleSaveCustom = () => {
    const items = selected.map((s) => ({
      ...s.product,
      name: `${s.product.name} — ${s.variant}${s.qty > 1 ? ` ×${s.qty}` : ""}`,
    }));
    localStorage.setItem("selectedItems", JSON.stringify(items));
    // Also mark as custom subscription saved
    localStorage.setItem("customBoxSaved", "true");
    router.push("/my-box");
  };

  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const remaining = isCustom ? 0 : maxItems - selected.length;
  const boxComplete = isCustom ? selected.length > 0 : selected.length >= maxItems;

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
        {isCustom ? (
          <p className="text-gray-500">
            Custom Box — Add <span className="font-bold text-[#7CAE8E]">as many items as you want</span>. No limits.
            {" "}<span className="text-xs text-gray-400">Hover a card for details · Click to select</span>
          </p>
        ) : (
          <p className="text-gray-500">
            {planLabel} Plan — Choose <span className="font-bold text-[#7CAE8E]">{maxItems} items</span> for your box.
            {" "}<span className="text-xs text-gray-400">Hover a card for details · Click to select</span>
          </p>
        )}
      </div>

      {/* Progress bar / custom indicator */}
      {isCustom ? (
        <div className="mb-8 flex items-center gap-3 bg-[#7CAE8E]/10 border border-[#7CAE8E]/30 rounded-xl px-4 py-3" role="status">
          <span className="text-[#7CAE8E] text-xl">✦</span>
          <p className="text-sm text-[#5F8F72] font-medium">
            {selected.length === 0 ? "Start adding items to your custom box." : `${selected.length} item${selected.length !== 1 ? "s" : ""} in your box — save anytime.`}
          </p>
        </div>
      ) : (
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
      )}

      <div className="flex gap-8">
        {/* Left: filters + products */}
        <div className="flex-1">
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

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const sel = isSelected(product.id);
              const slots = selected.length;
              // Disabled if box is full AND product not yet selected at all
              const disabled = !sel && !isCustom && slots >= maxItems;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  sel={sel}
                  disabled={disabled}
                  selectedVariants={getSelectedVariants(product.id)}
                  isCustom={isCustom}
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
            <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-4">
              Your Box {isCustom && <span className="text-xs font-normal text-[#7CAE8E] ml-1">· Custom</span>}
            </h3>
            {selected.length === 0 ? (
              <p className="text-sm text-gray-400">No items selected yet.</p>
            ) : (
              <ul className="space-y-3 mb-4" aria-label="Selected items">
                {selected.map((s) => (
                  <li key={`${s.product.id}-${s.variant}`} className="flex items-start gap-2 text-sm">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 mt-0.5">
                      <Image src={s.product.image} alt={s.product.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#2D2D2D] text-xs font-medium leading-tight truncate">{s.product.name}</p>
                      <p className="text-[10px] text-[#7CAE8E] truncate mb-1">{s.variant}{isCustom && s.qty > 1 ? ` ×${s.qty}` : ""}</p>
                      {/* Qty stepper — Custom plan only */}
                      {isCustom && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleQtyChange(s.product.id, s.variant, -1)}
                            aria-label={`Decrease qty of ${s.variant}`}
                            className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#7CAE8E] hover:text-[#7CAE8E] text-xs font-bold transition-colors"
                          >−</button>
                          <span className="text-xs font-bold text-[#2D2D2D] min-w-[16px] text-center">{s.qty}</span>
                          <button
                            onClick={() => handleQtyChange(s.product.id, s.variant, 1)}
                            aria-label={`Increase qty of ${s.variant}`}
                            className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#7CAE8E] hover:text-[#7CAE8E] text-xs font-bold transition-colors"
                          >+</button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveVariant(s.product.id, s.variant)}
                      aria-label={`Remove ${s.product.name} — ${s.variant}`}
                      className="text-gray-300 hover:text-red-400 text-xs shrink-0 min-w-[24px] min-h-[24px] flex items-center justify-center mt-0.5"
                    >✕</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-green-100 pt-3 mt-3">
              {isCustom ? (
                <>
                  <p className="text-xs text-gray-400 text-center mb-3">{selected.length} item{selected.length !== 1 ? "s" : ""} · Custom</p>
                  <button
                    onClick={handleSaveCustom}
                    disabled={selected.length === 0}
                    aria-disabled={selected.length === 0}
                    className={`w-full py-3 rounded-full text-sm font-bold transition-colors min-h-[48px] mb-2 ${
                      selected.length > 0
                        ? "bg-[#7CAE8E] hover:bg-[#5F8F72] text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Save My Box ✓
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={selected.length === 0}
                    className={`w-full py-3 rounded-full text-sm font-bold transition-colors min-h-[48px] border-2 ${
                      selected.length > 0
                        ? "border-[#7CAE8E] text-[#7CAE8E] hover:bg-[#7CAE8E] hover:text-white"
                        : "border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Review & Order →
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile continue bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>{selected.length}{isCustom ? "" : `/${maxItems}`} items selected</span>
        </div>
        {isCustom ? (
          <div className="flex gap-2">
            <button
              onClick={handleSaveCustom}
              disabled={selected.length === 0}
              className={`flex-1 py-3 rounded-full text-sm font-bold transition-colors ${
                selected.length > 0 ? "bg-[#7CAE8E] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Save Box
            </button>
            <button
              onClick={handleContinue}
              disabled={selected.length === 0}
              className={`flex-1 py-3 rounded-full text-sm font-bold border-2 transition-colors ${
                selected.length > 0 ? "border-[#7CAE8E] text-[#7CAE8E]" : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Review →
            </button>
          </div>
        ) : (
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
        )}
      </div>

      {/* Variant modal */}
      {modalProduct && (
        <VariantModal
          product={modalProduct}
          takenVariants={getTakenVariants(modalProduct.id)}
          isCustom={isCustom}
          onConfirm={handleVariantConfirm}
          onClose={() => setModalProduct(null)}
        />
      )}
    </div>
  );
}
