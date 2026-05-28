"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PLANS, Product } from "@/lib/data";
import StepIndicator from "@/components/StepIndicator";

type BoxUser = { name: string; email: string; provider: string; avatar: string };

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  apple: "Apple",
  facebook: "Facebook",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<string>("basic");
  const [items, setItems] = useState<Product[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<BoxUser | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    payment: "gcash",
  });

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan") || "basic";
    const storedItems = localStorage.getItem("selectedItems");
    const storedUser = localStorage.getItem("boxUser");
    setPlan(storedPlan);
    if (storedItems) setItems(JSON.parse(storedItems));
    if (storedUser) {
      const user: BoxUser = JSON.parse(storedUser);
      setLoggedInUser(user);
      // Pre-fill name and email from social login
      setForm((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
    }
  }, []);

  const planData = PLANS.find((p) => p.id === plan);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isComplete = !!(form.fullName && form.email && form.phone && form.address && form.city && form.zipCode);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setShowConfirm(true); // Show confirmation dialog — Robustness, Error Prevention
  };

  const handleConfirmOrder = () => {
    localStorage.setItem("orderDetails", JSON.stringify({ plan, items, form }));
    router.push("/confirmation");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <StepIndicator current="checkout" />

      {/* Back link */}
      <div className="mb-6">
        <Link href="/summary" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#7D9B76] transition-colors">
          ← Back to Summary
        </Link>
      </div>

      <h1 className="font-[var(--font-dm-sans)] text-4xl font-bold text-[#2D2D2D] mb-2">Checkout</h1>
      <p className="text-gray-500 mb-6">Enter your delivery and payment details.</p>

      {/* Logged-in user chip */}
      {loggedInUser && (
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-800 mb-8">
          <div className="w-6 h-6 rounded-full bg-[#7D9B76] text-white flex items-center justify-center text-xs font-bold" aria-hidden="true">
            {loggedInUser.avatar}
          </div>
          <span>
            Signed in as <strong>{loggedInUser.name}</strong> via {PROVIDER_LABELS[loggedInUser.provider] ?? loggedInUser.provider}
          </span>
          <span className="text-green-600 text-xs">✓</span>
        </div>
      )}

      <form onSubmit={handleSubmitRequest} noValidate className="flex gap-8 flex-col md:flex-row">
        {/* Left: Form */}
        <div className="flex-1 space-y-6">
          {/* Delivery */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-[var(--font-dm-sans)] font-semibold text-[#2D2D2D] mb-4">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Juan dela Cruz"
                  aria-required="true"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7D9B76] focus:ring-2 focus:ring-[#7D9B76]/20 min-h-[48px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                    Email <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="juan@email.com"
                    aria-required="true"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7D9B76] focus:ring-2 focus:ring-[#7D9B76]/20 min-h-[48px]"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="09XX-XXX-XXXX"
                    aria-required="true"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7D9B76] focus:ring-2 focus:ring-[#7D9B76]/20 min-h-[48px]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">
                  Delivery Address <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Street, Barangay"
                  aria-required="true"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7D9B76] focus:ring-2 focus:ring-[#7D9B76]/20 min-h-[48px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">
                    City / Municipality <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="Maynila"
                    aria-required="true"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7D9B76] focus:ring-2 focus:ring-[#7D9B76]/20 min-h-[48px]"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-600 mb-1">
                    ZIP Code <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                    required
                    placeholder="1000"
                    aria-required="true"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7D9B76] focus:ring-2 focus:ring-[#7D9B76]/20 min-h-[48px]"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                <span className="text-red-400">*</span> Required fields · Protected under RA 10173 (Data Privacy Act of 2012)
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-[var(--font-dm-sans)] font-semibold text-[#2D2D2D] mb-4">Payment Method</h2>
            <fieldset>
              <legend className="sr-only">Select a payment method</legend>
              <div className="space-y-3">
                {[
                  { value: "gcash", label: "💚 GCash" },
                  { value: "maya", label: "💙 Maya" },
                  { value: "credit", label: "💳 Credit / Debit Card" },
                  { value: "cod", label: "💵 Cash on Delivery" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors min-h-[52px] ${
                      form.payment === option.value
                        ? "border-[#7D9B76] bg-green-50"
                        : "border-gray-200 hover:border-[#7D9B76]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={form.payment === option.value}
                      onChange={handleChange}
                      className="accent-[#7D9B76] w-4 h-4"
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {/* Security & Privacy card */}
            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Security & Privacy</p>
              <ul className="space-y-1.5 text-xs text-gray-500">
                <li className="flex gap-2"><span>🔒</span> SSL/TLS encrypted — your data is safe in transit</li>
                <li className="flex gap-2"><span>💳</span> Card data handled by PayMongo (PCI-DSS Level 1) — we never see your card number</li>
                <li className="flex gap-2"><span>🇵🇭</span> Compliant with <strong className="text-gray-600">RA 10173</strong> — data used for delivery purposes only</li>
                <li className="flex gap-2"><span>🚫</span> Your data is never sold or shared with third parties</li>
              </ul>
              <p className="text-xs text-gray-400 mt-2">
                <Link href="/privacy" className="underline hover:text-[#7D9B76] transition-colors">View our Privacy Policy →</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-[#F5EFE6] rounded-2xl p-6 sticky top-24">
            <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <span aria-hidden="true">{item.emoji}</span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="flex justify-between font-bold text-[#2D2D2D]">
                <span>{planData?.name} Plan</span>
                <span className="text-[#7D9B76]">₱{planData?.price}/mo</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Billed monthly · Cancel anytime</p>
            </div>
            <button
              type="submit"
              disabled={!isComplete}
              aria-disabled={!isComplete}
              className={`w-full mt-6 py-3 rounded-full font-semibold text-sm transition-colors min-h-[48px] ${
                isComplete
                  ? "bg-[#7D9B76] text-white hover:bg-[#5e7a58]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Place Order →
            </button>
            {!isComplete && (
              <p className="text-xs text-gray-400 text-center mt-2">Fill in all fields to continue</p>
            )}
          </div>
        </div>
      </form>

      {/* Confirmation modal — Robustness + Error Prevention (Chapter 8) */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-desc"
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <h2 id="confirm-title" className="font-[var(--font-dm-sans)] font-bold text-xl text-[#2D2D2D] mb-2">
              Confirm Your Order
            </h2>
            <p id="confirm-desc" className="text-sm text-gray-500 mb-1">
              Delivering to: <span className="font-semibold text-[#2D2D2D]">{form.fullName}</span>
            </p>
            <p className="text-sm text-gray-500 mb-1">
              {form.address}, {form.city} {form.zipCode}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Plan: <span className="font-semibold text-[#7D9B76]">{planData?.name} — ₱{planData?.price}/mo</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 min-h-[48px] border-2 border-gray-200 text-gray-600 rounded-full font-semibold text-sm hover:border-gray-400 transition-colors"
              >
                ← Go Back
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 min-h-[48px] bg-[#7D9B76] text-white rounded-full font-semibold text-sm hover:bg-[#5e7a58] transition-colors"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
