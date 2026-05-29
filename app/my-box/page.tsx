"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PLANS, Product } from "@/lib/data";

type BoxUser = { name: string; email: string; provider: string; avatar?: string };

export default function MyBoxPage() {
  const router = useRouter();
  const [user, setUser] = useState<BoxUser | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<string, unknown> | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("boxUser");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));

    const storedOrder = localStorage.getItem("orderDetails");
    if (storedOrder) {
      const data = JSON.parse(storedOrder);
      setOrderDetails(data);
      setPlan(data.plan || null);
      setItems(data.items || []);
    } else {
      // Check if they have a saved custom box
      const storedItems = localStorage.getItem("selectedItems");
      const storedPlan = localStorage.getItem("selectedPlan");
      if (storedItems) setItems(JSON.parse(storedItems));
      if (storedPlan) setPlan(storedPlan);
    }
  }, [router]);

  const planData = plan ? PLANS.find((p) => p.id === plan) : null;
  const isCustom = plan === "custom";
  const localCount = items.filter((i) => i.isLocal).length;
  const ecoCount = items.filter((i) => i.isEco).length;

  // Simulated next delivery date (14 days from now)
  const nextDelivery = new Date();
  nextDelivery.setDate(nextDelivery.getDate() + 14);
  const deliveryLabel = nextDelivery.toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });

  const handleEditBox = () => {
    if (plan) localStorage.setItem("selectedPlan", plan);
    router.push("/builder");
  };

  const handleCancelSubscription = () => {
    localStorage.removeItem("orderDetails");
    localStorage.removeItem("selectedItems");
    localStorage.removeItem("selectedPlan");
    localStorage.removeItem("customBoxSaved");
    setCancelled(true);
    setShowCancelConfirm(false);
  };

  if (!user) return null;

  if (cancelled) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📦</span>
        </div>
        <h1 className="font-[var(--font-dm-sans)] text-2xl font-bold text-[#2D2D2D] mb-3">Subscription Cancelled</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your subscription has been cancelled. We&apos;re sad to see you go, {user.name.split(" ")[0]}!
        </p>
        <Link href="/plans">
          <button className="min-h-[48px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-8 py-3 rounded-full font-bold transition-colors">
            Start a New Box →
          </button>
        </Link>
      </div>
    );
  }

  if (!plan && items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-[#7CAE8E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📭</span>
        </div>
        <h1 className="font-[var(--font-dm-sans)] text-2xl font-bold text-[#2D2D2D] mb-3">No Active Subscription</h1>
        <p className="text-gray-500 text-sm mb-8">
          You don&apos;t have an active box yet, {user.name.split(" ")[0]}. Start building yours today!
        </p>
        <Link href="/plans">
          <button className="min-h-[48px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-8 py-3 rounded-full font-bold transition-colors">
            Choose a Plan →
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#7CAE8E] transition-colors mb-4">
          ← Back to Home
        </Link>
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <Image src={user.avatar} alt={user.name} width={48} height={48} className="rounded-full" unoptimized />
          ) : (
            <div className="w-12 h-12 bg-[#7CAE8E]/20 rounded-full flex items-center justify-center text-[#7CAE8E] font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-[var(--font-dm-sans)] text-2xl font-extrabold text-[#2D2D2D]">My Subscription</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: main box info */}
        <div className="md:col-span-2 space-y-6">

          {/* Plan status card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-[#7CAE8E]" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-[#7CAE8E] font-bold uppercase tracking-widest mb-1">Active Plan</p>
                  <h2 className="font-[var(--font-dm-sans)] text-xl font-extrabold text-[#2D2D2D]">
                    {planData?.name || "Custom"} {isCustom && <span className="text-sm font-normal text-[#7CAE8E]">· No Limit</span>}
                  </h2>
                  {!isCustom && planData && (
                    <p className="text-[#7CAE8E] font-bold text-lg mt-0.5">₱{planData.price}<span className="text-xs font-normal text-gray-400">/mo</span></p>
                  )}
                  {isCustom && (
                    <p className="text-[#7CAE8E] text-sm mt-0.5">Pay-per-item · Modify anytime</p>
                  )}
                </div>
                <span className="bg-[#7CAE8E]/10 text-[#5F8F72] text-xs font-bold px-3 py-1 rounded-full border border-[#7CAE8E]/30">
                  ✓ Active
                </span>
              </div>

              {!isCustom && (
                <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-50 pt-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Items in box</p>
                    <p className="font-semibold text-[#2D2D2D]">{items.length} / {planData?.items}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Next delivery</p>
                    <p className="font-semibold text-[#2D2D2D]">{deliveryLabel}</p>
                  </div>
                  {orderDetails && (orderDetails as { form?: { address?: string } }).form?.address && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Deliver to</p>
                      <p className="font-semibold text-[#2D2D2D] text-xs truncate max-w-[120px]">
                        {(orderDetails as { form?: { address?: string } }).form?.address}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isCustom && (
                <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-50 pt-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Items saved</p>
                    <p className="font-semibold text-[#2D2D2D]">{items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Box type</p>
                    <p className="font-semibold text-[#7CAE8E]">Custom · Unlimited</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items in box */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D]">Box Contents</h3>
              <span className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-gray-400">No items in your box yet.</p>
            ) : (
              <ul className="space-y-3" aria-label="Items in your subscription box">
                {items.map((item, idx) => (
                  <li key={`${item.id}-${idx}`} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2D2D2D] leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {item.isLocal && <span className="text-[10px] bg-[#7CAE8E]/10 text-[#5F8F72] px-1.5 py-0.5 rounded-full">🇵🇭</span>}
                      {item.isEco && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">♻️</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Right: actions + CSR summary */}
        <div className="space-y-4">

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-4">Manage</h3>
            <div className="space-y-3">
              <button
                onClick={handleEditBox}
                className="w-full min-h-[48px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white py-3 rounded-full text-sm font-bold transition-colors"
              >
                Edit My Box ✏️
              </button>
              <Link href="/plans" className="block">
                <button className="w-full min-h-[48px] border-2 border-[#7CAE8E] text-[#7CAE8E] hover:bg-[#7CAE8E] hover:text-white py-3 rounded-full text-sm font-bold transition-colors">
                  Change Plan
                </button>
              </Link>
              {!isCustom && (
                <Link href="/plans?id=custom" className="block">
                  <button className="w-full min-h-[44px] border border-gray-200 text-gray-500 hover:border-[#7CAE8E] hover:text-[#7CAE8E] py-2.5 rounded-full text-sm transition-colors">
                    Switch to Custom Box
                  </button>
                </Link>
              )}
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full text-xs text-gray-400 hover:text-red-400 py-2 transition-colors underline"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Impact summary */}
          {items.length > 0 && (
            <div className="bg-[#FAFAF7] border border-green-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-[#7CAE8E] uppercase tracking-widest mb-3">Your Impact</p>
              <div className="space-y-2.5">
                {localCount > 0 && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🇵🇭</span>
                    <p className="text-xs text-gray-600">{localCount} Filipino brand{localCount > 1 ? "s" : ""} supported</p>
                  </div>
                )}
                {ecoCount > 0 && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">♻️</span>
                    <p className="text-xs text-gray-600">{ecoCount} eco-friendly item{ecoCount > 1 ? "s" : ""} chosen</p>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🌱</span>
                  <p className="text-xs text-gray-600">Supporting UN SDG 12: Responsible Consumption</p>
                </div>
              </div>
            </div>
          )}

          {/* Help */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-xs text-gray-400 mb-3">Need help with your box?</p>
            <Link href="/contact">
              <button className="text-xs text-[#7CAE8E] font-semibold hover:underline">Contact Support →</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCancelConfirm(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm subscription cancellation"
        >
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-2">Cancel Subscription?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will remove your active box and plan. You can always start a new subscription later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 min-h-[48px] border-2 border-gray-200 text-gray-600 rounded-full font-semibold hover:border-gray-300 transition-colors"
              >
                Keep It
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 min-h-[48px] bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
