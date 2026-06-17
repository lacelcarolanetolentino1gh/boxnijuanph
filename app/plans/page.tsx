"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PLANS } from "@/lib/data";
import StepIndicator from "@/components/StepIndicator";

export default function PlansPage() {
  const router = useRouter();

  const handleSelect = (planId: string) => {
    localStorage.setItem("selectedPlan", planId);
    localStorage.setItem("selectedItems", JSON.stringify([]));
    router.push("/builder");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <StepIndicator current="plans" />

      <div className="text-center mb-12">
        <span className="text-[#5F8F72] font-bold text-sm uppercase tracking-widest">Flexible Plans</span>
        <h1 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#2D2D2D] mt-2 mb-3">Choose Your Plan</h1>
        <p className="text-gray-500 text-lg">Select how many wellness items you want in your monthly box.</p>
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
              <p className="text-gray-500 text-sm mb-1">
                {plan.id === "custom" ? "Unlimited items" : `${plan.items} items per box`}
              </p>
              <p className="text-gray-400 text-xs mb-6 border-t pt-4 w-full">{plan.description}</p>
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
                ["Items per Box", "3 items", "5 items", "8 items", "Unlimited"],
                ["Full item selection", "✓", "✓", "✓", "✓"],
                ["Filipino Brand products", "✓", "✓", "✓", "✓"],
                ["Free Metro Manila delivery", "✓", "✓", "✓", "✓"],
                ["Cancel anytime", "✓", "✓", "✓", "✓"],
                ["Subscription dashboard", "✓", "✓", "✓", "✓"],
                ["No item cap", "—", "—", "—", "✓"],
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
