"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type BoxUser = { name: string; email: string; provider: string; avatar?: string };

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<BoxUser | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; emoji: string } | null>(null);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("boxUser");
      setUser(stored ? JSON.parse(stored) : null);
      const prof = localStorage.getItem("boxProfile");
      if (prof) {
        const parsed = JSON.parse(prof);
        setProfilePic(parsed.profilePic || null);
      } else {
        setProfilePic(null);
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  // Check for login toast on every navigation (pathname change)
  useEffect(() => {
    const loginToast = localStorage.getItem("loginToast");
    if (loginToast) {
      localStorage.removeItem("loginToast");
      const [type, name] = loginToast.split(":");
      if (type === "welcome-back") {
        setToast({ emoji: "👋", message: `Welcome back, ${name}!` });
      } else {
        setToast({ emoji: "🎉", message: `Welcome, ${name}!` });
      }
      setTimeout(() => setToast(null), 4000);
    }
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("boxUser");
    setUser(null);
    router.push("/");
  };

  return (
    <>
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center -gap-1">
          <Image src="/logo-icon.png" alt="" width={64} height={64} priority className="shrink-0" />
          <Image src="/logo.svg" alt="BoxNiJuanPH" width={250} height={60} priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className={`hover:text-[#7CAE8E] font-medium transition-colors ${pathname === "/" ? "text-[#7CAE8E]" : ""}`}>Home</Link>
          <Link href="/plans" className={`hover:text-[#7CAE8E] font-medium transition-colors ${pathname === "/plans" ? "text-[#7CAE8E]" : ""}`}>Plans</Link>
          <Link href="/products" className={`hover:text-[#7CAE8E] font-medium transition-colors ${pathname === "/products" ? "text-[#7CAE8E]" : ""}`}>Products</Link>
          <Link href="/faq" className={`hover:text-[#7CAE8E] font-medium transition-colors ${pathname === "/faq" ? "text-[#7CAE8E]" : ""}`}>FAQ</Link>
          <Link href="/contact" className={`hover:text-[#7CAE8E] font-medium transition-colors ${pathname === "/contact" ? "text-[#7CAE8E]" : ""}`}>Contact</Link>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Clickable avatar + name → goes to Profile tab */}
              <Link
                href="/my-box?tab=profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-label="Go to your profile"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#7CAE8E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {profilePic ? (
                    <Image src={profilePic} alt={user.name} width={32} height={32} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-[#2D2D2D] hover:text-[#7CAE8E] transition-colors">
                  Hi, {user.name.split(" ")[0]}
                </span>
              </Link>
              <Link href="/my-box" className={`hover:text-[#7CAE8E] font-medium transition-colors text-sm ${pathname === "/my-box" ? "text-[#7CAE8E]" : ""}`}>My Box</Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-3 py-1.5 rounded-full transition-colors"
                aria-label="Sign out"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className="text-sm font-medium text-gray-600 hover:text-[#7CAE8E] transition-colors">
              Sign In
            </Link>
          )}

          <Link href="/plans">
            <button className="bg-[#5F8F72] hover:bg-[#4A7A5E] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors min-h-[40px] shadow-sm">
              Build Your Box
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)} className="font-medium text-gray-700 hover:text-[#7CAE8E]">Home</Link>
          <Link href="/plans" onClick={() => setMenuOpen(false)} className="font-medium text-gray-700 hover:text-[#7CAE8E]">Plans</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} className="font-medium text-gray-700 hover:text-[#7CAE8E]">Products</Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)} className="font-medium text-gray-700 hover:text-[#7CAE8E]">FAQ</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="font-medium text-gray-700 hover:text-[#7CAE8E]">Contact</Link>
          {user ? (
            <>
              <Link href="/my-box?tab=profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-[#7CAE8E]">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#7CAE8E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {profilePic ? (
                    <Image src={profilePic} alt={user.name} width={28} height={28} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="font-medium">Hi, {user.name.split(" ")[0]} · Profile</span>
              </Link>
              <Link href="/my-box" onClick={() => setMenuOpen(false)} className="font-medium text-gray-700 hover:text-[#7CAE8E]">My Box</Link>
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="text-left text-sm font-medium text-red-400 hover:text-red-500 border border-red-200 hover:border-red-300 px-4 py-2.5 rounded-full transition-colors w-fit">
                Log Out
              </button>
            </>
          ) : (
            <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-[#7CAE8E]">Sign In</Link>
          )}
          <Link href="/plans" onClick={() => setMenuOpen(false)}>
            <button className="w-full bg-[#5F8F72] text-white py-3 rounded-full font-bold">Build Your Box</button>
          </Link>
        </div>
      )}
    </nav>
    {/* Toast notification */}
    {toast && (
      <div
        style={{ position: "fixed", top: "80px", right: "24px", zIndex: 9999 }}
        className="flex items-center gap-3 bg-[#2D2D2D] text-white px-5 py-3 rounded-2xl shadow-2xl animate-fade-in-up"
        role="status"
        aria-live="polite"
      >
        <span className="text-xl">{toast.emoji}</span>
        <span className="text-sm font-semibold">{toast.message}</span>
      </div>
    )}
    </>
  );
}
