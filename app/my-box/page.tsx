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
  profilePic?: string;
};
export type SavedAddress = {
  id: string;
  label: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
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
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseMonths, setPauseMonths] = useState(1);
  const [pausedUntil, setPausedUntil] = useState<string | null>(null);

  const [draftRestored, setDraftRestored] = useState(false);
  const [orderHistory, setOrderHistory] = useState<Record<string, unknown>[]>([]);

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

  // Address book
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [addressForm, setAddressForm] = useState({ label: "Home", address: "", city: "", zipCode: "" });
  const [addressSaved, setAddressSaved] = useState(false);
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
      const em = getEmail();
      setProfile((p) => {
        const updated = { ...p, profilePic: dataUrl };
        // Auto-save immediately so the photo persists across navigation/logout
        localStorage.setItem(`boxProfile_${em}`, JSON.stringify(updated));
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
    const em = parsedUser.email;
    setUser(parsedUser);

    // Load saved profile or pre-fill from user + orderDetails
    const storedProfile = localStorage.getItem(`boxProfile_${em}`);
    const storedOrder = localStorage.getItem(`boxOrder_${em}`);

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

    // Check if an incomplete box draft was restored on login
    if (localStorage.getItem("boxDraftRestored")) {
      setDraftRestored(true);
      localStorage.removeItem("boxDraftRestored");
    }

    // Load saved addresses
    const storedAddresses = localStorage.getItem(`boxAddresses_${em}`);
    if (storedAddresses) {
      try { setAddresses(JSON.parse(storedAddresses)); } catch { /* ignore */ }
    }

    // Load pause state
    const storedPause = localStorage.getItem(`boxPausedUntil_${em}`);
    if (storedPause) setPausedUntil(storedPause);

    // Load order history
    const storedHistory = localStorage.getItem(`boxOrderHistory_${em}`);
    if (storedHistory) {
      try { setOrderHistory(JSON.parse(storedHistory)); } catch { /* ignore */ }
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

  const getEmail = () => {
    try { return JSON.parse(localStorage.getItem("boxUser") || "{}").email || ""; } catch { return ""; }
  };

  const handleCancelSubscription = () => {
    const em = getEmail();
    // Archive current order to history before clearing
    const storedOrder = localStorage.getItem(`boxOrder_${em}`);
    if (storedOrder) {
      try {
        const order = JSON.parse(storedOrder);
        const history = JSON.parse(localStorage.getItem(`boxOrderHistory_${em}`) || "[]");
        const archived = { ...order, cancelledAt: new Date().toISOString() };
        const updated = [archived, ...history];
        localStorage.setItem(`boxOrderHistory_${em}`, JSON.stringify(updated));
        setOrderHistory(updated);
      } catch { /* ignore */ }
    }
    localStorage.removeItem(`boxOrder_${em}`);
    localStorage.removeItem("selectedItems");
    localStorage.removeItem("selectedPlan");
    localStorage.removeItem("customBoxSaved");
    localStorage.removeItem(`boxPausedUntil_${em}`);
    setCancelled(true);
    setShowCancelConfirm(false);
  };

  const handleConfirmPause = () => {
    const em = getEmail();
    const until = new Date();
    until.setMonth(until.getMonth() + pauseMonths);
    const dateStr = until.toISOString();
    localStorage.setItem(`boxPausedUntil_${em}`, dateStr);
    setPausedUntil(dateStr);
    setShowPauseModal(false);
  };

  const handleResume = () => {
    const em = getEmail();
    localStorage.removeItem(`boxPausedUntil_${em}`);
    setPausedUntil(null);
  };

  const isPaused = !!pausedUntil && new Date(pausedUntil) > new Date();
  const pausedUntilLabel = pausedUntil
    ? new Date(pausedUntil).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const saveAddresses = (updated: SavedAddress[]) => {
    const em = getEmail();
    setAddresses(updated);
    localStorage.setItem(`boxAddresses_${em}`, JSON.stringify(updated));
  };

  const handleAddressSave = () => {
    if (!addressForm.address.trim() || !addressForm.city.trim() || !addressForm.zipCode.trim()) return;
    if (editingAddress) {
      const updated = addresses.map((a) =>
        a.id === editingAddress.id ? { ...a, ...addressForm } : a
      );
      saveAddresses(updated);
    } else {
      const isFirst = addresses.length === 0;
      const newAddr: SavedAddress = {
        id: Date.now().toString(),
        label: addressForm.label || "Home",
        address: addressForm.address,
        city: addressForm.city,
        zipCode: addressForm.zipCode,
        isDefault: isFirst,
      };
      saveAddresses([...addresses, newAddr]);
    }
    setAddressForm({ label: "Home", address: "", city: "", zipCode: "" });
    setEditingAddress(null);
    setShowAddressForm(false);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  const handleAddressDelete = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    // If we deleted the default, make the first remaining one default
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    saveAddresses(updated);
  };

  const handleSetDefault = (id: string) => {
    saveAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleAddressEdit = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setAddressForm({ label: addr.label, address: addr.address, city: addr.city, zipCode: addr.zipCode });
    setShowAddressForm(true);
  };

  const handleProfileSave = () => {
    const em = getEmail();
    localStorage.setItem(`boxProfile_${em}`, JSON.stringify(profile));
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
    const lastOrder = orderHistory[0];
    const lastPlanData = lastOrder ? PLANS.find((p) => p.id === (lastOrder as { plan?: string }).plan) : null;
    const lastItems: Product[] = lastOrder ? ((lastOrder as { items?: Product[] }).items || []) : [];
    const lastOrderNumber = (lastOrder as { orderNumber?: string })?.orderNumber;
    const cancelledAtLabel = lastOrder
      ? new Date((lastOrder as { cancelledAt?: string }).cancelledAt || Date.now()).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
      : null;

    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h1 className="font-[var(--font-dm-sans)] text-2xl font-bold text-[#2D2D2D] mb-2">Subscription Cancelled</h1>
          <p className="text-gray-500 text-sm">
            We&apos;re sad to see you go{user ? `, ${user.name.split(" ")[0]}` : ""}! You can resubscribe anytime.
          </p>
        </div>

        {/* Last order card */}
        {lastOrder && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="h-1 w-full bg-gray-200" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Last Order</p>
                  <p className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D]">{lastPlanData?.name || "Custom"} Plan</p>
                  <p className="text-[#7CAE8E] font-bold">₱{lastPlanData?.price}<span className="text-xs font-normal text-gray-400">/mo</span></p>
                </div>
                <div className="text-right">
                  {lastOrderNumber && <p className="text-xs font-mono text-gray-400">{lastOrderNumber}</p>}
                  {cancelledAtLabel && <p className="text-xs text-gray-400 mt-0.5">Cancelled {cancelledAtLabel}</p>}
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">Cancelled</span>
                </div>
              </div>
              {lastItems.length > 0 && (
                <div className="border-t border-gray-50 pt-3 mt-2">
                  <p className="text-xs text-gray-400 mb-2">{lastItems.length} item{lastItems.length !== 1 ? "s" : ""} in this box</p>
                  <div className="flex flex-wrap gap-2">
                    {lastItems.slice(0, 6).map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      </div>
                    ))}
                    {lastItems.length > 6 && (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-semibold shrink-0">
                        +{lastItems.length - 6}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {lastOrder && (
            <button
              onClick={() => {
                const p = (lastOrder as { plan?: string }).plan;
                if (p) localStorage.setItem("selectedPlan", p);
                router.push("/builder");
              }}
              className="flex-1 min-h-[52px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white rounded-full font-bold text-sm transition-colors"
            >
              Resubscribe to {lastPlanData?.name || "Same"} Plan →
            </button>
          )}
          <Link href="/plans" className="flex-1">
            <button className="w-full min-h-[52px] border-2 border-[#7CAE8E] text-[#7CAE8E] hover:bg-[#7CAE8E] hover:text-white rounded-full font-bold text-sm transition-colors">
              Choose a New Plan
            </button>
          </Link>
        </div>

        {/* Full history */}
        {orderHistory.length > 1 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Previous Orders</p>
            <div className="space-y-3">
              {orderHistory.slice(1).map((order, idx) => {
                const pd = PLANS.find((p) => p.id === (order as { plan?: string }).plan);
                const on = (order as { orderNumber?: string }).orderNumber;
                const cat = (order as { cancelledAt?: string }).cancelledAt;
                return (
                  <div key={idx} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#2D2D2D]">{pd?.name || "Custom"} Plan</p>
                      {on && <p className="text-xs font-mono text-gray-400">{on}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{cat ? new Date(cat).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : ""}</p>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">Cancelled</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
          {/* Draft restored banner */}
          {draftRestored && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6">
              <span className="text-xl shrink-0">📦</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800">You have an incomplete box from your last session</p>
                <p className="text-xs text-amber-700 mt-0.5">Your previous selections were restored. Continue building or start fresh.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href="/builder">
                  <button className="min-h-[36px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
                    Continue →
                  </button>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("selectedItems");
                    localStorage.removeItem("selectedPlan");
                    setDraftRestored(false);
                  }}
                  className="min-h-[36px] border border-amber-300 text-amber-700 hover:bg-amber-100 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
                >
                  Start Fresh
                </button>
              </div>
            </div>
          )}
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
                  <div className={`h-1.5 w-full ${isPaused ? "bg-amber-400" : "bg-[#7CAE8E]"}`} />
                  <div className="p-5">
                    {/* Paused notice banner */}
                    {isPaused && (
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4 text-sm text-amber-800">
                        <span>⏸</span>
                        <span className="flex-1 text-xs font-semibold">Subscription paused · Resumes on {pausedUntilLabel}</span>
                        <button onClick={handleResume} className="text-xs text-[#7CAE8E] font-bold hover:underline shrink-0">Resume now</button>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isPaused ? "text-amber-500" : "text-[#7CAE8E]"}`}>
                          {isPaused ? "Paused Plan" : "Active Plan"}
                        </p>
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
                      {isPaused ? (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                          ⏸ Paused
                        </span>
                      ) : (
                        <span className="bg-[#7CAE8E]/10 text-[#5F8F72] text-xs font-bold px-3 py-1 rounded-full border border-[#7CAE8E]/30">
                          ✓ Active
                        </span>
                      )}
                    </div>
                    {!isCustom && (
                      <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-50 pt-4 flex-wrap">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Items in box</p>
                          <p className="font-semibold text-[#2D2D2D]">{items.length} / {planData?.items}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Next delivery</p>
                          <p className="font-semibold text-[#2D2D2D]">{isPaused ? "—" : deliveryLabel}</p>
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
                    {isPaused ? (
                      <button
                        onClick={handleResume}
                        className="w-full min-h-[44px] border-2 border-amber-400 text-amber-600 hover:bg-amber-50 py-2.5 rounded-full text-sm font-bold transition-colors"
                      >
                        ▶ Resume Subscription
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPauseModal(true)}
                        className="w-full min-h-[44px] border border-gray-200 text-gray-500 hover:border-amber-400 hover:text-amber-600 py-2.5 rounded-full text-sm transition-colors"
                      >
                        ⏸ Pause Subscription
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

          {/* Order history — shown whenever there are past orders */}
          {orderHistory.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order History</p>
              <div className="space-y-3">
                {orderHistory.map((order, idx) => {
                  const pd = PLANS.find((p) => p.id === (order as { plan?: string }).plan);
                  const on = (order as { orderNumber?: string }).orderNumber;
                  const cat = (order as { cancelledAt?: string }).cancelledAt;
                  const pastItems: Product[] = (order as { items?: Product[] }).items || [];
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-[#2D2D2D]">{pd?.name || "Custom"} Plan</p>
                          <p className="text-xs text-[#7CAE8E] font-semibold">₱{pd?.price}/mo</p>
                          {on && <p className="text-xs font-mono text-gray-400 mt-0.5">{on}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">Cancelled</span>
                          {cat && <p className="text-xs text-gray-400 mt-1">{new Date(cat).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>}
                        </div>
                      </div>
                      {pastItems.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {pastItems.slice(0, 5).map((item, i) => (
                            <div key={`${item.id}-${i}`} className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                            </div>
                          ))}
                          {pastItems.length > 5 && (
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-semibold">+{pastItems.length - 5}</div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const p = (order as { plan?: string }).plan;
                          if (p) localStorage.setItem("selectedPlan", p);
                          router.push("/builder");
                        }}
                        className="text-xs text-[#7CAE8E] font-semibold hover:underline"
                      >
                        Resubscribe to this plan →
                      </button>
                    </div>
                  );
                })}
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
                          localStorage.setItem(`boxProfile_${getEmail()}`, JSON.stringify(updated));
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

            {/* Address book */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D]">Saved Addresses</h3>
                {addresses.length < 3 && !showAddressForm && (
                  <button
                    onClick={() => { setEditingAddress(null); setAddressForm({ label: "Home", address: "", city: "", zipCode: "" }); setShowAddressForm(true); }}
                    className="text-xs text-[#7CAE8E] font-semibold hover:underline"
                  >
                    + Add Address
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-4">Up to 3 addresses. Your default is pre-selected at checkout.</p>

              {addressSaved && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-4 text-sm text-green-700">
                  <span>✓</span> Address saved!
                </div>
              )}

              {/* Saved address cards */}
              {addresses.length === 0 && !showAddressForm && (
                <p className="text-sm text-gray-400 text-center py-4">No saved addresses yet. Add one to speed up checkout.</p>
              )}
              <div className="space-y-3 mb-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`rounded-xl border-2 px-4 py-3 ${addr.isDefault ? "border-[#7CAE8E] bg-[#7CAE8E]/5" : "border-gray-100"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-[#2D2D2D]">{addr.label}</span>
                          {addr.isDefault && <span className="text-[10px] bg-[#7CAE8E] text-white px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <p className="text-xs text-gray-500 leading-snug">{addr.address}, {addr.city} {addr.zipCode}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {!addr.isDefault && (
                          <button onClick={() => handleSetDefault(addr.id)} className="text-[10px] text-[#7CAE8E] hover:underline font-medium">Set default</button>
                        )}
                        <button onClick={() => handleAddressEdit(addr)} className="text-[10px] text-gray-400 hover:text-[#7CAE8E] font-medium">Edit</button>
                        <button onClick={() => handleAddressDelete(addr.id)} className="text-[10px] text-gray-400 hover:text-red-400 font-medium">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit form */}
              {showAddressForm && (
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3">
                  <p className="text-xs font-bold text-[#7CAE8E] uppercase tracking-wide">{editingAddress ? "Edit Address" : "New Address"}</p>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                    <div className="flex gap-2 flex-wrap">
                      {["Home", "Office", "Other"].map((lbl) => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setAddressForm((f) => ({ ...f, label: lbl }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${addressForm.label === lbl ? "bg-[#7CAE8E] text-white border-[#7CAE8E]" : "border-gray-200 text-gray-500 hover:border-[#7CAE8E]"}`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Street / Barangay *</label>
                    <input value={addressForm.address} onChange={(e) => setAddressForm((f) => ({ ...f, address: e.target.value }))}
                      placeholder="123 Rizal St, Brgy. San Antonio"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7CAE8E] min-h-[44px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">City / Municipality *</label>
                      <input value={addressForm.city} onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                        placeholder="Maynila"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7CAE8E] min-h-[44px]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">ZIP Code *</label>
                      <input value={addressForm.zipCode} onChange={(e) => setAddressForm((f) => ({ ...f, zipCode: e.target.value }))}
                        placeholder="1000"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7CAE8E] min-h-[44px]" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}
                      className="flex-1 min-h-[40px] border border-gray-200 text-gray-500 rounded-full text-xs font-semibold hover:border-gray-300 transition-colors">
                      Cancel
                    </button>
                    <button type="button" onClick={handleAddressSave}
                      disabled={!addressForm.address.trim() || !addressForm.city.trim() || !addressForm.zipCode.trim()}
                      className="flex-1 min-h-[40px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white rounded-full text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      {editingAddress ? "Save Changes" : "Add Address"} ✓
                    </button>
                  </div>
                </div>
              )}
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
                  if (user) {
                    if (!localStorage.getItem(`boxOrder_${user.email}`)) {
                      const items = localStorage.getItem("selectedItems");
                      const plan = localStorage.getItem("selectedPlan");
                      if (items && plan) {
                        localStorage.setItem(`boxDraft_${user.email}`, JSON.stringify({ items, plan }));
                      }
                    }
                    localStorage.setItem("logoutToast", user.name.split(" ")[0]);
                  }
                  localStorage.removeItem("boxUser");
                  localStorage.removeItem("selectedItems");
                  localStorage.removeItem("selectedPlan");
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

      {/* Pause subscription modal */}
      {showPauseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPauseModal(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Pause subscription"
        >
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏸</span>
            </div>
            <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] text-center mb-1">Pause Subscription</h3>
            <p className="text-sm text-gray-500 text-center mb-5">No deliveries or charges during your pause. Resumes automatically.</p>
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-600 mb-3">How long do you want to pause?</p>
              <div className="space-y-2">
                {[1, 2, 3].map((m) => (
                  <label
                    key={m}
                    className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                      pauseMonths === m ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pauseMonths"
                      value={m}
                      checked={pauseMonths === m}
                      onChange={() => setPauseMonths(m)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium text-[#2D2D2D]">
                      {m} month{m > 1 ? "s" : ""}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 min-h-[48px] border-2 border-gray-200 text-gray-600 rounded-full font-semibold hover:border-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPause}
                className="flex-1 min-h-[48px] bg-amber-400 hover:bg-amber-500 text-white rounded-full font-bold transition-colors text-sm"
              >
                Pause for {pauseMonths}mo
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
