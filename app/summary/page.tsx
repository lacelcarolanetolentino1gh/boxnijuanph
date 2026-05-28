"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS, Product } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import StepIndicator from "@/components/StepIndicator";

export default function SummaryPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<string>("basic");
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan") || "basic";
    const storedItems = localStorage.getItem("selectedItems");
    setPlan(storedPlan);
    if (storedItems) setItems(JSON.parse(storedItems));
  }, []);

  const planData = PLANS.find((p) => p.id === plan);
  const localCount = items.filter((i) => i.isLocal).length;
  const ecoCount = items.filter((i) => i.isEco).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <StepIndicator current="summary" />

      <div className="mb-6">
        <Link href="/builder" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#84CC16] transition-colors">
          ← Back to Builder
        </Link>
      </div>

      <h1 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#1C1917] mb-2">Your Box Summary</h1>
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
            <p className="font-extrabold text-3xl text-[#84CC16]">₱{planData?.price}</p>
            <p className="text-xs text-gray-300">per month</p>
          </div>
        </div>
      </div>

      {/* Selected items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <h2 className="font-[var(--font-dm-sans)] font-bold text-[#1C1917] mb-4">Items in Your Box</h2>
        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm mb-3">No items selected.</p>
            <Link href="/builder" className="text-[#84CC16] underline text-sm font-medium">Go back to builder</Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50" aria-label="Your selected items">
            {items.map((item) => (
              <li key={item.id} className="py-3 flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[#1C1917]">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.category}</p>
                </div>
                <div className="flex gap-1">
                  {item.isLocal && <span className="text-xs bg-[#84CC16] text-white px-2 py-0.5 rounded-full">🇵🇭 Local</span>}
                  {item.isEco && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">♻️ Eco</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CSR impact note */}
      {items.length > 0 && (
        <div className="bg-[#F7FEE7] border border-green-200 rounded-2xl p-5 mb-8 text-sm text-green-800">
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
          <button className="w-full min-h-[48px] border-2 border-[#84CC16] text-[#84CC16] py-3 rounded-full font-bold hover:bg-[#84CC16] hover:text-white transition-colors">
            ← Edit Box
          </button>
        </Link>
        <button
          onClick={() => {
            const user = localStorage.getItem("boxUser");
            router.push(user ? "/checkout" : "/login");
          }}
          disabled={items.length === 0}
          className={`flex-1 min-h-[48px] py-3 rounded-full font-bold transition-colors ${
            items.length > 0
              ? "bg-[#84CC16] hover:bg-[#0D9488] text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
