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

export type ProductDetail = {
  description: string;
  purpose: string;
  contents: string;
  nutrition?: {
    servingSize: string;
    calories: number;
    protein?: string;
    carbs?: string;
    fat?: string;
    sugar?: string;
  };
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
  variants: string[];
  details: ProductDetail;
};

export const PRODUCTS: Product[] = [
  // ── Recovery & Fitness ─────────────────────────────────────────
  {
    id: "rf1",
    name: "Foam Roller Mini",
    category: "Recovery & Fitness",
    price: 180,
    emoji: "🔵",
    image: "https://images.unsplash.com/photo-1591741535585-9c4f52b3f13f?w=400&q=80",
    isLocal: false,
    isEco: false,
    variants: ["Smooth", "Textured / Grid", "Spiky Trigger Point"],
    details: {
      description: "A compact foam roller designed for post-workout muscle recovery and myofascial release.",
      purpose: "Relieves muscle tension, improves circulation, and reduces soreness after exercise.",
      contents: "High-density EVA foam core, 30 cm length, 14 cm diameter. Includes carrying mesh bag.",
    },
  },
  {
    id: "rf2",
    name: "Resistance Bands",
    category: "Recovery & Fitness",
    price: 150,
    emoji: "💪",
    image: "https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?w=400&q=80",
    isLocal: true,
    isEco: false,
    variants: ["Light (3–5 kg)", "Medium (7–12 kg)", "Heavy (15–20 kg)"],
    details: {
      description: "Latex-free resistance bands made from natural rubber, locally manufactured in the Philippines.",
      purpose: "Strength training, physical therapy, stretching, and warm-up routines.",
      contents: "Set of 1 band. Material: 100% natural rubber latex-free. Dimensions: 208 cm loop length.",
    },
  },
  {
    id: "rf3",
    name: "Cooling Towel",
    category: "Recovery & Fitness",
    price: 120,
    emoji: "🧊",
    image: "https://images.unsplash.com/photo-1707891729873-74e980ceae28?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["Arctic Blue", "Forest Green", "Slate Gray"],
    details: {
      description: "Hyper-evaporative microfiber towel that cools instantly on contact with water.",
      purpose: "Cools body temperature during and after workouts. Ideal for outdoor sports and hot yoga.",
      contents: "100% microfiber polyester, 30 × 100 cm. Machine washable. Reusable up to 300+ washes.",
    },
  },
  {
    id: "rf4",
    name: "Compression Sleeve",
    category: "Recovery & Fitness",
    price: 160,
    emoji: "🦵",
    image: "https://images.unsplash.com/photo-1626440861753-c763534349b2?w=400&q=80",
    isLocal: false,
    isEco: false,
    variants: ["Arm Sleeve (S/M)", "Arm Sleeve (L/XL)", "Calf Sleeve (S/M)", "Calf Sleeve (L/XL)"],
    details: {
      description: "Graduated compression sleeve that supports muscles and joints during high-impact activities.",
      purpose: "Reduces muscle fatigue, improves blood flow, and speeds up post-workout recovery.",
      contents: "80% Nylon, 20% Spandex. Graduated 15–20 mmHg compression. Moisture-wicking, anti-odor.",
    },
  },
  {
    id: "rf5",
    name: "Muscle Relief Balm",
    category: "Recovery & Fitness",
    price: 130,
    emoji: "💚",
    image: "https://images.unsplash.com/photo-1671575192248-5d8e42f18a9c?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["Cooling Menthol", "Warming Camphor", "Unscented"],
    details: {
      description: "Fast-absorbing topical balm formulated with natural Filipino herbs for sore muscle relief.",
      purpose: "Eases muscle soreness, joint pain, and post-workout inflammation. Apply directly to affected area.",
      contents: "Key ingredients: Eucalyptus oil, menthol, camphor, virgin coconut oil, beeswax. 50g jar. Paraben-free.",
    },
  },

  // ── Healthy Snacks ──────────────────────────────────────────────
  {
    id: "hs1",
    name: "Energy Bars (2pcs)",
    category: "Healthy Snacks",
    price: 90,
    emoji: "🍫",
    image: "https://images.unsplash.com/photo-1629214831802-bb2a07f9517e?w=400&q=80",
    isLocal: true,
    isEco: false,
    variants: ["Chocolate Almond", "Peanut Butter", "Mango Cashew", "Ube Coconut"],
    details: {
      description: "All-natural energy bars made with whole grains, nuts, and local Filipino superfoods.",
      purpose: "Pre- or post-workout fuel. Provides sustained energy without refined sugar spikes.",
      contents: "Oats, brown rice crisps, honey, nuts, dried fruit. No artificial preservatives.",
      nutrition: {
        servingSize: "1 bar (45g)",
        calories: 180,
        protein: "6g",
        carbs: "24g",
        fat: "7g",
        sugar: "8g",
      },
    },
  },
  {
    id: "hs2",
    name: "Trail Mix Pack",
    category: "Healthy Snacks",
    price: 95,
    emoji: "🥜",
    image: "https://images.unsplash.com/photo-1767877609689-beff32b9c0ac?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["Classic (Nuts + Raisins)", "Tropical (Mango + Coconut)", "Spicy (Chili Cashews)"],
    details: {
      description: "Locally sourced premium trail mix packed with nuts, seeds, and dried tropical fruits.",
      purpose: "Quick energy snack for hiking, sports, or any time you need a healthy pick-me-up.",
      contents: "Cashews, almonds, pumpkin seeds, dried mango, raisins. Gluten-free. No added sugar.",
      nutrition: {
        servingSize: "1 pack (40g)",
        calories: 210,
        protein: "5g",
        carbs: "18g",
        fat: "13g",
        sugar: "9g",
      },
    },
  },
  {
    id: "hs3",
    name: "Electrolyte Drink",
    category: "Healthy Snacks",
    price: 80,
    emoji: "💧",
    image: "https://images.unsplash.com/photo-1741520504652-27c2a6c0015e?w=400&q=80",
    isLocal: false,
    isEco: false,
    variants: ["Lemon Citrus", "Watermelon", "Green Apple", "Mango Burst"],
    details: {
      description: "Sugar-free electrolyte drink powder sachet designed for rapid hydration during intense workouts.",
      purpose: "Replenishes sodium, potassium, and magnesium lost through sweat. Prevents cramps and dehydration.",
      contents: "Key electrolytes: Sodium 240mg, Potassium 150mg, Magnesium 40mg. Zero sugar. Mix with 250ml water.",
      nutrition: {
        servingSize: "1 sachet (8g) in 250ml water",
        calories: 10,
        protein: "0g",
        carbs: "2g",
        fat: "0g",
        sugar: "0g",
      },
    },
  },
  {
    id: "hs4",
    name: "Dark Chocolate Bar",
    category: "Healthy Snacks",
    price: 85,
    emoji: "🍫",
    image: "https://images.unsplash.com/photo-1551578657-a7e74acb0135?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["70% Cacao", "85% Cacao", "90% Cacao"],
    details: {
      description: "Artisanal dark chocolate made from single-origin Filipino cacao beans from Davao.",
      purpose: "Rich in antioxidants and magnesium. A guilt-free treat that supports heart health.",
      contents: "Ingredients: Cacao mass (Davao origin), raw cane sugar, cocoa butter. Vegan. Dairy-free.",
      nutrition: {
        servingSize: "3 squares (30g)",
        calories: 165,
        protein: "2g",
        carbs: "12g",
        fat: "11g",
        sugar: "6g",
      },
    },
  },
  {
    id: "hs5",
    name: "Dried Fruit Pack",
    category: "Healthy Snacks",
    price: 75,
    emoji: "🍇",
    image: "https://images.unsplash.com/photo-1647945387141-387b88af06fd?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["Dried Mango", "Dried Banana Chips", "Mixed Tropical Fruits"],
    details: {
      description: "Sun-dried and dehydrated tropical fruits from local Filipino farms. No added sugar or preservatives.",
      purpose: "Natural source of fiber and quick-release carbohydrates. Great for pre-workout energy.",
      contents: "100% real fruit. No sulphites. No added sugar. Sourced from Mindanao and Visayas farms.",
      nutrition: {
        servingSize: "1 pack (35g)",
        calories: 105,
        protein: "1g",
        carbs: "26g",
        fat: "0g",
        sugar: "22g",
      },
    },
  },

  // ── Skincare for Athletes ───────────────────────────────────────
  {
    id: "sk1",
    name: "SPF Lip Balm",
    category: "Skincare for Athletes",
    price: 65,
    emoji: "💋",
    image: "https://images.unsplash.com/photo-1512351660358-6bed42b7b842?w=400&q=80",
    isLocal: true,
    isEco: false,
    variants: ["SPF 30 — Unscented", "SPF 50 — Mint", "SPF 50 — Coconut"],
    details: {
      description: "Tinted SPF lip balm enriched with coconut oil and vitamin E. Locally formulated.",
      purpose: "Protects lips from UV damage, chapping, and dehydration during outdoor sports.",
      contents: "Key ingredients: Beeswax, coconut oil, vitamin E, zinc oxide (UV filter). 4.5g stick. Cruelty-free.",
    },
  },
  {
    id: "sk2",
    name: "Sunscreen Stick",
    category: "Skincare for Athletes",
    price: 110,
    emoji: "☀️",
    image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?w=400&q=80",
    isLocal: false,
    isEco: false,
    variants: ["SPF 30", "SPF 50", "SPF 50+ PA++++"],
    details: {
      description: "Sweat-resistant mineral sunscreen stick — no-mess, no-white-cast formula for active use.",
      purpose: "Broad-spectrum UV protection during outdoor activities. Water and sweat resistant up to 80 minutes.",
      contents: "Key ingredients: Zinc oxide 20%, titanium dioxide, vitamin C. No oxybenzone. 15g stick.",
    },
  },
  {
    id: "sk3",
    name: "Face Wipes (10pcs)",
    category: "Skincare for Athletes",
    price: 70,
    emoji: "🧻",
    image: "https://images.unsplash.com/photo-1734599895291-d25a27e4cb45?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["Cooling Aloe", "Micellar + Vitamin C", "Oil-Control Charcoal"],
    details: {
      description: "Biodegradable cleansing wipes made from plant-based fabric. Dermatologist-tested.",
      purpose: "Quickly removes sweat, sunscreen, and post-workout grime without water. Great for gym bags.",
      contents: "Plant-based non-woven fabric, micellar water, aloe vera extract. Alcohol-free. pH-balanced. 10 wipes/pack.",
    },
  },
  {
    id: "sk4",
    name: "Aloe Vera Gel",
    category: "Skincare for Athletes",
    price: 95,
    emoji: "🌿",
    image: "https://images.unsplash.com/photo-1570295835271-04c05b4ed943?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["Pure Aloe (fragrance-free)", "Aloe + Cucumber", "Aloe + Tea Tree"],
    details: {
      description: "99% pure aloe vera gel sourced from organic Philippine aloe farms. Cold-processed.",
      purpose: "Soothes sunburn, skin irritation, and post-workout skin redness. Also works as a lightweight moisturizer.",
      contents: "99% aloe vera barbadensis leaf juice, vitamin E, xanthan gum. No parabens. No alcohol. 100ml bottle.",
    },
  },
  {
    id: "sk5",
    name: "Vitamin C Serum Sachet",
    category: "Skincare for Athletes",
    price: 85,
    emoji: "✨",
    image: "https://images.unsplash.com/photo-1642162225900-8d4e658252c9?w=400&q=80",
    isLocal: true,
    isEco: false,
    variants: ["10% Vitamin C", "15% Vitamin C + Niacinamide", "20% Vitamin C + Hyaluronic Acid"],
    details: {
      description: "Brightening vitamin C serum in a travel-size sachet. Stabilized L-ascorbic acid formula.",
      purpose: "Fades UV-induced dark spots, evens skin tone, and boosts collagen production for post-sun recovery.",
      contents: "Key ingredients: L-ascorbic acid, hyaluronic acid, vitamin E, ferulic acid. Single-use 2ml sachet. Fragrance-free.",
    },
  },

  // ── Lifestyle & Comfort ─────────────────────────────────────────
  {
    id: "lc1",
    name: "Motivational Journal",
    category: "Lifestyle & Comfort",
    price: 140,
    emoji: "📓",
    image: "https://images.unsplash.com/photo-1483546416237-76fd26bbcdd1?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["Classic Kraft Cover", "Sage Green Cover", "Midnight Blue Cover"],
    details: {
      description: "A5 daily wellness journal with guided prompts designed for Filipino athletes and wellness enthusiasts.",
      purpose: "Track fitness goals, daily gratitude, mood, water intake, and workout log. Supports mental wellness.",
      contents: "120 pages, 80gsm recycled paper, lay-flat binding. Includes: daily prompts, habit tracker, goal pages.",
    },
  },
  {
    id: "lc2",
    name: "Scented Candle",
    category: "Lifestyle & Comfort",
    price: 160,
    emoji: "🕯️",
    image: "https://images.unsplash.com/photo-1661313562934-d902cb4ad0bb?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["Eucalyptus & Mint", "Lemongrass & Ginger", "Lavender & Chamomile", "Ylang-ylang & Coconut"],
    details: {
      description: "Hand-poured soy wax candle in a reusable glass jar, scented with pure essential oils.",
      purpose: "Creates a calming atmosphere for post-workout relaxation, meditation, or self-care routines.",
      contents: "100% soy wax, cotton wick, pure essential oils. 150g / 30-hour burn time. Reusable jar.",
    },
  },
  {
    id: "lc3",
    name: "Inspirational Card",
    category: "Lifestyle & Comfort",
    price: 40,
    emoji: "💌",
    image: "https://images.unsplash.com/photo-1481011784351-b0227b9f4a80?w=400&q=80",
    isLocal: true,
    isEco: false,
    variants: ["Fitness & Strength", "Self-Love & Wellness", "Filipino Affirmations"],
    details: {
      description: "Premium foil-printed greeting card with hand-lettered wellness affirmations. Designed by a Filipino artist.",
      purpose: "A daily reminder of your goals and self-worth. Perfect to pin on your gym board or give to a friend.",
      contents: "300gsm matte cardstock, gold foil accents, blank inside for personal note. A5 size with envelope.",
    },
  },
  {
    id: "lc4",
    name: "Reusable Tote Bag",
    category: "Lifestyle & Comfort",
    price: 120,
    emoji: "👜",
    image: "https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?w=400&q=80",
    isLocal: true,
    isEco: true,
    variants: ["Natural Canvas", "Sage Green", "Black with Logo"],
    details: {
      description: "Heavy-duty 100% cotton canvas tote bag with the BoxNiJuanPH wellness logo. Made in the Philippines.",
      purpose: "Eco-friendly replacement for plastic bags. Use for grocery runs, gym gear, or daily carry.",
      contents: "100% cotton canvas, reinforced handles, 38 × 42 cm, 5kg load capacity. Machine washable.",
    },
  },
  {
    id: "lc5",
    name: "Sticker Sheet",
    category: "Lifestyle & Comfort",
    price: 35,
    emoji: "⭐",
    image: "https://images.unsplash.com/photo-1778278553405-09b847a2af3e?w=400&q=80",
    isLocal: true,
    isEco: false,
    variants: ["Fitness Vibes", "Wellness & Self-Care", "Filipino Pride"],
    details: {
      description: "A5 vinyl sticker sheet with 20 original designs by Filipino illustrators. Waterproof and durable.",
      purpose: "Decorate your water bottle, journal, laptop, or gym bag. Celebrate your wellness journey.",
      contents: "20 die-cut vinyl stickers per sheet. UV-resistant, waterproof. Designed & printed in the Philippines.",
    },
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
