"use client";
import { useState } from "react";
import Link from "next/link";

const STEPS = [
  {
    question: "How active is your lifestyle?",
    options: [
      { label: "Light", desc: "Occasional walks, light stretching", icon: "🚶" },
      { label: "Moderate", desc: "2–4 workouts a week", icon: "🏃" },
      { label: "Very Active", desc: "Daily training or sports", icon: "🏋️" },
    ],
  },
  {
    question: "What's your main wellness goal?",
    options: [
      { label: "Recovery", desc: "Sore muscles, rest & repair", icon: "💆" },
      { label: "Nutrition", desc: "Healthy snacks & hydration", icon: "🥗" },
      { label: "Skincare", desc: "Post-workout skin care", icon: "✨" },
      { label: "All-Around", desc: "A bit of everything", icon: "🌟" },
    ],
  },
  {
    question: "How many items do you want each month?",
    options: [
      { label: "Just a few", desc: "3 items — keep it simple", icon: "📦" },
      { label: "A good mix", desc: "5–8 items — balanced variety", icon: "🛍️" },
      { label: "Load me up", desc: "8+ items — maximum value", icon: "🎁" },
      { label: "I'll pick everything", desc: "Up to 12 items — full control", icon: "🎯" },
    ],
  },
];

// Map answers to a plan recommendation
function getRecommendation(answers: number[]): {
  planId: string;
  planName: string;
  price: number;
  reason: string;
} {
  const [, , qty] = answers;
  // qty step drives the recommendation most strongly
  if (qty === 0) {
    return { planId: "basic", planName: "Basic Plan", price: 399, reason: "3 curated items — the perfect starter wellness kit." };
  }
  if (qty === 1) {
    return { planId: "standard", planName: "Standard Plan", price: 599, reason: "5 items across recovery, snacks, and lifestyle — our most popular pick." };
  }
  if (qty === 2) {
    return { planId: "premium", planName: "Premium Plan", price: 899, reason: "8 items — best value for active wellness enthusiasts." };
  }
  return { planId: "custom", planName: "Custom Plan", price: 1299, reason: "Up to 12 items, any mix — full control over every item in your box." };
}

export default function WellnessQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const current = STEPS[step];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    if (step < STEPS.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      setAnswers(newAnswers);
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setDone(false);
  };

  const recommendation = done ? getRecommendation(answers) : null;

  return (
    <section className="py-20 px-6 bg-[#2D2D2D]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#7CAE8E] font-bold text-sm uppercase tracking-widest">Find Your Fit</span>
          <h2 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-white mt-2">
            Wellness Quiz
          </h2>
          <p className="text-gray-400 mt-2 text-sm">Answer 3 quick questions and we'll match you to the right plan.</p>
        </div>

        <div className="bg-[#1F2937] rounded-3xl p-8 shadow-2xl">
          {!done ? (
            <>
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all ${
                      i === step
                        ? "w-8 h-2 bg-[#7CAE8E]"
                        : i < step
                        ? "w-2 h-2 bg-[#5F8F72]"
                        : "w-2 h-2 bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-gray-400 text-center mb-2">
                Question {step + 1} of {STEPS.length}
              </p>
              <h3 className="font-[var(--font-dm-sans)] text-xl font-bold text-white text-center mb-6">
                {current.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="flex items-center gap-3 bg-[#2D2D2D] hover:bg-[#7CAE8E]/20 border border-gray-700 hover:border-[#7CAE8E] text-left rounded-2xl p-4 transition-all group"
                  >
                    <span className="text-2xl shrink-0">{option.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-[#7CAE8E] transition-colors">{option.label}</p>
                      <p className="text-xs text-gray-400">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            // Result screen
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7CAE8E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <p className="text-gray-400 text-sm mb-1">Your perfect match</p>
              <h3 className="font-[var(--font-dm-sans)] text-3xl font-extrabold text-white mb-1">
                {recommendation!.planName}
              </h3>
              <p className="text-[#7CAE8E] text-3xl font-extrabold mb-3">
                ₱{recommendation!.price}<span className="text-base font-normal text-gray-400">/mo</span>
              </p>
              <p className="text-gray-300 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                {recommendation!.reason}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/plans`}>
                  <button className="bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-8 py-3 rounded-full font-bold transition-colors min-h-[48px]">
                    Get This Plan →
                  </button>
                </Link>
                <button
                  onClick={reset}
                  className="border border-gray-600 text-gray-300 hover:border-[#7CAE8E] hover:text-[#7CAE8E] px-8 py-3 rounded-full font-semibold transition-colors min-h-[48px]"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
