import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link href="/" className="text-sm text-gray-400 hover:text-[#7CAE8E] transition-colors">← Back to Home</Link>
      </div>

      <h1 className="font-[var(--font-dm-sans)] text-4xl font-bold text-[#2D2D2D] mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-10">Last updated: June 2026 · In compliance with <strong className="text-gray-600">Republic Act 10173</strong> — Data Privacy Act of 2012</p>

      <div className="space-y-10 text-sm text-gray-600 leading-relaxed">

        <section>
          <h2 className="font-[var(--font-dm-sans)] font-bold text-lg text-[#2D2D2D] mb-3">1. Who We Are</h2>
          <p>
            BoxNiJuanPH (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a wellness subscription box service based in the Philippines. This Privacy Policy describes how we collect, use, and protect your personal information when you use our platform.
          </p>
          <p className="mt-2">
            We are committed to safeguarding your privacy in accordance with <strong>RA 10173</strong> (Data Privacy Act of 2012) and its Implementing Rules and Regulations (IRR).
          </p>
        </section>

        <section>
          <h2 className="font-[var(--font-dm-sans)] font-bold text-lg text-[#2D2D2D] mb-3">2. What We Collect</h2>
          <p className="mb-3">When you place an order, we collect the following <strong>personal data</strong>:</p>
          <ul className="space-y-2 list-none">
            {[
              ["Full Name", "For delivery and order confirmation"],
              ["Email Address", "For order receipts and account login"],
              ["Phone Number", "For delivery coordination"],
              ["Delivery Address", "To ship your wellness box"],
              ["Payment Method Selection", "To process your subscription (GCash, Maya, Card, COD)"],
            ].map(([field, reason]) => (
              <li key={field} className="flex gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <span className="font-semibold text-[#2D2D2D] w-44 shrink-0">{field}</span>
                <span className="text-gray-500">{reason}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-gray-400 text-xs">
            ⚠️ We do <strong>not</strong> collect or store actual card numbers, CVV codes, or bank credentials. All payment transactions are processed by PayMongo, which is PCI-DSS compliant.
          </p>
        </section>

        <section>
          <h2 className="font-[var(--font-dm-sans)] font-bold text-lg text-[#2D2D2D] mb-3">3. How We Use Your Data</h2>
          <p className="mb-2">We use your data <strong>only</strong> for the following purposes:</p>
          <ul className="space-y-1 pl-4 list-disc">
            <li>To process and fulfill your monthly box orders</li>
            <li>To send order confirmation and delivery updates</li>
            <li>To manage your subscription and billing</li>
            <li>To respond to customer service inquiries</li>
            <li>To improve our platform and product offerings (aggregated and anonymized data only)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-[var(--font-dm-sans)] font-bold text-lg text-[#2D2D2D] mb-3">4. Who We Share It With</h2>
          <p className="mb-2">We <strong>do not sell, trade, or rent</strong> your personal data to third parties.</p>
          <p className="mb-2">We may share your data only with:</p>
          <ul className="space-y-1 pl-4 list-disc">
            <li><strong>Delivery partners</strong> — your name and address are shared to fulfill delivery</li>
            <li><strong>PayMongo</strong> — payment processor (they handle payment data securely)</li>
            <li><strong>Government authorities</strong> — only when required by Philippine law</li>
          </ul>
        </section>

        <section>
          <h2 className="font-[var(--font-dm-sans)] font-bold text-lg text-[#2D2D2D] mb-3">5. Data Security</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "🔒", title: "SSL/TLS Encryption", desc: "All data in transit is encrypted using HTTPS." },
              { icon: "💳", title: "PCI-DSS Payments", desc: "Card transactions handled by PayMongo — we never see your card number." },
              { icon: "🇵🇭", title: "RA 10173 Compliant", desc: "We follow all requirements of the Philippine Data Privacy Act." },
              { icon: "🚫", title: "No Third-Party Selling", desc: "Your personal data is never sold or shared for marketing purposes." },
            ].map((item) => (
              <div key={item.title} className="bg-[#FAFAF7] rounded-xl p-4">
                <p className="text-xl mb-1">{item.icon}</p>
                <p className="font-semibold text-[#2D2D2D] text-sm mb-0.5">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-[var(--font-dm-sans)] font-bold text-lg text-[#2D2D2D] mb-3">6. Your Rights Under RA 10173</h2>
          <p className="mb-2">As a data subject, you have the right to:</p>
          <ul className="space-y-1 pl-4 list-disc">
            <li><strong>Be informed</strong> — know what data we collect and why</li>
            <li><strong>Access</strong> — request a copy of your personal data</li>
            <li><strong>Correction</strong> — request correction of inaccurate data</li>
            <li><strong>Erasure</strong> — request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li><strong>Object</strong> — object to processing of your data in certain circumstances</li>
            <li><strong>Data portability</strong> — receive your data in a usable format</li>
            <li><strong>Lodge a complaint</strong> — file a complaint with the National Privacy Commission (NPC)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-[var(--font-dm-sans)] font-bold text-lg text-[#2D2D2D] mb-3">7. Data Retention</h2>
          <p>
            We retain your personal data only as long as necessary to fulfill your orders and comply with legal obligations. Account data may be deleted upon request. Order records are retained for a minimum of 2 years in compliance with BIR regulations.
          </p>
        </section>

        <section>
          <h2 className="font-[var(--font-dm-sans)] font-bold text-lg text-[#2D2D2D] mb-3">8. Contact Us</h2>
          <p>For privacy-related concerns or to exercise your rights under RA 10173, contact our Data Protection Officer:</p>
          <div className="mt-3 bg-gray-50 rounded-xl p-4 text-sm">
            <p className="font-semibold text-[#2D2D2D]">BoxNiJuanPH — Data Protection Officer</p>
            <p className="text-gray-500">📧 privacy@boxnijuanph.com</p>
            <p className="text-gray-500">📍 PUP Open University System, Manila, Philippines</p>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            You may also file a complaint with the <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#7CAE8E]">National Privacy Commission (NPC)</a> at privacy.gov.ph.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
        © 2026 BoxNiJuanPH · BSITOUMN COMP 047 – PUP Open University System
      </div>
    </div>
  );
}
