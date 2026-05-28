"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type BoxUser = { name: string; email: string; provider: string; avatar: string };

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<BoxUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("boxUser");
    if (stored) setUser(JSON.parse(stored));

    // Listen for storage changes (e.g. login in another component)
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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-[var(--font-dm-sans)] font-bold text-xl text-[#7D9B76]">
          BoxNiJuanPH
        </Link>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link
            href="/"
            className={`hover:text-[#7D9B76] transition-colors ${pathname === "/" ? "text-[#7D9B76] font-semibold" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/plans"
            className={`hover:text-[#7D9B76] transition-colors ${pathname === "/plans" ? "text-[#7D9B76] font-semibold" : ""}`}
          >
            Plans
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Avatar + name */}
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full bg-[#7D9B76] text-white flex items-center justify-center text-xs font-bold"
                  aria-hidden="true"
                >
                  {user.avatar}
                </div>
                <span className="text-sm font-medium text-[#2D2D2D] hidden sm:block">
                  Hi, {user.name.split(" ")[0]}
                </span>
              </div>
              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#7D9B76] transition-colors"
            >
              Sign In
            </Link>
          )}

          <Link href="/plans">
            <button className="bg-[#7D9B76] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#5e7a58] transition-colors min-h-[40px]">
              Build Your Box
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
