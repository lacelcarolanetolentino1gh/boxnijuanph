// Central data store — products, plans, CSR content

export const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 399,
    items: 3,
    description: "1 Recovery, 1 Snack, 1 Lifestyle",
    badge: "",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  },
  {
    id: "standard",
    name: "Standard",
    price: 599,
    items: 5,
    description: "1 Recovery, 2 Snacks, 1 Skincare, 1 Lifestyle",
    badge: "Most Popular",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
  },
  {
    id: "premium",
    name: "Premium",
    price: 899,
    items: 8,
    description: "2 Recovery, 2 Snacks, 2 Skincare, 2 Lifestyle",
    badge: "Best Value",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
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
  image: string;
  isLocal?: boolean;
  isEco?: boolean;
};

export const PRODUCTS: Product[] = [
  // Recovery & Fitness
  {
    id: "rf1", name: "Foam Roller Mini", category: "Recovery & Fitness", price: 180, emoji: "🔵",
    image: "https://images.unsplash.com/photo-1591741535585-9c4f52b3f13f?w=400&q=80",
    isLocal: false, isEco: false,
  },
  {
    id: "rf2", name: "Resistance Bands", category: "Recovery & Fitness", price: 150, emoji: "💪",
    image: "https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?w=400&q=80",
    isLocal: true, isEco: false,
  },
  {
    id: "rf3", name: "Cooling Towel", category: "Recovery & Fitness", price: 120, emoji: "🧊",
    image: "https://images.unsplash.com/photo-1707891729873-74e980ceae28?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "rf4", name: "Compression Sleeve", category: "Recovery & Fitness", price: 160, emoji: "🦵",
    image: "https://images.unsplash.com/photo-1626440861753-c763534349b2?w=400&q=80",
    isLocal: false, isEco: false,
  },
  {
    id: "rf5", name: "Muscle Relief Balm", category: "Recovery & Fitness", price: 130, emoji: "💚",
    image: "https://images.unsplash.com/photo-1671575192248-5d8e42f18a9c?w=400&q=80",
    isLocal: true, isEco: true,
  },

  // Healthy Snacks
  {
    id: "hs1", name: "Energy Bars (2pcs)", category: "Healthy Snacks", price: 90, emoji: "🍫",
    image: "https://images.unsplash.com/photo-1629214831802-bb2a07f9517e?w=400&q=80",
    isLocal: true, isEco: false,
  },
  {
    id: "hs2", name: "Trail Mix Pack", category: "Healthy Snacks", price: 95, emoji: "🥜",
    image: "https://images.unsplash.com/photo-1767877609689-beff32b9c0ac?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "hs3", name: "Electrolyte Drink", category: "Healthy Snacks", price: 80, emoji: "💧",
    image: "https://images.unsplash.com/photo-1741520504652-27c2a6c0015e?w=400&q=80",
    isLocal: false, isEco: false,
  },
  {
    id: "hs4", name: "Dark Chocolate Bar", category: "Healthy Snacks", price: 85, emoji: "🍫",
    image: "https://images.unsplash.com/photo-1551578657-a7e74acb0135?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "hs5", name: "Dried Fruit Pack", category: "Healthy Snacks", price: 75, emoji: "🍇",
    image: "https://images.unsplash.com/photo-1647945387141-387b88af06fd?w=400&q=80",
    isLocal: true, isEco: true,
  },

  // Skincare for Athletes
  {
    id: "sk1", name: "SPF Lip Balm", category: "Skincare for Athletes", price: 65, emoji: "💋",
    image: "https://images.unsplash.com/photo-1512351660358-6bed42b7b842?w=400&q=80",
    isLocal: true, isEco: false,
  },
  {
    id: "sk2", name: "Sunscreen Stick", category: "Skincare for Athletes", price: 110, emoji: "☀️",
    image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?w=400&q=80",
    isLocal: false, isEco: false,
  },
  {
    id: "sk3", name: "Face Wipes (10pcs)", category: "Skincare for Athletes", price: 70, emoji: "🧻",
    image: "https://images.unsplash.com/photo-1734599895291-d25a27e4cb45?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "sk4", name: "Aloe Vera Gel", category: "Skincare for Athletes", price: 95, emoji: "🌿",
    image: "https://images.unsplash.com/photo-1570295835271-04c05b4ed943?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "sk5", name: "Vitamin C Serum Sachet", category: "Skincare for Athletes", price: 85, emoji: "✨",
    image: "https://images.unsplash.com/photo-1642162225900-8d4e658252c9?w=400&q=80",
    isLocal: true, isEco: false,
  },

  // Lifestyle & Comfort
  {
    id: "lc1", name: "Motivational Journal", category: "Lifestyle & Comfort", price: 140, emoji: "📓",
    image: "https://images.unsplash.com/photo-1483546416237-76fd26bbcdd1?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "lc2", name: "Scented Candle", category: "Lifestyle & Comfort", price: 160, emoji: "🕯️",
    image: "https://images.unsplash.com/photo-1661313562934-d902cb4ad0bb?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "lc3", name: "Inspirational Card", category: "Lifestyle & Comfort", price: 40, emoji: "💌",
    image: "https://images.unsplash.com/photo-1481011784351-b0227b9f4a80?w=400&q=80",
    isLocal: true, isEco: false,
  },
  {
    id: "lc4", name: "Reusable Tote Bag", category: "Lifestyle & Comfort", price: 120, emoji: "👜",
    image: "https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "lc5", name: "Sticker Sheet", category: "Lifestyle & Comfort", price: 35, emoji: "⭐",
    image: "https://images.unsplash.com/photo-1778278553405-09b847a2af3e?w=400&q=80",
    isLocal: true, isEco: false,
  },
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
