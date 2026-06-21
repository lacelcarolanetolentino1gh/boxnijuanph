"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PLANS, Product } from "@/lib/data";
import StepIndicator from "@/components/StepIndicator";
import Image from "next/image";

type BoxUser = { name: string; email: string; provider: string; avatar: string };
type SavedAddress = { id: string; label: string; address: string; city: string; zipCode: string; isDefault: boolean };

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
  const [phoneError, setPhoneError] = useState("");

  // Validates Philippine mobile numbers: 09XXXXXXXXX (11 digits) or +639XXXXXXXXX (13 chars)
  const isValidPHPhone = (val: string) => /^(09\d{9}|\+639\d{9})$/.test(val.replace(/[\s\-()]/g, ""));

  const handlePhoneBlur = () => {
    if (form.phone && !isValidPHPhone(form.phone)) {
      setPhoneError("Enter a valid PH number (e.g. 09171234567 or +639171234567)");
    } else {
      setPhoneError("");
    }
  };
  const [loggedInUser, setLoggedInUser] = useState<BoxUser | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new" | null>(null);
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
      const em = user.email;
      setLoggedInUser(user);

      // Load saved addresses (email-keyed)
      const storedAddresses = localStorage.getItem(`boxAddresses_${em}`);
      let addresses: SavedAddress[] = [];
      if (storedAddresses) {
        try { addresses = JSON.parse(storedAddresses); } catch { /* ignore */ }
      }
      setSavedAddresses(addresses);

      // Pre-fill from saved profile first, then fall back to user account data
      const storedProfile = localStorage.getItem(`boxProfile_${em}`);
      if (storedProfile) {
        const prof = JSON.parse(storedProfile);
        setForm((prev) => ({
          ...prev,
          fullName: prof.displayName || user.name,
          email: user.email,
          phone: prof.phone || "",
          address: prof.address || "",
          city: prof.city || "",
          zipCode: prof.zipCode || "",
          payment: prof.defaultPayment || "gcash",
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          fullName: user.name,
          email: user.email,
        }));
      }

      // Pre-select default saved address if available
      if (addresses.length > 0) {
        const def = addresses.find((a) => a.isDefault) || addresses[0];
        setSelectedAddressId(def.id);
        setForm((prev) => ({
          ...prev,
          address: def.address,
          city: def.city,
          zipCode: def.zipCode,
        }));
      }
    } else {
      // Guest — load addresses from generic key (none expected, but keep consistent)
      const storedAddresses = localStorage.getItem("boxAddresses");
      if (storedAddresses) {
        try { setSavedAddresses(JSON.parse(storedAddresses)); } catch { /* ignore */ }
      }
    }
  }, []);

  const planData = PLANS.find((p) => p.id === plan);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setForm((prev) => ({ ...prev, address: addr.address, city: addr.city, zipCode: addr.zipCode }));
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId("new");
    setForm((prev) => ({ ...prev, address: "", city: "", zipCode: "" }));
  };

  const isComplete = !!(form.fullName && form.email && form.phone && isValidPHPhone(form.phone) && form.address && form.city && form.zipCode);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setShowConfirm(true); // Show confirmation dialog — Robustness, Error Prevention
  };

  const handleConfirmOrder = () => {
    const orderNumber = `BNJ-${Math.floor(100000 + Math.random() * 900000)}`;
    if (loggedInUser) {
      localStorage.setItem(`boxOrder_${loggedInUser.email}`, JSON.stringify({ plan, items, form, orderNumber }));
      localStorage.removeItem(`boxDraft_${loggedInUser.email}`);
    } else {
      localStorage.setItem("orderDetails", JSON.stringify({ plan, items, form, orderNumber }));
    }
    localStorage.removeItem("boxDraftRestored");
    router.push("/confirmation");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <StepIndicator current="checkout" />

      {/* Back link */}
      <div className="mb-6">
        <Link href="/summary" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#7CAE8E] transition-colors">
          ← Back to Summary
        </Link>
      </div>

      <h1 className="font-[var(--font-dm-sans)] text-4xl font-bold text-[#2D2D2D] mb-2">Checkout</h1>
      <p className="text-gray-500 mb-6">Enter your delivery and payment details.</p>

      {/* Logged-in user chip */}
      {loggedInUser ? (
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-800 mb-8">
          <div className="w-6 h-6 rounded-full bg-[#7CAE8E] text-white flex items-center justify-center text-xs font-bold" aria-hidden="true">
            {loggedInUser.avatar}
          </div>
          <span>
            Signed in as <strong>{loggedInUser.name}</strong> via {PROVIDER_LABELS[loggedInUser.provider] ?? loggedInUser.provider}
          </span>
          <span className="text-green-600 text-xs">✓</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8" role="note" aria-label="Guest checkout notice">
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800 mb-1">⚠ You&apos;re checking out as a guest</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Your delivery details are collected solely for fulfillment and protected under <strong>RA 10173</strong> (Data Privacy Act of 2012). As a guest, you will not be able to track or manage your subscription after checkout.
            </p>
          </div>
          <Link href="/login?redirect=/checkout" className="shrink-0">
            <button className="min-h-[40px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-5 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap">
              Sign In Instead
            </button>
          </Link>
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px]"
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
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px]"
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
                    onChange={(e) => { handleChange(e); setPhoneError(""); }}
                    onBlur={handlePhoneBlur}
                    required
                    placeholder="09171234567"
                    aria-required="true"
                    aria-describedby={phoneError ? "phone-error" : undefined}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 min-h-[48px] transition-colors ${
                      phoneError
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : "border-gray-200 focus:border-[#7CAE8E] focus:ring-[#7CAE8E]/20"
                    }`}
                  />
                  {phoneError && (
                    <p id="phone-error" className="text-xs text-red-500 mt-1 ml-1">{phoneError}</p>
                  )}
                </div>
              </div>

              {/* Saved address picker — shown only when user has saved addresses */}
              {savedAddresses.length > 0 ? (
                <div>
                  <p className="block text-sm font-medium text-gray-600 mb-2">
                    Delivery Address <span className="text-red-400" aria-hidden="true">*</span>
                  </p>
                  <div className="space-y-2" role="radiogroup" aria-label="Select delivery address">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                          selectedAddressId === addr.id
                            ? "border-[#7CAE8E] bg-[#7CAE8E]/5"
                            : "border-gray-200 hover:border-[#7CAE8E]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="savedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => handleSelectSavedAddress(addr)}
                          className="accent-[#7CAE8E] w-4 h-4 mt-0.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-[#2D2D2D]">{addr.label}</span>
                            {addr.isDefault && <span className="text-[10px] bg-[#7CAE8E] text-white px-2 py-0.5 rounded-full">Default</span>}
                          </div>
                          <p className="text-xs text-gray-500">{addr.address}, {addr.city} {addr.zipCode}</p>
                        </div>
                      </label>
                    ))}
                    <label
                      className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                        selectedAddressId === "new"
                          ? "border-[#7CAE8E] bg-[#7CAE8E]/5"
                          : "border-gray-200 hover:border-[#7CAE8E]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        value="new"
                        checked={selectedAddressId === "new"}
                        onChange={handleUseNewAddress}
                        className="accent-[#7CAE8E] w-4 h-4 shrink-0"
                      />
                      <span className="text-sm text-gray-500 font-medium">+ Use a different address</span>
                    </label>
                  </div>

                  {/* One-time manual entry — only shown when "new" selected */}
                  {selectedAddressId === "new" && (
                    <div className="mt-3 space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50">
                      <div>
                        <label htmlFor="address" className="block text-xs font-medium text-gray-600 mb-1">
                          Street / Barangay <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="address"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          required
                          placeholder="Street, Barangay"
                          aria-required="true"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[44px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">
                            City / Municipality <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="city"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            placeholder="Maynila"
                            aria-required="true"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[44px]"
                          />
                        </div>
                        <div>
                          <label htmlFor="zipCode" className="block text-xs font-medium text-gray-600 mb-1">
                            ZIP Code <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="zipCode"
                            name="zipCode"
                            value={form.zipCode}
                            onChange={handleChange}
                            required
                            placeholder="1000"
                            aria-required="true"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[44px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      <span className="text-red-400">*</span> Required · Protected under RA 10173
                    </p>
                    <Link href="/my-box?tab=profile" className="text-xs text-[#7CAE8E] hover:underline font-medium">
                      Manage addresses →
                    </Link>
                  </div>
                </div>
              ) : (
                /* No saved addresses — show regular manual fields */
                <>
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
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px]"
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
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px]"
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
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px]"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    <span className="text-red-400">*</span> Required fields · Protected under RA 10173 (Data Privacy Act of 2012)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-[var(--font-dm-sans)] font-semibold text-[#2D2D2D] mb-4">Payment Method</h2>
            <fieldset>
              <legend className="sr-only">Select a payment method</legend>
              <div className="space-y-3">
                {[
                  { value: "gcash", logo: "/gcash-logo.svg", label: "GCash", width: 72, height: 18 },
                  { value: "maya", logo: "/maya-logo.svg", label: "Maya", width: 56, height: 22 },
                  { value: "credit", label: "💳 Credit / Debit Card" },
                  { value: "cod", label: "💵 Cash on Delivery" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors min-h-[52px] ${
                      form.payment === option.value
                        ? "border-[#7CAE8E] bg-green-50"
                        : "border-gray-200 hover:border-[#7CAE8E]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={form.payment === option.value}
                      onChange={handleChange}
                      className="accent-[#7CAE8E] w-4 h-4"
                    />
                    {"logo" in option ? (
                      <Image src={option.logo!} alt={option.label} width={option.width} height={option.height} unoptimized />
                    ) : (
                      <span className="text-sm font-medium">{option.label}</span>
                    )}
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
                <Link href="/privacy" className="underline hover:text-[#7CAE8E] transition-colors">View our Privacy Policy →</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-[#FAFAF7] border border-green-100 rounded-2xl p-6 sticky top-24">
            <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  <span className="text-gray-700 text-xs font-medium leading-tight">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="flex justify-between font-bold text-[#2D2D2D]">
                <span>{planData?.name} Plan</span>
                <span className="text-[#7CAE8E]">₱{planData?.price}/mo</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Billed monthly · Cancel anytime</p>
            </div>
            <button
              type="submit"
              disabled={!isComplete}
              aria-disabled={!isComplete}
              className={`w-full mt-6 py-3 rounded-full font-semibold text-sm transition-colors min-h-[48px] ${
                isComplete
                  ? "bg-[#7CAE8E] text-white hover:bg-[#5F8F72]"
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
              Plan: <span className="font-semibold text-[#7CAE8E]">{planData?.name} — ₱{planData?.price}/mo</span>
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
                className="flex-1 min-h-[48px] bg-[#7CAE8E] text-white rounded-full font-semibold text-sm hover:bg-[#5F8F72] transition-colors"
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
