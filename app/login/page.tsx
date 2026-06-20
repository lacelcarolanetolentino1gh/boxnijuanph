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

// ── Password strength helper ──────────────────────────────────────
function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: "", color: "", width: "0%" };
  if (pw.length < 6) return { label: "Too short", color: "#ef4444", width: "20%" };
  if (pw.length < 8) return { label: "Weak", color: "#f97316", width: "40%" };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
  if (score === 0) return { label: "Fair", color: "#eab308", width: "55%" };
  if (score === 1) return { label: "Good", color: "#84cc16", width: "75%" };
  return { label: "Strong", color: "#7CAE8E", width: "100%" };
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [loading, setLoading] = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Social provider quick path
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [providerName, setProviderName] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerError, setProviderError] = useState("");

  // Sign Up form
  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupShowPw, setSignupShowPw] = useState(false);
  const [signupShowConfirm, setSignupShowConfirm] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Sign In form
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinShowPw, setSigninShowPw] = useState(false);
  const [signinError, setSigninError] = useState("");

  const pwStrength = getPasswordStrength(signupPassword);

  const handleModeSwitch = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setSelectedProvider(null);
    setSignupError("");
    setSigninError("");
    setProviderError("");
    setShowGuestWarning(false);
  };

  const finishLogin = (name: string, email: string, provider: string, isSignup: boolean) => {
    const firstName = name.trim().split(" ")[0];
    localStorage.setItem("loginToast", isSignup ? `welcome:${firstName}` : `welcome-back:${firstName}`);
    // If returning user has prior chat history, flag the chatbot to show the continue prompt
    if (!isSignup && localStorage.getItem("boxbotHistory")) {
      localStorage.setItem("boxbotShowContinuePrompt", "1");
    }
    const user = {
      name: name.trim(),
      email: email.trim(),
      avatar: name.trim().charAt(0).toUpperCase(),
      provider,
    };
    localStorage.setItem("boxUser", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
    router.push(redirect);
  };

  // Social provider quick path submit
  const handleProviderSubmit = () => {
    if (!selectedProvider) return;
    if (!providerName.trim()) { setProviderError("Please enter your name."); return; }
    if (!providerEmail.trim()) { setProviderError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(providerEmail.trim())) {
      setProviderError("Please enter a valid email address."); return;
    }
    setProviderError("");
    setLoading(true);
    setTimeout(() => finishLogin(providerName, providerEmail, selectedProvider, mode === "signup"), 600);
  };

  // Sign Up submit
  const handleSignUp = () => {
    if (!signupName.trim()) { setSignupError("Full name is required."); return; }
    if (!signupUsername.trim()) { setSignupError("Username is required."); return; }
    if (signupUsername.includes(" ")) { setSignupError("Username cannot contain spaces."); return; }
    if (!signupEmail.trim()) { setSignupError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) { setSignupError("Enter a valid email address."); return; }
    if (signupPassword.length < 8) { setSignupError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(signupPassword)) { setSignupError("Password must contain at least one uppercase letter."); return; }
    if (!/[0-9]/.test(signupPassword)) { setSignupError("Password must contain at least one number."); return; }
    if (!/[^A-Za-z0-9]/.test(signupPassword)) { setSignupError("Password must contain at least one special character."); return; }
    if (signupPassword !== signupConfirm) { setSignupError("Passwords do not match."); return; }
    setSignupError("");
    setLoading(true);
    setTimeout(() => finishLogin(signupName, signupEmail, "email", true), 600);
  };

  // Sign In submit
  const handleSignIn = () => {
    if (!signinEmail.trim()) { setSigninError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signinEmail.trim())) { setSigninError("Enter a valid email address."); return; }
    if (!signinPassword.trim()) { setSigninError("Password is required."); return; }
    setSigninError("");
    setLoading(true);
    // For sign in, derive name from email prefix
    const name = signinEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setTimeout(() => finishLogin(name, signinEmail, "email", false), 600);
  };

  const handleGuestCheckout = () => {
    localStorage.removeItem("boxUser");
    router.push(redirect);
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7CAE8E] focus:ring-2 focus:ring-[#7CAE8E]/20 min-h-[48px]";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";
  const spinnerEl = (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16 bg-[#FAFAF7]">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

          {/* Logo */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <Image src="/logo-icon.png" alt="" width={32} height={32} unoptimized />
            <Image src="/logo.svg" alt="BoxNiJuanPH" width={150} height={36} />
          </div>

          {/* Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => handleModeSwitch("signin")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[36px] ${
                mode === "signin" ? "bg-white text-[#2D2D2D] shadow-sm" : "text-gray-500 hover:text-[#2D2D2D]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleModeSwitch("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[36px] ${
                mode === "signup" ? "bg-white text-[#2D2D2D] shadow-sm" : "text-gray-500 hover:text-[#2D2D2D]"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="font-[var(--font-dm-sans)] text-xl font-bold text-[#2D2D2D] mb-1">
              {mode === "signup" ? "Create your account" : "Welcome back!"}
            </h1>
            <p className="text-sm text-gray-400">
              {mode === "signup" ? "Join BoxNiJuanPH and build your wellness box." : "Sign in to access your box and orders."}
            </p>
          </div>

          {/* ── Social provider quick path ── */}
          {selectedProvider ? (
            <div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#7CAE8E] transition-colors mb-5"
              >
                ← Back
              </button>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 mb-5">
                <span className="text-xs text-gray-400">{mode === "signup" ? "Signing up with" : "Signing in with"}</span>
                <span className="text-xs font-bold text-[#2D2D2D]">{PROVIDER_LABELS[selectedProvider]}</span>
              </div>
              <div className="space-y-4 mb-2">
                <div>
                  <label htmlFor="providerName" className={labelClass}>Full Name</label>
                  <input id="providerName" type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)}
                    placeholder="e.g. Maria Santos" autoFocus className={inputClass} />
                </div>
                <div>
                  <label htmlFor="providerEmail" className={labelClass}>Email Address</label>
                  <input id="providerEmail" type="email" value={providerEmail} onChange={(e) => setProviderEmail(e.target.value)}
                    placeholder={`e.g. yourname${PROVIDER_EMAILS[selectedProvider]}`}
                    onKeyDown={(e) => { if (e.key === "Enter") handleProviderSubmit(); }}
                    className={inputClass} />
                </div>
              </div>
              {providerError && <p className="text-xs text-red-500 mb-3">{providerError}</p>}
              <button onClick={handleProviderSubmit} disabled={loading}
                className="w-full min-h-[52px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white font-bold rounded-full transition-colors disabled:opacity-60 mt-2">
                {loading
                  ? <span className="flex items-center justify-center gap-2">{spinnerEl}{mode === "signup" ? "Creating account…" : "Signing in…"}</span>
                  : `${mode === "signup" ? "Sign Up" : "Sign In"} with ${PROVIDER_LABELS[selectedProvider]} →`}
              </button>
            </div>

          ) : mode === "signup" ? (
            /* ── Sign Up form ── */
            <div>
              {/* Social buttons */}
              <div className="space-y-3 mb-6">
                <button onClick={() => { setSelectedProvider("google"); setProviderName(""); setProviderEmail(""); setProviderError(""); }}
                  className="w-full flex items-center justify-center gap-3 min-h-[48px] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Sign up with Google
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setSelectedProvider("apple"); setProviderName(""); setProviderEmail(""); setProviderError(""); }}
                    className="flex items-center justify-center gap-2 min-h-[44px] bg-black rounded-xl text-sm text-white hover:bg-gray-900 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    Apple
                  </button>
                  <button onClick={() => { setSelectedProvider("facebook"); setProviderName(""); setProviderEmail(""); setProviderError(""); }}
                    className="flex items-center justify-center gap-2 min-h-[44px] bg-[#1877F2] rounded-xl text-sm text-white hover:bg-[#166fe5] transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.028 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.67 4.533-4.67 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.101 24 18.103 24 12.073z"/></svg>
                    Facebook
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">or sign up with email</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="signupName" className={labelClass}>Full Name</label>
                  <input id="signupName" type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Maria Santos" autoFocus className={inputClass} />
                </div>
                <div>
                  <label htmlFor="signupUsername" className={labelClass}>Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input id="signupUsername" type="text" value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                      placeholder="mariasantos" className={`${inputClass} pl-8`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="signupEmail" className={labelClass}>Email Address</label>
                  <input id="signupEmail" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. maria@gmail.com" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="signupPassword" className={labelClass}>Password</label>
                  <div className="relative">
                    <input id="signupPassword" type={signupShowPw ? "text" : "password"} value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 8 characters" className={`${inputClass} pr-11`} />
                    <button type="button" onClick={() => setSignupShowPw(!signupShowPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">
                      <EyeIcon open={signupShowPw} />
                    </button>
                  </div>
                  {signupPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: pwStrength.width, backgroundColor: pwStrength.color }} />
                      </div>
                      <p className="text-[10px]" style={{ color: pwStrength.color }}>{pwStrength.label}</p>
                      <ul className="text-[10px] space-y-0.5 mt-1">
                        {[
                          { ok: signupPassword.length >= 8, label: "At least 8 characters" },
                          { ok: /[A-Z]/.test(signupPassword), label: "One uppercase letter" },
                          { ok: /[0-9]/.test(signupPassword), label: "One number" },
                          { ok: /[^A-Za-z0-9]/.test(signupPassword), label: "One special character (!@#$…)" },
                        ].map(({ ok, label }) => (
                          <li key={label} className={`flex items-center gap-1.5 ${ok ? "text-[#7CAE8E]" : "text-gray-400"}`}>
                            <span>{ok ? "✓" : "○"}</span>{label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="signupConfirm" className={labelClass}>Confirm Password</label>
                  <div className="relative">
                    <input id="signupConfirm" type={signupShowConfirm ? "text" : "password"} value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSignUp(); }}
                      placeholder="Re-enter your password" className={`${inputClass} pr-11`} />
                    <button type="button" onClick={() => setSignupShowConfirm(!signupShowConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">
                      <EyeIcon open={signupShowConfirm} />
                    </button>
                  </div>
                  {signupConfirm && signupPassword !== signupConfirm && (
                    <p className="text-[10px] text-red-400 mt-0.5">Passwords do not match</p>
                  )}
                  {signupConfirm && signupPassword === signupConfirm && signupConfirm.length > 0 && (
                    <p className="text-[10px] text-[#7CAE8E] mt-0.5">✓ Passwords match</p>
                  )}
                </div>
              </div>

              {signupError && <p className="text-xs text-red-500 mt-3">{signupError}</p>}

              <button onClick={handleSignUp} disabled={loading}
                className="w-full min-h-[52px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white font-bold rounded-full transition-colors disabled:opacity-60 mt-5">
                {loading
                  ? <span className="flex items-center justify-center gap-2">{spinnerEl}Creating account…</span>
                  : "Create Account →"}
              </button>
            </div>

          ) : (
            /* ── Sign In form ── */
            <div>
              {/* Social buttons */}
              <div className="space-y-3 mb-6">
                <button onClick={() => { setSelectedProvider("google"); setProviderName(""); setProviderEmail(""); setProviderError(""); }}
                  className="w-full flex items-center justify-center gap-3 min-h-[48px] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setSelectedProvider("apple"); setProviderName(""); setProviderEmail(""); setProviderError(""); }}
                    className="flex items-center justify-center gap-2 min-h-[44px] bg-black rounded-xl text-sm text-white hover:bg-gray-900 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    Apple
                  </button>
                  <button onClick={() => { setSelectedProvider("facebook"); setProviderName(""); setProviderEmail(""); setProviderError(""); }}
                    className="flex items-center justify-center gap-2 min-h-[44px] bg-[#1877F2] rounded-xl text-sm text-white hover:bg-[#166fe5] transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.028 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.67 4.533-4.67 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.101 24 18.103 24 12.073z"/></svg>
                    Facebook
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">or sign in with email</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="signinEmail" className={labelClass}>Email Address</label>
                  <input id="signinEmail" type="email" value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)}
                    placeholder="e.g. maria@gmail.com" autoFocus className={inputClass} />
                </div>
                <div>
                  <label htmlFor="signinPassword" className={labelClass}>Password</label>
                  <div className="relative">
                    <input id="signinPassword" type={signinShowPw ? "text" : "password"} value={signinPassword}
                      onChange={(e) => setSigninPassword(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
                      placeholder="Enter your password" className={`${inputClass} pr-11`} />
                    <button type="button" onClick={() => setSigninShowPw(!signinShowPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">
                      <EyeIcon open={signinShowPw} />
                    </button>
                  </div>
                </div>
              </div>

              {signinError && <p className="text-xs text-red-500 mt-3">{signinError}</p>}

              <button onClick={handleSignIn} disabled={loading}
                className="w-full min-h-[52px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white font-bold rounded-full transition-colors disabled:opacity-60 mt-5">
                {loading
                  ? <span className="flex items-center justify-center gap-2">{spinnerEl}Signing in…</span>
                  : "Sign In →"}
              </button>

              {/* Guest option */}
              <div className="mt-4">
                {!showGuestWarning ? (
                  <button onClick={() => setShowGuestWarning(true)}
                    className="w-full text-center text-sm text-gray-400 hover:text-[#7CAE8E] transition-colors py-1">
                    Continue as guest
                  </button>
                ) : (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left" role="note">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">⚠ Guest Checkout Notice</p>
                    <ul className="text-xs text-amber-700 space-y-1 mb-3 pl-2">
                      <li className="flex gap-1.5"><span>✕</span> Can't track or manage your subscription</li>
                      <li className="flex gap-1.5"><span>✕</span> Can't edit or cancel your box later</li>
                      <li className="flex gap-1.5"><span>✕</span> Can't access order history</li>
                      <li className="flex gap-1.5"><span>✕</span> Custom Box feature not available</li>
                    </ul>
                    <p className="text-xs text-amber-700 leading-relaxed mb-4">
                      Your data is protected under <strong>RA 10173</strong> (Data Privacy Act of 2012) and used solely for delivery.
                    </p>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setShowGuestWarning(false)}
                        className="w-full min-h-[44px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white rounded-full text-sm font-bold transition-colors">
                        Sign In Instead (Recommended)
                      </button>
                      <button onClick={handleGuestCheckout}
                        className="w-full min-h-[40px] text-xs text-amber-600 hover:text-amber-800 underline transition-colors">
                        I understand — continue as guest anyway
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Privacy notice */}
        <div className="mt-6 text-center px-2">
          <p className="text-xs text-gray-400 leading-relaxed">
            🔒 By continuing, you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-[#7CAE8E]">Privacy Policy</Link>.
            {" "}Your data is protected under{" "}
            <strong className="font-medium text-gray-500">RA 10173</strong>.
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
