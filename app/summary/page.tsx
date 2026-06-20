"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PLANS, PRODUCTS, PLAN_ITEM_COUNTS, Product } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import StepIndicator from "@/components/StepIndicator";

type SummaryItem = {
  product: Product;
  variant: string;
  qty: number;
};

// Parse flat Product[] (with baked-in name "Product — Option ×qty") back to SummaryItem[]
function parseStoredItems(raw: Product[]): SummaryItem[] {
  return raw.map((item) => {
    const dashIdx = item.name.lastIndexOf(" — ");
    const baseName = dashIdx !== -1 ? item.name.slice(0, dashIdx) : item.name;
    const variantRaw = dashIdx !== -1 ? item.name.slice(dashIdx + 3) : (item.variants?.[0] ?? "");
    const qtyMatch = variantRaw.match(/^(.*)\s×(\d+)$/);
    const variant = qtyMatch ? qtyMatch[1] : variantRaw;
    const qty = qtyMatch ? parseInt(qtyMatch[2], 10) : 1;
    // Find the full product from PRODUCTS for complete data (image, variants, etc.)
    const fullProduct = PRODUCTS.find((p) => p.name === baseName) ?? { ...item, name: baseName };
    return { product: fullProduct, variant, qty };
  });
}

// Serialize back to flat Product[] for localStorage
function serializeItems(items: SummaryItem[]): Product[] {
  return items.map((s) => ({
    ...s.product,
    name: `${s.product.name} — ${s.variant}${s.qty > 1 ? ` ×${s.qty}` : ""}`,
  }));
}

// ── Change Option Modal ───────────────────────────────────────────
function ChangeOptionModal({
  item,
  takenVariants,
  onConfirm,
  onClose,
}: {
  item: SummaryItem;
  takenVariants: string[];
  onConfirm: (variant: string) => void;
  onClose: () => void;
}) {
  const [chosen, setChosen] = useState(item.variant);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isTaken = (v: string) => v !== item.variant && takenVariants.includes(v);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Change option for ${item.product.name}`}
    >
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex gap-4 p-5 border-b border-gray-100">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#2D2D2D] text-sm leading-tight">{item.product.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">Currently: <span className="text-[#7CAE8E] font-medium">{item.variant}</span></p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-300 hover:text-gray-500 transition-colors shrink-0 p-1 self-start">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Option picker */}
        <div className="p-5">
          <p className="text-xs font-bold text-[#7CAE8E] uppercase tracking-wide mb-3">Choose a Different Option</p>
          <div className="flex flex-col gap-2">
            {item.product.variants.map((v) => {
              const taken = isTaken(v);
              const current = v === item.variant;
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
                  {current && <span className="ml-2 text-[10px] text-[#7CAE8E] font-normal">current</span>}
                  {taken && <span className="ml-2 text-[10px] text-gray-300">already in box</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm */}
        <div className="px-5 pb-5">
          <button
            onClick={() => onConfirm(chosen)}
            disabled={chosen === item.variant}
            className={`w-full min-h-[52px] font-bold rounded-full transition-colors ${
              chosen === item.variant
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#7CAE8E] hover:bg-[#5F8F72] text-white"
            }`}
          >
            {chosen === item.variant ? "No changes made" : "Save Change →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Summary Page ──────────────────────────────────────────────────
export default function SummaryPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<string>("basic");
  const [items, setItems] = useState<SummaryItem[]>([]);
  const [editingItem, setEditingItem] = useState<SummaryItem | null>(null);

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan") || "basic";
    const storedItems = localStorage.getItem("selectedItems");
    setPlan(storedPlan);
    if (storedItems) {
      try {
        const parsed: Product[] = JSON.parse(storedItems);
        setItems(parseStoredItems(parsed));
      } catch { /* ignore */ }
    }
  }, []);

  const planData = PLANS.find((p) => p.id === plan);
  const isCustom = plan === "custom";
  const minItems = PLAN_ITEM_COUNTS[plan] ?? 3;
  const localCount = items.filter((i) => i.product.isLocal).length;
  const ecoCount = items.filter((i) => i.product.isEco).length;
  const belowMinimum = !isCustom && items.length < minItems;

  const saveItems = (updated: SummaryItem[]) => {
    setItems(updated);
    localStorage.setItem("selectedItems", JSON.stringify(serializeItems(updated)));
  };

  const handleRemove = (index: number) => {
    saveItems(items.filter((_, i) => i !== index));
  };

  const handleChangeOption = (index: number, newVariant: string) => {
    const updated = items.map((s, i) => i === index ? { ...s, variant: newVariant } : s);
    saveItems(updated);
    setEditingItem(null);
  };

  // Variants already taken for a product (excluding the item currently being edited)
  const getTakenVariants = (productId: string, excludeIndex: number) =>
    items
      .filter((s, i) => s.product.id === productId && i !== excludeIndex)
      .map((s) => s.variant);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <StepIndicator current="summary" />

      <div className="mb-6">
        <Link href="/builder" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#7CAE8E] transition-colors">
          ← Back to Builder
        </Link>
      </div>

      <h1 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#2D2D2D] mb-2">Your Box Summary</h1>
      <p className="text-gray-500 mb-10">Review your selections before checkout.</p>

      {/* Plan card */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <div className="relative h-28">
          <Image src={planData?.image ?? ""} alt={`${planData?.name} plan`} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center px-6">
          <div className="flex-1">
            <p className="text-green-300 text-xs font-semibold uppercase tracking-widest">Selected Plan</p>
            <p className="font-[var(--font-dm-sans)] font-extrabold text-xl text-white">{planData?.name} Plan</p>
            <p className="text-gray-300 text-sm">{planData?.description}</p>
          </div>
          <div className="text-right">
            <p className="font-extrabold text-3xl text-[#7CAE8E]">₱{planData?.price}</p>
            <p className="text-xs text-gray-300">per month</p>
          </div>
        </div>
      </div>

      {/* Selected items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D]">Items in Your Box</h2>
          {!isCustom && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              belowMinimum
                ? "bg-red-50 text-red-400 border border-red-200"
                : "bg-[#EAF2ED] text-[#5F8F72]"
            }`}>
              {items.length}/{minItems} items
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm mb-3">No items selected.</p>
            <Link href="/builder" className="text-[#7CAE8E] underline text-sm font-medium">Go back to builder</Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50" aria-label="Your selected items">
            {items.map((s, index) => (
              <li key={`${s.product.id}-${s.variant}-${index}`} className="py-3 flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <Image src={s.product.image} alt={s.product.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#2D2D2D] leading-tight">{s.product.name}</p>
                  <p className="text-xs text-[#7CAE8E] font-medium mt-0.5">{s.variant}{s.qty > 1 ? ` ×${s.qty}` : ""}</p>
                  <p className="text-xs text-gray-400">{s.product.category}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {s.product.isLocal && <span className="text-xs bg-[#7CAE8E] text-white px-2 py-0.5 rounded-full">🇵🇭</span>}
                  {s.product.isEco && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">♻️</span>}
                </div>
                {/* Edit option button */}
                <button
                  onClick={() => setEditingItem({ ...s, _index: index } as SummaryItem & { _index: number })}
                  aria-label={`Change option for ${s.product.name}`}
                  title="Change option"
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#7CAE8E] hover:text-[#7CAE8E] transition-colors shrink-0"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(index)}
                  aria-label={`Remove ${s.product.name} — ${s.variant}`}
                  title="Remove item"
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors shrink-0"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Below minimum warning */}
        {belowMinimum && items.length > 0 && (
          <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>Your {planData?.name} plan requires <strong>{minItems} items</strong>. Add {minItems - items.length} more to proceed. <Link href="/builder" className="underline font-semibold hover:text-amber-900">Go to builder →</Link></span>
          </div>
        )}
      </div>

      {/* CSR impact note */}
      {items.length > 0 && (
        <div className="bg-[#FAFAF7] border border-green-200 rounded-2xl p-5 mb-8 text-sm text-green-800">
          <p className="font-bold mb-1">🌱 Your CSR Impact</p>
          <p>
            {localCount > 0 && `${localCount} of your items support Filipino local brands. `}
            {ecoCount > 0 && `${ecoCount} items are eco-friendly and sustainably sourced. `}
            Thank you for making a mindful choice aligned with UN SDG 12.
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Link href="/builder" className="flex-1">
          <button className="w-full min-h-[48px] border-2 border-[#7CAE8E] text-[#7CAE8E] py-3 rounded-full font-bold hover:bg-[#7CAE8E] hover:text-white transition-colors">
            ← Edit Box
          </button>
        </Link>
        <button
          onClick={() => {
            const user = localStorage.getItem("boxUser");
            router.push(user ? "/checkout" : "/login?redirect=/checkout");
          }}
          disabled={belowMinimum || items.length === 0}
          className={`flex-1 min-h-[48px] py-3 rounded-full font-bold transition-colors ${
            !belowMinimum && items.length > 0
              ? "bg-[#7CAE8E] hover:bg-[#5F8F72] text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Proceed to Checkout →
        </button>
      </div>

      {/* Change option modal */}
      {editingItem && (() => {
        const idx = (editingItem as SummaryItem & { _index: number })._index;
        return (
          <ChangeOptionModal
            item={editingItem}
            takenVariants={getTakenVariants(editingItem.product.id, idx)}
            onConfirm={(newVariant) => handleChangeOption(idx, newVariant)}
            onClose={() => setEditingItem(null)}
          />
        );
      })()}
    </div>
  );
}
