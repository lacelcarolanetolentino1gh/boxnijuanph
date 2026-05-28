"use client";
import { useRouter } from "next/navigation";
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
        <h1 className="font-[var(--font-dm-sans)] text-4xl font-bold text-[#2D2D2D] mb-3">Choose Your Plan</h1>
        <p className="text-gray-500 text-lg">Select how many wellness items you want in your monthly box.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border-2 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative ${
              plan.badge === "Most Popular" ? "border-[#7D9B76]" : "border-gray-200"
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 bg-[#7D9B76] text-white text-xs font-semibold px-4 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <h2 className="font-[var(--font-dm-sans)] text-2xl font-bold text-[#2D2D2D] mb-1">{plan.name}</h2>
            <div className="text-4xl font-bold text-[#7D9B76] my-3">
              ₱{plan.price}<span className="text-base font-normal text-gray-400">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-2">{plan.items} items per box</p>
            <p className="text-gray-400 text-xs mb-6 border-t pt-4 w-full">{plan.description}</p>
            <button
              onClick={() => handleSelect(plan.id)}
              aria-label={`Choose ${plan.name} plan — ₱${plan.price} per month, ${plan.items} items`}
              className="w-full min-h-[48px] bg-[#7D9B76] text-white py-3 rounded-full font-semibold hover:bg-[#5e7a58] transition-colors"
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-8">All plans include free delivery within Metro Manila. Cancel anytime.</p>
    </div>
  );
}
