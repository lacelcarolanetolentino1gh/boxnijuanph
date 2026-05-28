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
        <span className="text-[#F97316] font-bold text-sm uppercase tracking-widest">Flexible Plans</span>
        <h1 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#111827] mt-2 mb-3">Choose Your Plan</h1>
        <p className="text-gray-500 text-lg">Select how many wellness items you want in your monthly box.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-lg transition-shadow relative flex flex-col ${
              plan.badge === "Most Popular" ? "border-[#16A34A]" : "border-gray-200"
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
                <span className="absolute top-3 right-3 bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
            </div>

            {/* Plan details */}
            <div className="p-6 flex flex-col flex-1 items-center text-center">
              <h2 className="font-[var(--font-dm-sans)] text-2xl font-extrabold text-[#111827] mb-1">{plan.name}</h2>
              <div className="text-4xl font-extrabold text-[#16A34A] my-2">
                ₱{plan.price}<span className="text-base font-normal text-gray-400">/mo</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">{plan.items} items per box</p>
              <p className="text-gray-400 text-xs mb-6 border-t pt-4 w-full">{plan.description}</p>
              <button
                onClick={() => handleSelect(plan.id)}
                aria-label={`Choose ${plan.name} plan — ₱${plan.price} per month, ${plan.items} items`}
                className="w-full min-h-[48px] bg-[#16A34A] hover:bg-[#15803D] text-white py-3 rounded-full font-bold transition-colors mt-auto"
              >
                Choose {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-8">All plans include free delivery within Metro Manila. Cancel anytime.</p>
    </div>
  );
}
