"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PLANS, Product } from "@/lib/data";

type BoxUser = { name: string; email: string; provider: string; avatar?: string };
type BoxProfile = {
  displayName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  defaultPayment: string;
  profilePic?: string; // base64 data URL
};

const PAYMENT_OPTIONS = [
  { value: "gcash", logo: "/gcash-logo.svg", label: "GCash", width: 72, height: 18 },
  { value: "maya", logo: "/maya-logo.svg", label: "Maya", width: 56, height: 22 },
  { value: "credit", label: "💳 Credit / Debit Card" },
  { value: "cod", label: "💵 Cash on Delivery" },
];

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  apple: "Apple",
  facebook: "Facebook",
};

function MyBoxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<BoxUser | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<string, unknown> | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<"box" | "profile">("box");

  // Profile form state
  const [profile, setProfile] = useState<BoxProfile>({
    displayName: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    defaultPayment: "gcash",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfile((p) => {
        const updated = { ...p, profilePic: dataUrl };
        // Auto-save immediately so the photo persists across navigation/logout
        localStorage.setItem("boxProfile", JSON.stringify(updated));
        if (user) {
          const updatedUser = { ...user, avatar: dataUrl };
          localStorage.setItem("boxUser", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        return updated;
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setHydrated(true);
    // Open profile tab if ?tab=profile in URL
    if (searchParams.get("tab") === "profile") setActiveTab("profile");

    const storedUser = localStorage.getItem("boxUser");
    if (!storedUser) {
      router.push("/login?redirect=/my-box");
      return;
    }
    const parsedUser: BoxUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Load saved profile or pre-fill from user + orderDetails
    const storedProfile = localStorage.getItem("boxProfile");
    const storedOrder = localStorage.getItem("orderDetails");

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else if (storedOrder) {
      const data = JSON.parse(storedOrder);
      const form = data.form || {};
      setProfile({
        displayName: parsedUser.name,
        phone: form.phone || "",
        address: form.address || "",
        city: form.city || "",
        zipCode: form.zipCode || "",
        defaultPayment: form.payment || "gcash",
      });
    } else {
      setProfile((p) => ({ ...p, displayName: parsedUser.name }));
    }

    if (storedOrder) {
      const data = JSON.parse(storedOrder);
      setOrderDetails(data);
      setPlan(data.plan || null);
      setItems(data.items || []);
    }
  }, [router]);

  const planData = plan ? PLANS.find((p) => p.id === plan) : null;
  const isCustom = plan === "custom";
  const localCount = items.filter((i) => i.isLocal).length;
  const ecoCount = items.filter((i) => i.isEco).length;

  const nextDelivery = new Date();
  nextDelivery.setDate(nextDelivery.getDate() + 14);
  const deliveryLabel = nextDelivery.toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });

  const handleEditBox = () => {
    if (plan) localStorage.setItem("selectedPlan", plan);
    const restoredSelected = items.map((item) => {
      const dashIdx = item.name.lastIndexOf(" — ");
      const baseName = dashIdx !== -1 ? item.name.slice(0, dashIdx) : item.name;
      const variantRaw = dashIdx !== -1 ? item.name.slice(dashIdx + 3) : (item.variants?.[0] ?? "");
      // Parse "Variant ×qty" format
      const qtyMatch = variantRaw.match(/^(.*)\s×(\d+)$/);
      const variant = qtyMatch ? qtyMatch[1] : variantRaw;
      const qty = qtyMatch ? parseInt(qtyMatch[2], 10) : 1;
      return { product: { ...item, name: baseName }, variant, qty };
    });
    localStorage.setItem("selectedItems", JSON.stringify(restoredSelected));
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

  const handleProfileSave = () => {
    localStorage.setItem("boxProfile", JSON.stringify(profile));
    if (user) {
      const updated = { ...user, name: profile.displayName, avatar: profile.profilePic || user.avatar };
      localStorage.setItem("boxUser", JSON.stringify(updated));
      setUser(updated);
    }
    setProfileSaved(true);
    setProfileEditing(false);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (!hydrated) return null;
  if (!user) return null;

  if (cancelled) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📦</span>
        </div>
        <h1 className="font-[var(--font-dm-sans)] text-2xl font-bold text-[#2D2D2D] mb-3">Subscription Cancelled</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your subscription has been cancelled. We&apos;re sad to see you go{user ? `, ${user.name.split(" ")[0]}` : ""}!
        </p>
        <Link href="/plans">
          <button className="min-h-[48px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-8 py-3 rounded-full font-bold transition-colors">
            Start a New Box →
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#7CAE8E] transition-colors mb-4">
          ← Back to Home
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-[#7CAE8E]/20 flex items-center justify-center text-[#7CAE8E] font-bold text-lg">
              {profile.profilePic ? (
                <Image src={profile.profilePic} alt={user.name} width={48} height={48} className="w-full h-full object-cover" unoptimized />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="font-[var(--font-dm-sans)] text-2xl font-extrabold text-[#2D2D2D]">{user.name}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-1.5">
                {user.email}
                {user.provider && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    via {PROVIDER_LABELS[user.provider] ?? user.provider}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "box"}
          onClick={() => setActiveTab("box")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[36px] ${
            activeTab === "box" ? "bg-white text-[#2D2D2D] shadow-sm" : "text-gray-500 hover:text-[#2D2D2D]"
          }`}
        >
          📦 My Box
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[36px] ${
            activeTab === "profile" ? "bg-white text-[#2D2D2D] shadow-sm" : "text-gray-500 hover:text-[#2D2D2D]"
          }`}
        >
          👤 Profile
        </button>
      </div>

      {/* ── MY BOX TAB ── */}
      {activeTab === "box" && (
        <>
          {(!plan && items.length === 0) ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#7CAE8E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📭</span>
              </div>
              <h2 className="font-[var(--font-dm-sans)] text-xl font-bold text-[#2D2D2D] mb-3">No Active Subscription</h2>
              <p className="text-gray-500 text-sm mb-8">
                You don&apos;t have an active box yet. Start building yours today!
              </p>
              <Link href="/plans">
                <button className="min-h-[48px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-8 py-3 rounded-full font-bold transition-colors">
                  Choose a Plan →
                </button>
              </Link>
            </div>
          ) : (
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
                        <p className="text-[#7CAE8E] font-bold text-lg mt-0.5">
                          ₱{planData?.price}<span className="text-xs font-normal text-gray-400">/mo</span>
                        </p>
                        {isCustom && (
                          <p className="text-xs text-gray-400 mt-0.5">Unlimited items · Modify anytime</p>
                        )}
                      </div>
                      <span className="bg-[#7CAE8E]/10 text-[#5F8F72] text-xs font-bold px-3 py-1 rounded-full border border-[#7CAE8E]/30">
                        ✓ Active
                      </span>
                    </div>
                    {!isCustom && (
                      <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-50 pt-4 flex-wrap">
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
                            <p className="font-semibold text-[#2D2D2D] text-xs truncate max-w-[140px]">
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

              {/* Right: actions + impact */}
              <div className="space-y-4">
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
                      <button
                        onClick={() => { localStorage.setItem("selectedPlan", "custom"); router.push("/builder"); }}
                        className="w-full min-h-[44px] border border-gray-200 text-gray-500 hover:border-[#7CAE8E] hover:text-[#7CAE8E] py-2.5 rounded-full text-sm transition-colors"
                      >
                        Switch to Custom Box
                      </button>
                    )}
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full text-xs text-gray-400 hover:text-red-400 py-2 transition-colors underline"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>

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
                        <p className="text-xs text-gray-600">Supporting UN SDG 12</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                  <p className="text-xs text-gray-400 mb-3">Need help with your box?</p>
                  <Link href="/contact">
                    <button className="text-xs text-[#7CAE8E] font-semibold hover:underline">Contact Support →</button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── PROFILE TAB ── */}
      {activeTab === "profile" && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">

            {/* Profile picture */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-4">Profile Picture</h3>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-[#7CAE8E]/20 flex items-center justify-center text-[#7CAE8E] font-bold text-2xl shrink-0 border-2 border-[#7CAE8E]/30">
                  {profile.profilePic ? (
                    <Image src={profile.profilePic} alt="Profile" width={80} height={80} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">
                    {profile.profilePic ? "Looking good! You can replace it anytime." : "Add a photo so we know it's you."}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[40px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors"
                    >
                      {profile.profilePic ? "Change Photo" : "Upload Photo"}
                    </button>
                    {profile.profilePic && (
                      <button
                        onClick={() => setProfile((p) => {
                          const updated = { ...p, profilePic: undefined };
                          localStorage.setItem("boxProfile", JSON.stringify(updated));
                          if (user) {
                            const updatedUser = { ...user, avatar: undefined };
                            localStorage.setItem("boxUser", JSON.stringify(updatedUser));
                            setUser(updatedUser);
                          }
                          return updated;
                        })}
                        className="min-h-[40px] border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-400 px-4 py-2 rounded-full text-xs font-medium transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">JPG or PNG · Max 2MB · Stored locally on your device</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfilePicChange}
                className="hidden"
                aria-label="Upload profile picture"
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1.5 w-full bg-[#7CAE8E]" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D]">Account Details</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                    via {PROVIDER_LABELS[user.provider] ?? user.provider}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email address</label>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500">
                      <span className="flex-1">{user.email}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">read-only</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">Managed by your {PROVIDER_LABELS[user.provider] ?? user.provider} account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable profile */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D]">Personal Information</h3>
                {!profileEditing && (
                  <button
                    onClick={() => setProfileEditing(true)}
                    className="text-xs text-[#7CAE8E] font-semibold hover:underline"
                  >
                    Edit ✏️
                  </button>
                )}
              </div>

              {profileSaved && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-4 text-sm text-green-700">
                  <span>✓</span> Profile saved successfully!
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-xs font-medium text-gray-600 mb-1">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleProfileChange}
                    disabled={!profileEditing}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    disabled={!profileEditing}
                    placeholder="09XX-XXX-XXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Default delivery address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-1">Default Delivery Address</h3>
              <p className="text-xs text-gray-400 mb-5">Pre-filled automatically at checkout when you order.</p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-xs font-medium text-gray-600 mb-1">
                    Street / Barangay
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    disabled={!profileEditing}
                    placeholder="123 Rizal St, Brgy. San Antonio"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">
                      City / Municipality
                    </label>
                    <input
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={handleProfileChange}
                      disabled={!profileEditing}
                      placeholder="Maynila"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-xs font-medium text-gray-600 mb-1">
                      ZIP Code
                    </label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      value={profile.zipCode}
                      onChange={handleProfileChange}
                      disabled={!profileEditing}
                      placeholder="1000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Default payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] mb-1">Default Payment Method</h3>
              <p className="text-xs text-gray-400 mb-5">Pre-selected at checkout. You can always change it before placing an order.</p>
              <div className="space-y-2" role="radiogroup" aria-label="Default payment method">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3 min-h-[52px] transition-colors ${
                      profileEditing ? "cursor-pointer" : "cursor-default pointer-events-none opacity-70"
                    } ${
                      profile.defaultPayment === opt.value
                        ? "border-[#7CAE8E] bg-green-50"
                        : "border-gray-200"
                    } ${profileEditing && profile.defaultPayment !== opt.value ? "hover:border-[#7CAE8E]" : ""}`}
                  >
                    <input
                      type="radio"
                      name="defaultPayment"
                      value={opt.value}
                      checked={profile.defaultPayment === opt.value}
                      onChange={handleProfileChange}
                      className="accent-[#7CAE8E] w-4 h-4"
                    />
                    {"logo" in opt ? (
                      <Image src={(opt as { logo: string }).logo} alt={opt.label} width={(opt as { width: number }).width} height={(opt as { height: number }).height} unoptimized />
                    ) : (
                      <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Save / Cancel buttons */}
            {profileEditing && (
              <div className="flex gap-3">
                <button
                  onClick={() => setProfileEditing(false)}
                  className="flex-1 min-h-[48px] border-2 border-gray-200 text-gray-600 rounded-full font-semibold text-sm hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileSave}
                  className="flex-1 min-h-[48px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white rounded-full font-semibold text-sm transition-colors"
                >
                  Save Changes ✓
                </button>
              </div>
            )}

          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-[#FAFAF7] border border-green-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-[#7CAE8E] uppercase tracking-widest mb-3">🔒 Privacy</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Your personal information is protected under <strong className="text-gray-700">RA 10173</strong> (Data Privacy Act of 2012). It is used solely for order fulfillment and delivery.
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                We never sell or share your data with third parties.
              </p>
              <Link href="/privacy">
                <button className="text-xs text-[#7CAE8E] font-semibold hover:underline mt-3 block">
                  View Privacy Policy →
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <p className="text-xs text-gray-400 mb-3">Need help with your account?</p>
              <Link href="/contact">
                <button className="text-xs text-[#7CAE8E] font-semibold hover:underline">Contact Support →</button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-red-100 p-5 text-center">
              <p className="text-xs text-gray-400 mb-3">Done for now?</p>
              <button
                onClick={() => {
                  localStorage.removeItem("boxUser");
                  localStorage.removeItem("boxProfile");
                  router.push("/");
                }}
                className="w-full min-h-[40px] border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-full text-sm font-semibold transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel subscription dialog */}
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

export default function MyBoxPage() {
  return (
    <Suspense>
      <MyBoxContent />
    </Suspense>
  );
}
