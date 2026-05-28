"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS, Product } from "@/lib/data";
import Link from "next/link";
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

      {/* Back link — User Control & Freedom */}
      <div className="mb-6">
        <Link href="/builder" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#7D9B76] transition-colors">
          ← Back to Builder
        </Link>
      </div>

      <h1 className="font-[var(--font-dm-sans)] text-4xl font-bold text-[#2D2D2D] mb-2">Your Box Summary</h1>
      <p className="text-gray-500 mb-10">Review your selections before checkout.</p>

      {/* Plan card */}
      <div className="bg-[#F5EFE6] rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Selected Plan</p>
            <p className="font-[var(--font-dm-sans)] font-bold text-xl text-[#2D2D2D]">{planData?.name} Plan</p>
            <p className="text-sm text-gray-400">{planData?.description}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl text-[#7D9B76]">₱{planData?.price}</p>
            <p className="text-xs text-gray-400">per month</p>
          </div>
        </div>
      </div>

      {/* Selected items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <h2 className="font-[var(--font-dm-sans)] font-semibold text-[#2D2D2D] mb-4">Items in Your Box</h2>
        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm mb-3">No items selected.</p>
            <Link href="/builder" className="text-[#7D9B76] underline text-sm font-medium">Go back to builder</Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50" aria-label="Your selected items">
            {items.map((item) => (
              <li key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
                  <div>
                    <p className="font-medium text-sm text-[#2D2D2D]">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {item.isLocal && <span className="text-xs bg-[#7D9B76] text-white px-2 py-0.5 rounded-full">🇵🇭 Local</span>}
                  {item.isEco && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">♻️ Eco</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CSR impact note */}
      {items.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 text-sm text-green-800">
          <p className="font-semibold mb-1">🌱 Your CSR Impact</p>
          <p>
            {localCount > 0 && `${localCount} of your items support Filipino local brands. `}
            {ecoCount > 0 && `${ecoCount} items are eco-friendly and sustainably sourced. `}
            Thank you for making a mindful choice aligned with UN SDG 12.
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Link href="/builder" className="flex-1">
          <button className="w-full min-h-[48px] border-2 border-[#7D9B76] text-[#7D9B76] py-3 rounded-full font-semibold hover:bg-[#7D9B76] hover:text-white transition-colors">
            ← Edit Box
          </button>
        </Link>
        <button
          onClick={() => {
            const user = localStorage.getItem("boxUser");
            router.push(user ? "/checkout" : "/login");
          }}
          disabled={items.length === 0}
          className={`flex-1 min-h-[48px] py-3 rounded-full font-semibold transition-colors ${
            items.length > 0
              ? "bg-[#7D9B76] text-white hover:bg-[#5e7a58]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
