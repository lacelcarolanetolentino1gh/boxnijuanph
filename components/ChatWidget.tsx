"use client";
import { useState, useRef, useEffect } from "react";

type Message = { from: "user" | "bot"; text: string };

const BOT_RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["order", "status", "where", "track"],
    reply: "To check your order status, please look for your confirmation email with your order number (BNJ-XXXXXX). Deliveries within Metro Manila take 3–5 business days. 📦",
  },
  {
    keywords: ["cancel", "cancellation", "stop", "unsubscribe"],
    reply: "You can cancel your subscription anytime — no lock-in! Just reply to your confirmation email or send us a message at support@boxnijuanph.com with your order number and 'Cancel'. We'll process it within 24 hours. ✅",
  },
  {
    keywords: ["refund", "return", "replace", "wrong", "missing", "damaged"],
    reply: "We're sorry to hear that! For refunds or replacements, please contact us at support@boxnijuanph.com with your order number and a photo of the issue. We process refunds within 5–7 business days. 💚",
  },
  {
    keywords: ["delivery", "shipping", "deliver", "arrive", "when"],
    reply: "We deliver within Metro Manila in 3–5 business days after your box is packed. A confirmation email is sent once your box is shipped. 🚚",
  },
  {
    keywords: ["payment", "pay", "charge", "billing", "debit", "credit"],
    reply: "We accept GCash, PayMaya, and major credit/debit cards. All payments are encrypted and we never store your card details. 🔒",
  },
  {
    keywords: ["product", "item", "snack", "skincare", "recovery", "fitness"],
    reply: "Our boxes include items from 4 categories: Recovery & Fitness, Healthy Snacks, Skincare for Athletes, and Lifestyle & Comfort — all from Filipino local brands! 🇵🇭",
  },
  {
    keywords: ["plan", "price", "cost", "basic", "standard", "premium"],
    reply: "We have 3 plans:\n• Basic — ₱399/mo (3 items)\n• Standard — ₱599/mo (5 items)\n• Premium — ₱899/mo (8 items)\nAll include free delivery within Metro Manila! 🎁",
  },
  {
    keywords: ["hello", "hi", "hey", "kumusta", "good morning", "good afternoon"],
    reply: "Hi there! 👋 I'm BoxBot, your BoxNiJuanPH support assistant. How can I help you today? You can ask about orders, delivery, refunds, plans, or products!",
  },
  {
    keywords: ["thank", "thanks", "salamat"],
    reply: "You're welcome! Salamat sa iyong suporta sa BoxNiJuanPH. 💚 Is there anything else I can help you with?",
  },
  {
    keywords: ["human", "agent", "real person", "talk to someone", "representative"],
    reply: "To speak with a real support agent, please email us at support@boxnijuanph.com or fill out our Contact Us form. We respond within 1–2 business days. 😊",
  },
];

const FALLBACK = "I'm not sure about that one! For specific concerns, please visit our Contact Us page or email support@boxnijuanph.com and our team will help you. 😊";

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const r of BOT_RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return r.reply;
  }
  return FALLBACK;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! 👋 I'm BoxBot. Ask me about your order, delivery, refunds, or our plans. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, typing]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      setTyping(false);
    }, 900);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: "480px" }}
          role="dialog"
          aria-label="BoxBot customer support chat"
        >
          {/* Header */}
          <div className="bg-[#7CAE8E] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">B</div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">BoxBot</p>
                <p className="text-green-100 text-xs">BoxNiJuanPH Support · Always online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#FAFAF7]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.from === "user"
                      ? "bg-[#7CAE8E] text-white rounded-br-sm"
                      : "bg-white text-[#2D2D2D] border border-gray-100 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-4 pt-2 pb-1 flex gap-2 flex-wrap bg-white border-t border-gray-50 shrink-0">
            {["Order status", "Cancel subscription", "Refund", "Delivery"].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="text-xs border border-[#7CAE8E] text-[#7CAE8E] px-2.5 py-1 rounded-full hover:bg-[#7CAE8E] hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              aria-label="Chat message"
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7CAE8E] transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              aria-label="Send message"
              className="w-9 h-9 bg-[#7CAE8E] hover:bg-[#5F8F72] disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close customer support chat" : "Open customer support chat"}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#7CAE8E] hover:bg-[#5F8F72] text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        )}
        {/* Unread dot — shown when closed */}
        {!open && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
