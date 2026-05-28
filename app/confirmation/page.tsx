"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PLANS, Product } from "@/lib/data";
import StepIndicator from "@/components/StepIndicator";

export default function ConfirmationPage() {
  const [plan, setPlan] = useState<string>("basic");
  const [items, setItems] = useState<Product[]>([]);
  const [name, setName] = useState<string>("");
  const [orderNumber] = useState(() => `BNJ-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    const stored = localStorage.getItem("orderDetails");
    if (stored) {
      const data = JSON.parse(stored);
      setPlan(data.plan);
      setItems(data.items || []);
      setName(data.form?.fullName || "");
    }
  }, []);

  const planData = PLANS.find((p) => p.id === plan);
  const localCount = items.filter((i) => i.isLocal).length;
  const ecoCount = items.filter((i) => i.isEco).length;

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <StepIndicator current="confirmation" />

      {/* Success icon */}
      <div
        className="w-20 h-20 bg-[#7D9B76] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
        role="img"
        aria-label="Order confirmed"
      >
        <span className="text-4xl text-white font-bold" aria-hidden="true">✓</span>
      </div>

      <h1 className="font-[var(--font-dm-sans)] text-4xl font-bold text-[#2D2D2D] mb-2">
        Order Confirmed!
      </h1>
      {name && (
        <p className="text-lg text-gray-500 mb-1">
          Thank you, <span className="font-semibold text-[#2D2D2D]">{name}</span>!
        </p>
      )}
      <p className="text-gray-400 text-sm mb-8">
        Order <span className="font-mono font-semibold text-[#2D2D2D]">{orderNumber}</span> · {planData?.name} Plan · ₱{planData?.price}/month
      </p>

      {/* Order details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left shadow-sm mb-6">
        <h2 className="font-[var(--font-dm-sans)] font-semibold text-[#2D2D2D] mb-4">Your Box</h2>
        {items.length > 0 ? (
          <ul className="space-y-2" aria-label="Items in your order">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <span className="text-xl" aria-hidden="true">{item.emoji}</span>
                <span className="text-[#2D2D2D]">{item.name}</span>
                <div className="flex gap-1 ml-auto">
                  {item.isLocal && <span className="text-xs bg-[#7D9B76] text-white px-2 py-0.5 rounded-full">🇵🇭 Local</span>}
                  {item.isEco && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">♻️ Eco</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No items found.</p>
        )}
      </div>

      {/* CSR thank-you */}
      <div className="bg-[#F5EFE6] rounded-2xl p-6 mb-8 text-left">
        <h3 className="font-[var(--font-dm-sans)] font-semibold text-[#2D2D2D] mb-2">🌱 Thank You for Supporting Wellness &amp; CSR</h3>
        <p className="text-sm text-gray-600">
          {localCount > 0 && `Your box supports ${localCount} Filipino local brand${localCount > 1 ? "s" : ""}. `}
          {ecoCount > 0 && `${ecoCount} of your items are eco-friendly and sustainably sourced. `}
          By choosing BoxNiJuanPH, you&apos;re contributing to Responsible Consumption and Production — aligned with <strong>UN SDG 12</strong>.
        </p>
        <p className="text-xs text-gray-400 mt-3">
          Salamat sa iyong suporta sa mga lokal na wellness brand ng Pilipinas. 💚
        </p>
      </div>

      {/* What's next */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 text-left text-sm">
        <h3 className="font-semibold text-[#2D2D2D] mb-3">What happens next?</h3>
        <ol className="space-y-2 text-gray-500">
          <li className="flex gap-2"><span className="text-[#7D9B76] font-bold">1.</span> You'll receive a confirmation email within 24 hours.</li>
          <li className="flex gap-2"><span className="text-[#7D9B76] font-bold">2.</span> Your box is assembled and packed by local partners.</li>
          <li className="flex gap-2"><span className="text-[#7D9B76] font-bold">3.</span> Delivery within Metro Manila in 3–5 business days.</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/">
          <button className="min-h-[48px] border-2 border-[#7D9B76] text-[#7D9B76] px-6 py-3 rounded-full font-semibold hover:bg-[#7D9B76] hover:text-white transition-colors">
            Back to Home
          </button>
        </Link>
        <Link href="/plans">
          <button className="min-h-[48px] bg-[#7D9B76] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5e7a58] transition-colors">
            Build Another Box →
          </button>
        </Link>
      </div>
    </div>
  );
}
