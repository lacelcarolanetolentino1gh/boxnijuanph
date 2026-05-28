// Central data store — products, plans, CSR content

export const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 399,
    items: 3,
    description: "1 Recovery, 1 Snack, 1 Lifestyle",
    color: "border-[#7D9B76]",
    badge: "",
  },
  {
    id: "standard",
    name: "Standard",
    price: 599,
    items: 5,
    description: "1 Recovery, 2 Snacks, 1 Skincare, 1 Lifestyle",
    color: "border-[#7D9B76]",
    badge: "Most Popular",
  },
  {
    id: "premium",
    name: "Premium",
    price: 899,
    items: 8,
    description: "2 Recovery, 2 Snacks, 2 Skincare, 2 Lifestyle",
    color: "border-[#7D9B76]",
    badge: "Best Value",
  },
];

export const PLAN_ITEM_COUNTS: Record<string, number> = {
  basic: 3,
  standard: 5,
  premium: 8,
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
  isLocal?: boolean;
  isEco?: boolean;
};

export const PRODUCTS: Product[] = [
  // Recovery & Fitness
  { id: "rf1", name: "Foam Roller Mini", category: "Recovery & Fitness", price: 180, emoji: "🔵", isLocal: false, isEco: false },
  { id: "rf2", name: "Resistance Bands", category: "Recovery & Fitness", price: 150, emoji: "💪", isLocal: true, isEco: false },
  { id: "rf3", name: "Cooling Towel", category: "Recovery & Fitness", price: 120, emoji: "🧊", isLocal: true, isEco: true },
  { id: "rf4", name: "Compression Sleeve", category: "Recovery & Fitness", price: 160, emoji: "🦵", isLocal: false, isEco: false },
  { id: "rf5", name: "Muscle Relief Balm", category: "Recovery & Fitness", price: 130, emoji: "💚", isLocal: true, isEco: true },

  // Healthy Snacks
  { id: "hs1", name: "Energy Bars (2pcs)", category: "Healthy Snacks", price: 90, emoji: "🍫", isLocal: true, isEco: false },
  { id: "hs2", name: "Trail Mix Pack", category: "Healthy Snacks", price: 95, emoji: "🥜", isLocal: true, isEco: true },
  { id: "hs3", name: "Electrolyte Drink", category: "Healthy Snacks", price: 80, emoji: "💧", isLocal: false, isEco: false },
  { id: "hs4", name: "Dark Chocolate Bar", category: "Healthy Snacks", price: 85, emoji: "🍫", isLocal: true, isEco: true },
  { id: "hs5", name: "Dried Fruit Pack", category: "Healthy Snacks", price: 75, emoji: "🍇", isLocal: true, isEco: true },

  // Skincare for Athletes
  { id: "sk1", name: "SPF Lip Balm", category: "Skincare for Athletes", price: 65, emoji: "💋", isLocal: true, isEco: false },
  { id: "sk2", name: "Sunscreen Stick", category: "Skincare for Athletes", price: 110, emoji: "☀️", isLocal: false, isEco: false },
  { id: "sk3", name: "Face Wipes (10pcs)", category: "Skincare for Athletes", price: 70, emoji: "🧻", isLocal: true, isEco: true },
  { id: "sk4", name: "Aloe Vera Gel", category: "Skincare for Athletes", price: 95, emoji: "🌿", isLocal: true, isEco: true },
  { id: "sk5", name: "Vitamin C Serum Sachet", category: "Skincare for Athletes", price: 85, emoji: "✨", isLocal: true, isEco: false },

  // Lifestyle & Comfort
  { id: "lc1", name: "Motivational Journal", category: "Lifestyle & Comfort", price: 140, emoji: "📓", isLocal: true, isEco: true },
  { id: "lc2", name: "Scented Candle", category: "Lifestyle & Comfort", price: 160, emoji: "🕯️", isLocal: true, isEco: true },
  { id: "lc3", name: "Inspirational Card", category: "Lifestyle & Comfort", price: 40, emoji: "💌", isLocal: true, isEco: false },
  { id: "lc4", name: "Reusable Tote Bag", category: "Lifestyle & Comfort", price: 120, emoji: "👜", isLocal: true, isEco: true },
  { id: "lc5", name: "Sticker Sheet", category: "Lifestyle & Comfort", price: 35, emoji: "⭐", isLocal: true, isEco: false },
];

export const CATEGORIES = ["Recovery & Fitness", "Healthy Snacks", "Skincare for Athletes", "Lifestyle & Comfort"];

export const CSR_COMMITMENTS = [
  {
    icon: "🇵🇭",
    title: "Supporting Local Brands",
    description: "We feature Filipino wellness brands and local producers in every box, helping small businesses reach more customers.",
  },
  {
    icon: "♻️",
    title: "Reducing Product Waste",
    description: "You choose every item in your box — nothing goes to waste. No unwanted products, no unnecessary packaging.",
  },
  {
    icon: "🌱",
    title: "Responsible Consumption",
    description: "Aligned with UN SDG 12, we empower consumers to make intentional, mindful purchasing decisions every month.",
  },
];
