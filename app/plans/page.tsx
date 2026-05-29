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
              {plan.id === "custom" ? (
                <div className="my-2">
                  <div className="text-3xl font-extrabold text-[#7CAE8E]">Pay-per-item</div>
                  <div className="text-xs text-gray-400 mt-0.5">Priced by what you pick</div>
                </div>
              ) : (
                <div className="text-4xl font-extrabold text-[#7CAE8E] my-2">
                  ₱{plan.price}<span className="text-base font-normal text-gray-400">/mo</span>
                </div>
              )}
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
    </div>
  );
}
