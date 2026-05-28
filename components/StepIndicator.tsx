"use client";

const STEPS = [
  { label: "Plan", path: "/plans" },
  { label: "Build", path: "/builder" },
  { label: "Review", path: "/summary" },
  { label: "Checkout", path: "/checkout" },
  { label: "Done", path: "/confirmation" },
];

interface StepIndicatorProps {
  current: "plans" | "builder" | "summary" | "checkout" | "confirmation";
}

export default function StepIndicator({ current }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.path === `/${current}`);

  return (
    <div className="flex items-center justify-center mb-10" aria-label="Order progress">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;

        return (
          <div key={step.path} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-[#7D9B76] text-white"
                    : isActive
                    ? "bg-[#7D9B76] text-white ring-4 ring-[#7D9B76]/20"
                    : "bg-gray-200 text-gray-400"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs mt-1 hidden sm:block ${
                  isActive ? "text-[#7D9B76] font-semibold" : isCompleted ? "text-[#7D9B76]" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-10 sm:w-16 mx-1 mb-4 sm:mb-5 transition-colors ${
                  i < currentIndex ? "bg-[#7D9B76]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
