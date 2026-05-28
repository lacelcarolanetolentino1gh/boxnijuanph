"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Provider = "google" | "apple" | "facebook";

const MOCK_USERS: Record<Provider, { name: string; email: string; avatar: string }> = {
  google: { name: "Juan dela Cruz", email: "juan.delacruz@gmail.com", avatar: "J" },
  apple: { name: "Juan dela Cruz", email: "juan.delacruz@icloud.com", avatar: "J" },
  facebook: { name: "Juan dela Cruz", email: "juan.delacruz@fb.com", avatar: "J" },
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<Provider | null>(null);

  const handleLogin = (provider: Provider) => {
    setLoading(provider);
    setTimeout(() => {
      const user = { ...MOCK_USERS[provider], provider };
      localStorage.setItem("boxUser", JSON.stringify(user));
      router.push("/checkout");
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16 bg-[#FAFAF8]">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <p className="font-[var(--font-dm-sans)] font-bold text-2xl text-[#7D9B76] mb-1">BoxNiJuanPH</p>
            <h1 className="font-[var(--font-dm-sans)] text-xl font-bold text-[#2D2D2D] mb-1">Sign in to continue</h1>
            <p className="text-sm text-gray-400">Your order is almost ready!</p>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => handleLogin("google")}
              disabled={loading !== null}
              aria-label="Continue with Google"
              className="w-full flex items-center justify-center gap-3 min-h-[52px] border border-gray-200 rounded-xl px-4 py-3 font-medium text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading === "google" ? (
                <span className="flex items-center gap-2 text-gray-500">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Connecting…
                </span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Apple */}
            <button
              onClick={() => handleLogin("apple")}
              disabled={loading !== null}
              aria-label="Continue with Apple"
              className="w-full flex items-center justify-center gap-3 min-h-[52px] bg-black rounded-xl px-4 py-3 font-medium text-sm text-white hover:bg-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading === "apple" ? (
                <span className="flex items-center gap-2 opacity-80">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Connecting…
                </span>
              ) : (
                <>
                  <svg width="16" height="18" viewBox="0 0 814 1000" fill="white" aria-hidden="true">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 372.8 1 317.3 1 262.1 1 171.1 66.2 123.2 130.4 123.2c66.3 0 112.2 43.9 154.8 43.9 40.7 0 94.6-45.3 163.9-45.3 26.8 0 108.2 2.6 168.6 79.6z"/>
                  </svg>
                  Continue with Apple
                </>
              )}
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleLogin("facebook")}
              disabled={loading !== null}
              aria-label="Continue with Facebook"
              className="w-full flex items-center justify-center gap-3 min-h-[52px] bg-[#1877F2] rounded-xl px-4 py-3 font-medium text-sm text-white hover:bg-[#166fe5] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading === "facebook" ? (
                <span className="flex items-center gap-2 opacity-80">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Connecting…
                </span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.028 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.67 4.533-4.67 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.101 24 18.103 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Guest option */}
          <Link
            href="/summary"
            className="block text-center text-sm text-gray-500 hover:text-[#7D9B76] transition-colors"
          >
            ← Continue as guest (no account needed)
          </Link>
        </div>

        {/* Privacy notice */}
        <div className="mt-6 text-center px-2">
          <p className="text-xs text-gray-400 leading-relaxed">
            🔒 By signing in, you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-[#7D9B76]">Privacy Policy</Link>.
            {" "}Your data is protected under{" "}
            <strong className="font-medium text-gray-500">RA 10173</strong> (Data Privacy Act of 2012).
            We never store your password or payment details.
          </p>
        </div>
      </div>
    </div>
  );
}
