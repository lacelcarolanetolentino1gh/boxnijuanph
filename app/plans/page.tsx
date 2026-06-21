"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { PLANS } from "@/lib/data";
import StepIndicator from "@/components/StepIndicator";

// One-time retail equivalent prices per plan (for savings badge)
const ONE_TIME_PRICES: Record<string, number> = {
  basic: 549,
  standard: 799,
  premium: 1199,
  custom: 1799,
};

export default function PlansPage() {
  const router = useRouter();
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  const handleSelect = (planId: string) => {
    const user = localStorage.getItem("boxUser");
    if (!user) {
      // Not logged in — go straight
      localStorage.setItem("selectedPlan", planId);
      localStorage.setItem("selectedItems", JSON.stringify([]));
      router.push("/builder");
      return;
    }
    const existing = localStorage.getItem("selectedItems");
    let hasItems = false;
    try {
      const parsed = JSON.parse(existing || "[]");
      hasItems = Array.isArray(parsed) && parsed.length > 0;
    } catch { /* ignore */ }

    if (hasItems) {
      setPendingPlanId(planId);
    } else {
      confirmSelect(planId);
    }
  };

  const confirmSelect = (planId: string) => {
    localStorage.setItem("selectedPlan", planId);
    localStorage.setItem("selectedItems", JSON.stringify([]));
    setPendingPlanId(null);
    router.push("/builder");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <StepIndicator current="plans" />

      <div className="text-center mb-12">
        <span className="text-[#5F8F72] font-bold text-sm uppercase tracking-widest">Flexible Plans</span>
        <h1 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#2D2D2D] mt-2 mb-3">Choose Your Plan</h1>
        <p className="text-gray-500 text-lg">Select how many items you want in your monthly box.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-lg transition-shadow relative flex flex-col ${
              plan.badge === "Most Popular" ? "border-[#7CAE8E]" :
              plan.id === "custom" ? "border-dashed border-[#7CAE8E]/60" :
              "border-gray-200"
            }`}
          >
            {/* Plan image */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={plan.image}
                alt={`${plan.name} plan`}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {plan.badge && (
                <span className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full ${
                  plan.id === "custom" ? "bg-[#7CAE8E]" : "bg-[#5F8F72]"
                }`}>
                  {plan.badge}
                </span>
              )}
            </div>

            {/* Plan details */}
            <div className="p-6 flex flex-col flex-1 items-center text-center">
              <h2 className="font-[var(--font-dm-sans)] text-2xl font-extrabold text-[#2D2D2D] mb-1">{plan.name}</h2>
              <div className="text-4xl font-extrabold text-[#7CAE8E] my-2">
                ₱{plan.price}<span className="text-base font-normal text-gray-400">/mo</span>
              </div>
              {/* Savings badge */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs text-gray-400 line-through">₱{ONE_TIME_PRICES[plan.id]}/mo one-time</span>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Save ₱{ONE_TIME_PRICES[plan.id] - plan.price}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1">
                {plan.id === "custom" ? "Up to 12 items, any mix" : `${plan.items} items per box`}
              </p>
              <div className="border-t pt-4 w-full mb-6">
                {plan.id === "custom" ? (
                  <p className="text-xs text-gray-400">{plan.description}</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-[#7CAE8E]">Recommended: </span>
                    {plan.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleSelect(plan.id)}
                aria-label={`Choose ${plan.name} plan`}
                className={`w-full min-h-[48px] py-3 rounded-full font-bold transition-colors mt-auto ${
                  plan.id === "custom"
                    ? "bg-white border-2 border-[#7CAE8E] text-[#7CAE8E] hover:bg-[#7CAE8E] hover:text-white"
                    : "bg-[#7CAE8E] hover:bg-[#5F8F72] text-white"
                }`}
              >
                {plan.id === "custom" ? "Build Custom Box" : `Choose ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-8">All plans include free delivery within Metro Manila. Cancel anytime.</p>

      {/* ── Loyalty Perks Strip ───────────────────────────────────── */}
      <div className="mt-8 bg-[#EAF2ED] rounded-2xl px-6 py-5">
        <p className="text-center text-xs font-bold text-[#5F8F72] uppercase tracking-widest mb-4">Subscriber Perks — included in every plan</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: "🎁", label: "Birthday Box Voucher", desc: "Surprise discount on your birthday month" },
            { icon: "🔁", label: "Loyalty Points", desc: "Earn points every box, redeem for free items" },
            { icon: "🏷️", label: "Subscriber-Only Deals", desc: "Exclusive discounts on new product launches" },
            { icon: "⏸️", label: "Pause Anytime", desc: "Pause up to 3 months, no penalty" },
          ].map((perk) => (
            <div key={perk.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{perk.icon}</span>
              <p className="text-xs font-semibold text-[#2D2D2D]">{perk.label}</p>
              <p className="text-xs text-gray-500 leading-tight">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {pendingPlanId && (() => {
        const newPlan = PLANS.find((p) => p.id === pendingPlanId);
        return (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Pending box warning"
          >
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
              {/* Icon */}
              <div className="flex flex-col items-center pt-8 pb-4 px-6">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <h2 className="font-[var(--font-dm-sans)] font-extrabold text-[#2D2D2D] text-lg text-center leading-snug">
                  You have items saved in your current box
                </h2>
                <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
                  Switching to the <span className="font-semibold text-[#2D2D2D]">{newPlan?.name} Plan</span> will clear your current selections. This cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 px-6 pb-7 pt-2">
                <button
                  onClick={() => confirmSelect(pendingPlanId)}
                  className="w-full min-h-[52px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white font-bold rounded-full transition-colors"
                >
                  Yes, start fresh with {newPlan?.name}
                </button>
                <button
                  onClick={() => setPendingPlanId(null)}
                  className="w-full min-h-[48px] border-2 border-gray-200 text-gray-500 font-semibold rounded-full hover:border-[#7CAE8E] hover:text-[#7CAE8E] transition-colors"
                >
                  Keep my current items
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Plan Comparison Table ─────────────────────────────────── */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <span className="text-[#5F8F72] font-bold text-sm uppercase tracking-widest">Compare</span>
          <h2 className="font-[var(--font-dm-sans)] text-3xl font-extrabold text-[#2D2D2D] mt-2">Plan Comparison</h2>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#2D2D2D] text-white">
                <th className="px-6 py-4 font-semibold">Feature</th>
                <th className="px-6 py-4 font-semibold text-center">Basic</th>
                <th className="px-6 py-4 font-semibold text-center bg-[#5F8F72]">Standard</th>
                <th className="px-6 py-4 font-semibold text-center">Premium</th>
                <th className="px-6 py-4 font-semibold text-center">Custom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Monthly Price", "₱399", "₱599", "₱899", "₱1,299"],
                ["Items per Box", "3 items", "5 items", "8 items", "12 items"],
                ["Full item selection", "✓", "✓", "✓", "✓"],
                ["Filipino Brand products", "✓", "✓", "✓", "✓"],
                ["Free Metro Manila delivery", "✓", "✓", "✓", "✓"],
                ["Cancel anytime", "✓", "✓", "✓", "✓"],
                ["Subscription dashboard", "✓", "✓", "✓", "✓"],
                ["No category restrictions", "—", "—", "—", "✓"],
                ["Save & modify box anytime", "—", "—", "—", "✓"],
              ].map(([feature, basic, standard, premium, custom], i) => (
                <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAF7]"}>
                  <td className="px-6 py-3 font-medium text-[#2D2D2D]">{feature}</td>
                  <td className="px-6 py-3 text-center text-gray-500">{basic}</td>
                  <td className="px-6 py-3 text-center text-[#5F8F72] font-semibold bg-green-50">{standard}</td>
                  <td className="px-6 py-3 text-center text-gray-500">{premium}</td>
                  <td className="px-6 py-3 text-center text-gray-500">{custom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Competitor Comparison Table ───────────────────────────── */}
      <div className="mt-14 mb-4">
        <div className="text-center mb-8">
          <span className="text-[#5F8F72] font-bold text-sm uppercase tracking-widest">Why BoxNiJuanPH</span>
          <h2 className="font-[var(--font-dm-sans)] text-3xl font-extrabold text-[#2D2D2D] mt-2">How We Compare</h2>
          <p className="text-gray-500 text-sm mt-2">Compared to other subscription box platforms in the Philippine market</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#2D2D2D] text-white">
                <th className="px-6 py-4 font-semibold">Platform</th>
                <th className="px-6 py-4 font-semibold">Price Range</th>
                <th className="px-6 py-4 font-semibold">Customization</th>
                <th className="px-6 py-4 font-semibold">Local PH Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Good Box PH", "₱450 – ₱750", "None (pre-curated)", "Partial"],
                ["Local mid-tier boxes", "₱500 – ₱800", "Limited add-ons only", "Partial"],
                ["Premium PH boxes", "₱900 – ₱1,500", "Predefined upgrades only", "Varies"],
                ["FabFitFun (US)", "USD pricing", "Some add-ons, predefined bundles", "None"],
              ].map(([platform, price, custom, local], i) => (
                <tr key={platform} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAF7]"}>
                  <td className="px-6 py-3 font-medium text-[#2D2D2D]">{platform}</td>
                  <td className="px-6 py-3 text-gray-500">{price}</td>
                  <td className="px-6 py-3 text-gray-500">{custom}</td>
                  <td className="px-6 py-3 text-gray-500">{local}</td>
                </tr>
              ))}
              <tr className="bg-[#7CAE8E]/10 border-t-2 border-[#7CAE8E]">
                <td className="px-6 py-3 font-bold text-[#2D2D2D]">BoxNiJuanPH 🇵🇭</td>
                <td className="px-6 py-3 font-bold text-[#5F8F72]">₱399 – ₱1,299</td>
                <td className="px-6 py-3 font-bold text-[#5F8F72]">Full item selection on every plan</td>
                <td className="px-6 py-3 font-bold text-[#5F8F72]">100% Filipino brands</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
