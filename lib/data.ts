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
    // foam roller being used on a leg
    image: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=400&q=80",
    isLocal: false, isEco: false,
  },
  {
    id: "rf2", name: "Resistance Bands", category: "Recovery & Fitness", price: 150, emoji: "💪",
    // resistance bands flat lay
    image: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=400&q=80",
    isLocal: true, isEco: false,
  },
  {
    id: "rf3", name: "Cooling Towel", category: "Recovery & Fitness", price: 120, emoji: "🧊",
    // sport towel rolled up
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "rf4", name: "Compression Sleeve", category: "Recovery & Fitness", price: 160, emoji: "🦵",
    // compression sleeve on leg/arm
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&q=80",
    isLocal: false, isEco: false,
  },
  {
    id: "rf5", name: "Muscle Relief Balm", category: "Recovery & Fitness", price: 130, emoji: "💚",
    // small cream/balm jar
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80",
    isLocal: true, isEco: true,
  },

  // Healthy Snacks
  {
    id: "hs1", name: "Energy Bars (2pcs)", category: "Healthy Snacks", price: 90, emoji: "🍫",
    // protein / energy bars
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    isLocal: true, isEco: false,
  },
  {
    id: "hs2", name: "Trail Mix Pack", category: "Healthy Snacks", price: 95, emoji: "🥜",
    // mixed nuts and dried fruit trail mix in a bowl
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "hs3", name: "Electrolyte Drink", category: "Healthy Snacks", price: 80, emoji: "💧",
    // sports/electrolyte drink bottle or powder sachet
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
    isLocal: false, isEco: false,
  },
  {
    id: "hs4", name: "Dark Chocolate Bar", category: "Healthy Snacks", price: 85, emoji: "🍫",
    // dark chocolate bar broken into pieces
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "hs5", name: "Dried Fruit Pack", category: "Healthy Snacks", price: 75, emoji: "🍇",
    // dried fruits (mango, raisins, cranberries) in a bowl
    image: "https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?w=400&q=80",
    isLocal: true, isEco: true,
  },

  // Skincare for Athletes
  {
    id: "sk1", name: "SPF Lip Balm", category: "Skincare for Athletes", price: 65, emoji: "💋",
    // lip balm stick / tube close-up
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400&q=80",
    isLocal: true, isEco: false,
  },
  {
    id: "sk2", name: "Sunscreen Stick", category: "Skincare for Athletes", price: 110, emoji: "☀️",
    // sunscreen stick / SPF tube product
    image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&q=80",
    isLocal: false, isEco: false,
  },
  {
    id: "sk3", name: "Face Wipes (10pcs)", category: "Skincare for Athletes", price: 70, emoji: "🧻",
    // face/cleansing wipes pack
    image: "https://images.unsplash.com/photo-1614806687007-2215094d1d84?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "sk4", name: "Aloe Vera Gel", category: "Skincare for Athletes", price: 95, emoji: "🌿",
    // aloe vera gel in a clear bottle or fresh aloe leaf
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "sk5", name: "Vitamin C Serum Sachet", category: "Skincare for Athletes", price: 85, emoji: "✨",
    // serum bottle with dropper — vitamin C / brightening serum
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4a38a5c?w=400&q=80",
    isLocal: true, isEco: false,
  },

  // Lifestyle & Comfort
  {
    id: "lc1", name: "Motivational Journal", category: "Lifestyle & Comfort", price: 140, emoji: "📓",
    // open journal / notebook with pen
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "lc2", name: "Scented Candle", category: "Lifestyle & Comfort", price: 160, emoji: "🕯️",
    // lit scented candle in a glass jar
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "lc3", name: "Inspirational Card", category: "Lifestyle & Comfort", price: 40, emoji: "💌",
    // greeting / motivational card flat lay
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80",
    isLocal: true, isEco: false,
  },
  {
    id: "lc4", name: "Reusable Tote Bag", category: "Lifestyle & Comfort", price: 120, emoji: "👜",
    // canvas tote bag
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    isLocal: true, isEco: true,
  },
  {
    id: "lc5", name: "Sticker Sheet", category: "Lifestyle & Comfort", price: 35, emoji: "⭐",
    // colorful sticker sheet / sticker collection
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
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
