import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
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
      <body className="min-h-screen flex flex-col font-[var(--font-inter)] bg-[#FAFAF8] text-[#2D2D2D]">
        <Navbar />
        <PrivacyBanner />
        <main className="flex-1">{children}</main>
        <footer className="bg-[#2D2D2D] text-white text-center py-6 text-sm mt-16">
          <p className="font-[var(--font-dm-sans)] font-semibold text-base mb-1">BoxNiJuanPH</p>
          <p className="text-gray-400">The Wellness Box for Every Juan</p>
          <p className="text-gray-500 mt-2 text-xs">© 2026 BoxNiJuanPH. BSITOUMN COMP 047 – PUP Open University System</p>
          <p className="mt-2 text-xs">
            <a href="/privacy" className="text-gray-500 hover:text-[#7D9B76] underline transition-colors">Privacy Policy</a>
            {" · "}
            <span className="text-gray-600">Protected under RA 10173</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
