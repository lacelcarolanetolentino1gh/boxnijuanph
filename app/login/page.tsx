"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Provider = "google" | "apple" | "facebook";

const PROVIDER_LABELS: Record<Provider, string> = {
  google: "Google",
  apple: "Apple",
  facebook: "Facebook",
};

const PROVIDER_EMAILS: Record<Provider, string> = {
  google: "@gmail.com",
  apple: "@icloud.com",
  facebook: "@facebook.com",
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [loading, setLoading] = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(false);

  // Mock auth form state
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formError, setFormError] = useState("");

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setFormName("");
    setFormEmail("");
    setFormError("");
    setShowGuestWarning(false);
  };

  const handleFormSubmit = () => {
    if (!selectedProvider) return;
    if (!formName.trim()) { setFormError("Please enter your name."); return; }
    if (!formEmail.trim()) { setFormError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    setFormError("");
    setLoading(true);
    setTimeout(() => {
      const user = {
        name: formName.trim(),
        email: formEmail.trim(),
        avatar: formName.trim().charAt(0).toUpperCase(),
        provider: selectedProvider,
      };
      localStorage.setItem("boxUser", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));
      router.push(redirect);
    }, 600);
  };

  const handleGuestCheckout = () => {
    localStorage.removeItem("boxUser");
    router.push(redirect);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16 bg-[#FAFAF7]">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Image src="/logo-icon.png" alt="" width={32} height={32} unoptimized />
              <Image src="/logo.svg" alt="BoxNiJuanPH" width={150} height={36} />
            </div>
            <h1 className="font-[var(--font-dm-sans)] text-xl font-bold text-[#2D2D2D] mb-1">Sign in to continue</h1>
            <p className="text-sm text-gray-400">Your order is almost ready!</p>
          </div>

          {/* ── Mock auth form (after provider selected) ── */}
          {selectedProvider ? (
            <div>
              {/* Back */}
              <button
                onClick={() => setSelectedProvider(null)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#7CAE8E] transition-colors mb-5"
              >
                ← Back to sign-in options
              </button>

              {/* Provider badge */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 mb-5">
                <span className="text-xs text-gray-400">Signing in with</span>
                <span className="text-xs font-bold text-[#2D2D2D]">{PROVIDER_LABELS[selectedProvider]}</span>
              </div>

              <div className="space-y-4 mb-2">
                <div>
                  <label htmlFor="loginName" className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    id="loginName"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    autoFocus
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px]"
                  />
                </div>
                <div>
                  <label htmlFor="loginEmail" className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                  <input
                    id="loginEmail"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder={`e.g. yourname${PROVIDER_EMAILS[selectedProvider]}`}
                    onKeyDown={(e) => { if (e.key === "Enter") handleFormSubmit(); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px]"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs text-red-500 mb-3">{formError}</p>
              )}

              <button
                onClick={handleFormSubmit}
                disabled={loading}
                className="w-full min-h-[52px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white font-bold rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  `Continue with ${PROVIDER_LABELS[selectedProvider]} →`
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Social login buttons */}
              <div className="space-y-3">
                {/* Google */}
                <button
                  onClick={() => handleProviderClick("google")}
                  aria-label="Continue with Google"
                  className="w-full flex items-center justify-center gap-3 min-h-[52px] border border-gray-200 rounded-xl px-4 py-3 font-medium text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Apple */}
                <button
                  onClick={() => handleProviderClick("apple")}
                  aria-label="Continue with Apple"
                  className="w-full flex items-center justify-center gap-3 min-h-[52px] bg-black rounded-xl px-4 py-3 font-medium text-sm text-white hover:bg-gray-900 transition-colors"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Continue with Apple
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleProviderClick("facebook")}
                  aria-label="Continue with Facebook"
                  className="w-full flex items-center justify-center gap-3 min-h-[52px] bg-[#1877F2] rounded-xl px-4 py-3 font-medium text-sm text-white hover:bg-[#166fe5] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.028 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.67 4.533-4.67 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.101 24 18.103 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Guest option */}
              {!showGuestWarning ? (
                <button
                  onClick={() => setShowGuestWarning(true)}
                  className="w-full text-center text-sm text-gray-500 hover:text-[#7CAE8E] transition-colors py-1"
                >
                  Continue as guest
                </button>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left" role="note" aria-label="Guest checkout disclaimer">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">⚠ Guest Checkout Notice</p>
                  <p className="text-xs text-amber-800 leading-relaxed mb-3">
                    You can still place an order without an account, but you will <strong>not</strong> be able to:
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1 mb-3 pl-2">
                    <li className="flex gap-1.5"><span>✕</span> Track or manage your subscription</li>
                    <li className="flex gap-1.5"><span>✕</span> Edit or cancel your box later</li>
                    <li className="flex gap-1.5"><span>✕</span> Access your order history</li>
                    <li className="flex gap-1.5"><span>✕</span> Use the Custom Box (no-limit) feature</li>
                  </ul>
                  <p className="text-xs text-amber-700 leading-relaxed mb-4">
                    <strong>We highly recommend signing in</strong> — it only takes one tap and keeps all your orders safe in one place. Your personal data collected at checkout is still protected under <strong>RA 10173</strong> (Data Privacy Act of 2012) and used solely for delivery purposes.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setShowGuestWarning(false)}
                      className="w-full min-h-[44px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white rounded-full text-sm font-bold transition-colors"
                    >
                      Sign In Instead (Recommended)
                    </button>
                    <button
                      onClick={handleGuestCheckout}
                      className="w-full min-h-[40px] text-xs text-amber-600 hover:text-amber-800 underline transition-colors"
                    >
                      I understand — continue as guest anyway
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Privacy notice */}
        <div className="mt-6 text-center px-2">
          <p className="text-xs text-gray-400 leading-relaxed">
            🔒 By signing in, you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-[#7CAE8E]">Privacy Policy</Link>.
            {" "}Your data is protected under{" "}
            <strong className="font-medium text-gray-500">RA 10173</strong> (Data Privacy Act of 2012).
            We never store your password or payment details.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
