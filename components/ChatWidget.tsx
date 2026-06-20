"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCTS, Product } from "@/lib/data";

type PageLink = { label: string; href: string };
type TextMessage = { from: "user" | "bot"; type: "text"; text: string; links?: PageLink[] };
type ProductMessage = { from: "bot"; type: "products"; text: string; products: Product[] };
type ContinuePrompt = { from: "bot"; type: "continue-prompt"; text: string };
type Message = TextMessage | ProductMessage | ContinuePrompt;

const HISTORY_KEY = "boxbotHistory";
const CONTINUE_PROMPT_KEY = "boxbotShowContinuePrompt";
const MAX_HISTORY = 60;

// ── Bot response rules ────────────────────────────────────────────
const BOT_RESPONSES: { keywords: string[]; reply: string; links?: PageLink[] }[] = [
  {
    keywords: ["order", "status", "where", "track"],
    reply: "To check your order status, look for your confirmation email with your order number (BNJ-XXXXXX). Deliveries within Metro Manila take 3–5 business days. 📦",
    links: [{ label: "View My Box →", href: "/my-box" }, { label: "FAQ: Delivery →", href: "/faq#delivery" }],
  },
  {
    keywords: ["cancel", "cancellation", "stop", "unsubscribe"],
    reply: "You can cancel your subscription anytime — no lock-in! Go to My Box → Manage → Cancel Subscription, or email support@boxnijuanph.com with your order number. We process it within 24 hours. ✅",
    links: [{ label: "Manage My Box →", href: "/my-box" }, { label: "FAQ: Cancellation →", href: "/faq#cancellation" }],
  },
  {
    keywords: ["refund", "return", "replace", "wrong", "missing", "damaged"],
    reply: "Sorry to hear that! For refunds or replacements, email support@boxnijuanph.com with your order number and a photo of the issue. We process refunds within 5–7 business days. 💚",
    links: [{ label: "Contact Support →", href: "/contact" }, { label: "FAQ: Returns →", href: "/faq#returns" }],
  },
  {
    keywords: ["delivery", "shipping", "deliver", "arrive", "when"],
    reply: "We deliver within Metro Manila in 3–5 business days after your box is packed. You'll get a confirmation email once your box ships. 🚚",
    links: [{ label: "FAQ: Delivery →", href: "/faq#delivery" }],
  },
  {
    keywords: ["payment", "pay", "charge", "billing", "gcash", "maya", "debit", "credit"],
    reply: "We accept GCash, Maya, and major credit/debit cards. All payments are encrypted and we never store your card details. 🔒",
    links: [{ label: "FAQ: Payment →", href: "/faq#payment" }],
  },
  {
    keywords: ["plan", "price", "cost", "basic", "standard", "premium", "custom", "how much"],
    reply: "We have 4 plans:\n• Basic — ₱399/mo (3 items)\n• Standard — ₱599/mo (5 items)\n• Premium — ₱899/mo (8 items)\n• Custom — ₱1,299/mo (unlimited items)\nAll include free Metro Manila delivery! 🎁",
    links: [{ label: "View All Plans →", href: "/plans" }, { label: "Build Your Box →", href: "/builder" }],
  },
  {
    keywords: ["hello", "hi", "hey", "kumusta", "good morning", "good afternoon", "good evening", "musta"],
    reply: "Hi there! 👋 I'm BoxBot, your BoxNiJuanPH assistant. Ask me about orders, delivery, refunds, plans, or products — I'm here to help!",
    links: [{ label: "Browse Products →", href: "/products" }, { label: "See Plans →", href: "/plans" }],
  },
  {
    keywords: ["thank", "thanks", "salamat", "ty"],
    reply: "You're welcome! Salamat sa iyong suporta sa BoxNiJuanPH. 💚 Anything else I can help with?",
  },
  {
    keywords: ["human", "agent", "real person", "talk to someone", "representative", "support"],
    reply: "To reach a real support agent, email support@boxnijuanph.com or use our Contact page. We respond within 1–2 business days. 😊",
    links: [{ label: "Contact Us →", href: "/contact" }],
  },
  {
    keywords: ["privacy", "data", "personal", "ra 10173"],
    reply: "Your personal data is protected under RA 10173 (Data Privacy Act of 2012). We only collect information needed for order fulfillment and never share it with third parties. 🔒",
    links: [{ label: "FAQ: Privacy →", href: "/faq#privacy" }],
  },
  {
    keywords: ["faq", "guide", "help", "how to", "question"],
    reply: "Our FAQ page has everything you need — delivery timelines, refund process, payment info, and more! 📋",
    links: [{ label: "Visit FAQ →", href: "/faq" }],
  },
  {
    keywords: ["category", "categories", "types", "kinds"],
    reply: "Our products fall into 4 categories:\n• 🏃 Recovery & Fitness\n• 🥜 Healthy Snacks\n• ✨ Skincare for Athletes\n• 🕯️ Lifestyle & Comfort\n\nWant me to show you products from a specific category?",
    links: [{ label: "Browse All Products →", href: "/products" }],
  },
  {
    keywords: ["local", "philippine", "filipino", "ph brand", "local brand"],
    reply: "We love supporting Filipino brands! 🇵🇭 Most of our products are from local Philippine wellness brands like SarapFit, HilomNaturals, GalosPorta, PadayonPH, and more.",
    links: [{ label: "Browse Products →", href: "/products" }],
  },
  {
    keywords: ["eco", "sustainable", "green", "environment", "sdg", "csr"],
    reply: "BoxNiJuanPH is aligned with UN SDG 12 (Responsible Consumption). Many of our products are eco-friendly and sustainably sourced. ♻️",
  },
];

const FALLBACK = "I'm not sure about that one! For specific concerns, visit our Contact page or email support@boxnijuanph.com. 😊";

// ── Product keyword detection ─────────────────────────────────────
function findMatchingProducts(input: string): Product[] {
  const lower = input.toLowerCase();
  // Category shortcuts
  const categoryMap: Record<string, string> = {
    "recovery": "Recovery & Fitness",
    "fitness": "Recovery & Fitness",
    "snack": "Healthy Snacks",
    "food": "Healthy Snacks",
    "skincare": "Skincare for Athletes",
    "skin care": "Skincare for Athletes",
    "lifestyle": "Lifestyle & Comfort",
    "comfort": "Lifestyle & Comfort",
  };
  for (const [kw, cat] of Object.entries(categoryMap)) {
    if (lower.includes(kw)) return PRODUCTS.filter((p) => p.category === cat).slice(0, 4);
  }
  // Specific product name match
  const matched = PRODUCTS.filter((p) =>
    p.name.toLowerCase().split(" ").some((word) => word.length > 3 && lower.includes(word)) ||
    p.brand.toLowerCase().split(" ").some((word) => word.length > 3 && lower.includes(word))
  );
  return matched.slice(0, 4);
}

function getBotReply(input: string): { text: string; products: Product[]; links?: PageLink[] } {
  const lower = input.toLowerCase();

  // Check product intent first
  const productTriggers = ["show", "what products", "what items", "do you have", "available", "see product", "see item", "browse", "catalog", "list"];
  const hasProductIntent = productTriggers.some((t) => lower.includes(t));
  const matchedProducts = findMatchingProducts(input);

  if (hasProductIntent && matchedProducts.length > 0) {
    return { text: `Here are some products that match your interest! Click any to explore in the builder. 🛍️`, products: matchedProducts, links: [{ label: "Browse All Products →", href: "/products" }] };
  }
  if (hasProductIntent) {
    // No specific match — show a sample of all products
    const sample = PRODUCTS.slice(0, 4);
    return { text: `Here's a sample of what's in our catalog! Head to the Products page to see everything. 🛍️`, products: sample, links: [{ label: "Browse All Products →", href: "/products" }, { label: "Build Your Box →", href: "/builder" }] };
  }
  if (matchedProducts.length > 0 && !BOT_RESPONSES.some((r) => r.keywords.some((k) => lower.includes(k)))) {
    return { text: `Found some products that might interest you! Head to the builder to add them to your box. 🛍️`, products: matchedProducts, links: [{ label: "Build Your Box →", href: "/builder" }] };
  }

  for (const r of BOT_RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return { text: r.reply, products: [], links: r.links };
  }
  return { text: FALLBACK, products: [], links: [{ label: "Visit FAQ →", href: "/faq" }, { label: "Contact Us →", href: "/contact" }] };
}

// ── BoxBot icon SVG ───────────────────────────────────────────────
function BoxBotIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      {/* Head */}
      <rect x="7" y="9" width="18" height="14" rx="3" fill="currentColor" opacity="0.9" />
      {/* Eyes */}
      <circle cx="12" cy="15" r="2" fill="white" />
      <circle cx="20" cy="15" r="2" fill="white" />
      <circle cx="12.7" cy="15.7" r="0.8" fill="#7CAE8E" />
      <circle cx="20.7" cy="15.7" r="0.8" fill="#7CAE8E" />
      {/* Mouth */}
      <rect x="11" y="19" width="10" height="1.5" rx="0.75" fill="white" opacity="0.7" />
      {/* Antenna */}
      <line x1="16" y1="9" x2="16" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="4" r="1.5" fill="currentColor" />
      {/* Ears */}
      <rect x="4" y="13" width="3" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="25" y="13" width="3" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

// ── Product card in chat ──────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  return (
    <Link href="/builder" className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-2.5 hover:border-[#7CAE8E] hover:shadow-sm transition-all group">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
        <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#2D2D2D] leading-tight truncate">{product.name}</p>
        <p className="text-[10px] text-gray-400 truncate">{product.brand}</p>
        <p className="text-[10px] text-[#7CAE8E] font-semibold mt-0.5">₱{product.price} · Add to builder →</p>
      </div>
    </Link>
  );
}

// ── Main ChatWidget ───────────────────────────────────────────────
export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) return JSON.parse(stored);
      } catch { /* ignore */ }
    }
    return [{ from: "bot", type: "text", text: "Hi! 👋 I'm BoxBot. Ask me about orders, delivery, refunds, plans, or products — I'm here to help!" }];
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Persist history to localStorage whenever messages change
  useEffect(() => {
    const toSave = messages.slice(-MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(toSave));
  }, [messages]);

  // After login: if there's prior history, flag a pending prompt — don't auto-open
  useEffect(() => {
    const shouldPrompt = localStorage.getItem(CONTINUE_PROMPT_KEY);
    if (!shouldPrompt) return;
    localStorage.removeItem(CONTINUE_PROMPT_KEY);
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return;
    try {
      const prior: Message[] = JSON.parse(stored);
      if (prior.length <= 1) return;
      // Just flag it — inject the prompt when user opens the chat
      setPendingPrompt(true);
    } catch { /* ignore */ }
  }, [pathname]);

  useEffect(() => {
    if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, minimized, typing]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { from: "user", type: "text", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const { text: replyText, products, links } = getBotReply(text);
      const botMsg: Message = products.length > 0
        ? { from: "bot", type: "products", text: replyText, products }
        : { from: "bot", type: "text", text: replyText, links };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 900);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleClearHistory = () => {
    const initial: Message[] = [{ from: "bot", type: "text", text: "Hi! 👋 I'm BoxBot. How can I help you today?" }];
    setMessages(initial);
    localStorage.removeItem(HISTORY_KEY);
  };

  const handleContinue = () => {
    // Remove the continue-prompt message and keep existing history
    setMessages((prev) => prev.filter((m) => m.type !== "continue-prompt"));
  };

  const handleStartFresh = () => {
    const initial: Message[] = [{ from: "bot", type: "text", text: "Hi! 👋 I'm BoxBot. How can I help you today?" }];
    setMessages(initial);
    localStorage.removeItem(HISTORY_KEY);
  };

  const handleOpen = () => {
    // If there's a pending continue prompt, inject it now that user chose to open
    if (pendingPrompt) {
      const prompt: ContinuePrompt = {
        from: "bot",
        type: "continue-prompt",
        text: "Welcome back! I saved our previous conversation. Would you like to continue where we left off, or start a fresh chat?",
      };
      setMessages((prev) => [...prev, prompt]);
      setPendingPrompt(false);
    }
    setOpen(true);
    setMinimized(false);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-200"
          style={{ maxHeight: minimized ? "56px" : "520px" }}
          role="dialog"
          aria-label="BoxBot customer support chat"
        >
          {/* Header — always visible, clickable when minimized to expand */}
          <div
            className={`bg-[#7CAE8E] px-4 py-3 flex items-center justify-between shrink-0 ${minimized ? "cursor-pointer" : ""}`}
            onClick={minimized ? () => setMinimized(false) : undefined}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                <BoxBotIcon size={22} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">BoxBot</p>
                <p className="text-green-100 text-xs">
                  {minimized ? "Click to expand" : "BoxNiJuanPH Support · Always online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!minimized && (
                <button
                  onClick={handleClearHistory}
                  aria-label="Clear chat history"
                  title="Clear chat"
                  className="text-white/60 hover:text-white transition-colors p-1 text-xs"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              )}
              {/* Minimize / Expand toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); setMinimized((v) => !v); }}
                aria-label={minimized ? "Expand chat" : "Minimize chat"}
                title={minimized ? "Expand" : "Minimize"}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                {minimized ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
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
          </div>

          {/* Body — hidden when minimized */}
          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#FAFAF7]">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.from === "bot" && (
                      <div className="w-6 h-6 rounded-full bg-[#7CAE8E] text-white flex items-center justify-center shrink-0 mr-2 mt-0.5">
                        <BoxBotIcon size={14} />
                      </div>
                    )}
                    <div className="max-w-[80%] space-y-2">
                      {msg.type === "continue-prompt" ? (
                        <div className="bg-white border border-[#7CAE8E]/40 rounded-2xl rounded-bl-sm shadow-sm px-3 py-3 space-y-2">
                          <p className="text-sm text-[#2D2D2D] leading-relaxed">{msg.text}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleContinue}
                              className="flex-1 text-xs font-semibold bg-[#7CAE8E] text-white px-3 py-1.5 rounded-full hover:bg-[#5F8F72] transition-colors"
                            >
                              Continue chat
                            </button>
                            <button
                              onClick={handleStartFresh}
                              className="flex-1 text-xs font-semibold border border-gray-200 text-gray-500 px-3 py-1.5 rounded-full hover:border-red-300 hover:text-red-400 transition-colors"
                            >
                              Start fresh
                            </button>
                          </div>
                        </div>
                      ) : msg.type === "products" ? (
                        <>
                          <div className="bg-white text-[#2D2D2D] border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm px-3 py-2 text-sm leading-relaxed">
                            {msg.text}
                          </div>
                          <div className="space-y-2">
                            {msg.products.map((p) => <ProductCard key={p.id} product={p} />)}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                              msg.from === "user"
                                ? "bg-[#7CAE8E] text-white rounded-br-sm"
                                : "bg-white text-[#2D2D2D] border border-gray-100 rounded-bl-sm shadow-sm"
                            }`}
                          >
                            {msg.text}
                          </div>
                          {msg.from === "bot" && msg.links && msg.links.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {msg.links.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="text-[11px] font-medium text-[#5F8F72] border border-[#7CAE8E] px-2.5 py-1 rounded-full hover:bg-[#7CAE8E] hover:text-white transition-colors"
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-[#7CAE8E] text-white flex items-center justify-center shrink-0 mr-2">
                      <BoxBotIcon size={14} />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              <div className="px-4 pt-2 pb-1 flex gap-2 flex-wrap bg-white border-t border-gray-50 shrink-0">
                {["Order status", "Plans & pricing", "Show products", "Delivery", "Refund", "FAQ"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
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
            </>
          )}
        </div>
      )}

      {/* Floating button — hidden when panel is open */}
      {!open && (
        <button
          onClick={handleOpen}
          aria-label="Open BoxBot chat"
          className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#7CAE8E] hover:bg-[#5F8F72] text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          <BoxBotIcon size={26} className="text-white" />
          {pendingPrompt ? (
            // Pulsing badge — indicates a message is waiting
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-white animate-pulse" aria-label="Message waiting" />
          ) : (
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white" aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}
