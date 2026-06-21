"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const TOPICS = [
  "After-Sales Support",
  "Delivery / Shipping",
  "Refund or Replacement",
  "Order Status",
  "Change or Cancel Subscription",
  "Product Question",
  "General Inquiry",
];

function ContactForm() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");
  const initialTopic = topicParam === "refund" ? "Refund or Replacement" : "";

  const [form, setForm] = useState({ name: "", email: "", order: "", topic: initialTopic, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required.";
    if (!form.topic) e.topic = "Please select a topic.";
    if (!form.message.trim() || form.message.length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    // Save to localStorage keyed by email so each user only sees their own inquiries
    const inquiry = {
      id: `INQ-${Date.now()}`,
      name: form.name,
      email: form.email,
      order: form.order,
      topic: form.topic,
      message: form.message,
      status: "In Review",
      submittedAt: new Date().toISOString(),
    };
    try {
      const key = `bnj_inquiries_${form.email.toLowerCase().trim()}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.unshift(inquiry);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch { /* ignore */ }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 bg-[#7CAE8E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <span className="text-3xl text-white font-bold" aria-hidden="true">✓</span>
        </div>
        <h1 className="font-[var(--font-dm-sans)] text-3xl font-bold text-[#2D2D2D] mb-3">Message Sent!</h1>
        <p className="text-gray-500 mb-2">
          Thanks, <strong>{form.name}</strong>! We've received your message about <em>{form.topic}</em>.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Our support team will get back to you at <strong>{form.email}</strong> within <strong>1–2 business days</strong>.
          You can track your inquiry status in <strong>My Box → Inquiries</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/my-box?tab=inquiries">
            <button className="min-h-[48px] bg-[#7CAE8E] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5F8F72] transition-colors">
              Track My Inquiry →
            </button>
          </Link>
          <Link href="/">
            <button className="min-h-[48px] border-2 border-[#7CAE8E] text-[#7CAE8E] px-6 py-3 rounded-full font-semibold hover:bg-[#7CAE8E] hover:text-white transition-colors">
              Back to Home
            </button>
          </Link>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: "", email: "", order: "", topic: "", message: "" }); }}
            className="min-h-[48px] border-2 border-gray-200 text-gray-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-[#7CAE8E] font-bold text-sm uppercase tracking-widest">We're Here to Help</span>
        <h1 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#2D2D2D] mt-2 mb-3">Contact Us</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Questions about your order, delivery, or subscription? We're happy to help. Fill out the form or reach us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left — info cards */}
        <div className="flex flex-col gap-4">
          {[
            {
              icon: "📦",
              title: "After-Sales Support",
              desc: "Issues with your box, missing items, or damaged products? We'll make it right.",
            },
            {
              icon: "🚚",
              title: "Delivery & Shipping",
              desc: "Track your order or report a delivery issue. Metro Manila delivery in 3–5 business days.",
            },
            {
              icon: "↩️",
              title: "Returns & Refunds",
              desc: "Changed your mind or received the wrong item? We process refunds within 5–7 business days.",
            },
            {
              icon: "💬",
              title: "Live Chat",
              desc: "Need a faster answer? Use the chat bubble at the bottom-right corner of this page.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="text-3xl mb-2">{card.icon}</div>
              <h3 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}

          {/* Direct contact */}
          <div className="bg-[#FAFAF7] rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-[#2D2D2D] text-sm mb-3">Direct Contact</h3>
            <div className="space-y-2 text-xs text-gray-500">
              <p>📧 <a href="mailto:support@boxnijuanph.com" className="text-[#7CAE8E] hover:underline">support@boxnijuanph.com</a></p>
              <p>🕐 Mon–Fri, 9:00 AM – 6:00 PM (PH Time)</p>
              <p>📍 Metro Manila, Philippines</p>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
            <h2 className="font-[var(--font-dm-sans)] font-bold text-[#2D2D2D] text-lg mb-1">Send Us a Message</h2>

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Juan dela Cruz"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7CAE8E] transition-colors ${errors.name ? "border-red-400" : "border-gray-200"}`}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <p id="name-error" className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="juan@email.com"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7CAE8E] transition-colors ${errors.email ? "border-red-400" : "border-gray-200"}`}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <p id="email-error" className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Order number (optional) */}
            <div>
              <label htmlFor="contact-order" className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Order Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="contact-order"
                type="text"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                placeholder="e.g. BNJ-123456"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7CAE8E] transition-colors"
              />
            </div>

            {/* Topic */}
            <div>
              <label htmlFor="contact-topic" className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Topic <span className="text-red-400">*</span>
              </label>
              <select
                id="contact-topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7CAE8E] transition-colors bg-white ${errors.topic ? "border-red-400" : "border-gray-200"}`}
                aria-describedby={errors.topic ? "topic-error" : undefined}
              >
                <option value="">Select a topic…</option>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.topic && <p id="topic-error" className="text-xs text-red-400 mt-1">{errors.topic}</p>}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your concern in detail…"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7CAE8E] transition-colors resize-none ${errors.message ? "border-red-400" : "border-gray-200"}`}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.message
                  ? <p id="message-error" className="text-xs text-red-400">{errors.message}</p>
                  : <span />}
                <span className={`text-xs ml-auto ${form.message.length < 10 ? "text-gray-400" : "text-[#7CAE8E]"}`}>
                  {form.message.length} chars
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[52px] bg-[#7CAE8E] hover:bg-[#5F8F72] text-white font-bold rounded-full text-sm transition-colors"
            >
              Send Message →
            </button>

            <p className="text-xs text-gray-400 text-center">
              🔒 Your information is protected under <strong>RA 10173</strong> (Data Privacy Act of 2012).
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  );
}
