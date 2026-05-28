"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type BoxUser = { name: string; email: string; provider: string; avatar: string };

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<BoxUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("boxUser");
    if (stored) setUser(JSON.parse(stored));
    const onStorage = () => {
      const updated = localStorage.getItem("boxUser");
      setUser(updated ? JSON.parse(updated) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("boxUser");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="BoxNiJuanPH" width={160} height={38} priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className={`hover:text-[#16A34A] font-medium transition-colors ${pathname === "/" ? "text-[#16A34A]" : ""}`}>Home</Link>
          <Link href="/plans" className={`hover:text-[#16A34A] font-medium transition-colors ${pathname === "/plans" ? "text-[#16A34A]" : ""}`}>Plans</Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs font-bold" aria-hidden="true">
                  {user.avatar}
                </div>
                <span className="text-sm font-medium text-[#111827]">Hi, {user.name.split(" ")[0]}</span>
              </div>
              <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-red-400 transition-colors" aria-label="Sign out">
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#16A34A] transition-colors">
              Sign In
            </Link>
          )}

          <Link href="/plans">
            <button className="bg-[#F97316] hover:bg-[#EA6B0A] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors min-h-[40px] shadow-sm">
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
          <Link href="/" onClick={() => setMenuOpen(false)} className="font-medium text-gray-700 hover:text-[#16A34A]">Home</Link>
          <Link href="/plans" onClick={() => setMenuOpen(false)} className="font-medium text-gray-700 hover:text-[#16A34A]">Plans</Link>
          {user ? (
            <>
              <span className="text-gray-600">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="text-red-400 text-left">Sign Out</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-[#16A34A]">Sign In</Link>
          )}
          <Link href="/plans" onClick={() => setMenuOpen(false)}>
            <button className="w-full bg-[#F97316] text-white py-3 rounded-full font-bold">Build Your Box</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
