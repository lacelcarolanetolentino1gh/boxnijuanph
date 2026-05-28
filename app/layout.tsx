import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PrivacyBanner from "@/components/PrivacyBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "BoxNiJuanPH — The Wellness Box for Every Juan",
  description: "Build your own personalized wellness subscription box. Choose from Recovery & Fitness, Healthy Snacks, Skincare for Athletes, and Lifestyle & Comfort.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col font-[var(--font-inter)] bg-[#F7FEE7] text-[#1C1917]">
        <Navbar />
        <PrivacyBanner />
        <main className="flex-1">{children}</main>
        <footer className="bg-[#0F172A] text-white text-center py-8 text-sm mt-16">
          <div className="flex justify-center mb-3">
            <Image src="/logo.svg" alt="BoxNiJuanPH" width={140} height={34} />
          </div>
          <p className="text-gray-400">The Wellness Box for Every Juan</p>
          <p className="text-gray-500 mt-2 text-xs">© 2026 BoxNiJuanPH. BSITOUMN COMP 047 – PUP Open University System</p>
          <p className="mt-2 text-xs">
            <Link href="/privacy" className="text-gray-500 hover:text-[#84CC16] underline transition-colors">Privacy Policy</Link>
            {" · "}
            <span className="text-gray-600">Protected under RA 10173</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
