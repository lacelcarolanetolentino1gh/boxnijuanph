import Link from "next/link";

const FAQS = [
  {
    id: "delivery",
    icon: "🚚",
    title: "Delivery & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Deliveries within Metro Manila take 3–5 business days after your box is packed and dispatched. You'll receive a confirmation email with tracking details once your box ships.",
      },
      {
        q: "Where do you deliver?",
        a: "We currently deliver within Metro Manila only. We're working on expanding to other regions soon — stay tuned!",
      },
      {
        q: "Is delivery free?",
        a: "Yes! Free delivery within Metro Manila is included in all plans — Basic, Standard, Premium, and Custom.",
      },
      {
        q: "How will I know when my box ships?",
        a: "You'll receive a shipping confirmation email to the address used during sign-up. The email includes your tracking number and estimated delivery date.",
      },
      {
        q: "What if I'm not home during delivery?",
        a: "Our courier will attempt delivery up to 2 times. If no one is available, the package is held at the nearest hub for pick-up. You'll be notified via email with instructions.",
      },
    ],
  },
  {
    id: "returns",
    icon: "🔄",
    title: "Refunds & Returns",
    questions: [
      {
        q: "What is your refund policy?",
        a: "We accept refund requests within 7 days of delivery for damaged, incorrect, or missing items. We process refunds within 5–7 business days after approval.",
      },
      {
        q: "How do I request a refund or replacement?",
        a: "Email support@boxnijuanph.com with your order number (BNJ-XXXXXX) and a clear photo showing the issue. Our team will review and respond within 1–2 business days.",
      },
      {
        q: "What qualifies for a replacement?",
        a: "Damaged products, incorrect items, or missing items from your confirmed box contents all qualify for a free replacement. We'll ship the replacement at no additional cost.",
      },
      {
        q: "Can I return items I simply don't like?",
        a: "We're a curated subscription service, so items are selected based on your preferences. Returns for personal preference aren't supported, but you can update your preferences anytime for future boxes.",
      },
    ],
  },
  {
    id: "cancellation",
    icon: "✅",
    title: "Cancellation & Changes",
    questions: [
      {
        q: "Can I cancel my subscription anytime?",
        a: "Yes — no lock-in, no cancellation fees! Go to My Box → Manage → Cancel Subscription, or email support@boxnijuanph.com with your order number. We process it within 24 hours.",
      },
      {
        q: "What happens to my current box if I cancel?",
        a: "If your box is already packed and dispatched, you'll still receive it. Cancellation takes effect for the next billing cycle.",
      },
      {
        q: "Can I pause my subscription?",
        a: "Yes! You can pause for up to 3 months from My Box → Manage → Pause Subscription. Billing resumes automatically when your pause period ends.",
      },
      {
        q: "Can I change my plan?",
        a: "Absolutely. You can upgrade or downgrade your plan at any time from My Box → Manage → Change Plan. Changes take effect on your next billing date.",
      },
    ],
  },
  {
    id: "payment",
    icon: "💳",
    title: "Payment & Billing",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept GCash, Maya, and major credit/debit cards (Visa, Mastercard). All payments are encrypted — we never store your full card details.",
      },
      {
        q: "When am I charged?",
        a: "You're charged on the same day each month from your subscription start date. You'll receive a billing confirmation email before each charge.",
      },
      {
        q: "What if my payment fails?",
        a: "If a payment fails, we'll notify you by email and retry after 3 days. You can also update your payment method from My Box → Billing. If not resolved within 7 days, your subscription will be paused.",
      },
      {
        q: "Is there a free trial?",
        a: "We don't currently offer a free trial, but you can cancel within 7 days of your first box for a full refund if you're not satisfied.",
      },
    ],
  },
  {
    id: "plans",
    icon: "📦",
    title: "Plans & Products",
    questions: [
      {
        q: "What plans are available?",
        a: "We have 4 plans:\n• Basic — ₱399/mo (3 items)\n• Standard — ₱599/mo (5 items)\n• Premium — ₱899/mo (8 items)\n• Custom — ₱1,299/mo (up to 12 items)\nAll plans include free Metro Manila delivery.",
      },
      {
        q: "Can I choose which products go in my box?",
        a: "Yes! With our Box Builder, you can browse all available products and select the items you want. Just go to the Build Your Box page to get started.",
      },
      {
        q: "What product categories do you carry?",
        a: "We carry products across 4 wellness categories:\n• 🏃 Recovery & Fitness\n• 🥜 Healthy Snacks\n• ✨ Skincare for Athletes\n• 🕯️ Lifestyle & Comfort",
      },
      {
        q: "Are the products from local Philippine brands?",
        a: "Most of our products are from Filipino wellness brands like SarapFit, HilomNaturals, GalosPorta, PadayonPH, and more. We're proud to support local! 🇵🇭",
      },
    ],
  },
  {
    id: "privacy",
    icon: "🔒",
    title: "Privacy & Data",
    questions: [
      {
        q: "How is my personal data protected?",
        a: "Your data is protected under RA 10173 (Data Privacy Act of 2012). We only collect information needed for order fulfillment and never share it with third parties.",
      },
      {
        q: "How can I request deletion of my data?",
        a: "Email support@boxnijuanph.com with the subject line 'Data Deletion Request' and your registered email address. We process requests within 30 days.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="bg-[#FAFAF7] min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-14 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-[#EAF2ED] text-[#5F8F72] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          Help Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2D2D2D] mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-[#6B7280] max-w-lg mx-auto text-sm sm:text-base">
          Everything you need to know about BoxNiJuanPH — delivery, refunds, plans, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {FAQS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-xs font-medium border border-[#7CAE8E] text-[#5F8F72] px-3 py-1.5 rounded-full hover:bg-[#7CAE8E] hover:text-white transition-colors"
            >
              {section.icon} {section.title}
            </a>
          ))}
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {FAQS.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-5 flex items-center gap-2">
              <span>{section.icon}</span>
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.questions.map((item, i) => (
                <details
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm group"
                >
                  <summary className="px-5 py-4 cursor-pointer font-semibold text-sm text-[#2D2D2D] flex items-center justify-between gap-3 list-none select-none">
                    <span>{item.q}</span>
                    <svg
                      className="w-4 h-4 text-[#7CAE8E] shrink-0 transition-transform group-open:rotate-180"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 pt-1 text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions CTA */}
        <div className="bg-[#EAF2ED] rounded-2xl p-8 text-center">
          <p className="text-lg font-bold text-[#2D2D2D] mb-2">Still have questions?</p>
          <p className="text-sm text-[#6B7280] mb-5">
            Our support team typically responds within 1–2 business days.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="bg-[#5F8F72] hover:bg-[#4A7A5E] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@boxnijuanph.com"
              className="border border-[#7CAE8E] text-[#5F8F72] hover:bg-[#7CAE8E] hover:text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
