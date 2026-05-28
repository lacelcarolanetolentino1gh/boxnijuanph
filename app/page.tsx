import Link from "next/link";
import { PLANS, CSR_COMMITMENTS, PRODUCTS } from "@/lib/data";

export default function Home() {
  const featuredProducts = PRODUCTS.filter((p) => p.isLocal).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#F5EFE6] py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#7D9B76] font-semibold text-sm uppercase tracking-widest mb-3">Wellness. Personalized. Filipino.</p>
          <h1 className="font-[var(--font-dm-sans)] text-5xl font-bold text-[#2D2D2D] leading-tight mb-4">
            The Wellness Box<br />for Every <span className="text-[#7D9B76]">Juan</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            Build your own personalized wellness subscription box every month. You choose exactly what goes in — no surprises, no waste.
          </p>
          <Link href="/plans">
            <button className="bg-[#7D9B76] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#5e7a58] transition-colors shadow-md">
              Build Your Box →
            </button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="font-[var(--font-dm-sans)] text-3xl font-bold text-center mb-12 text-[#2D2D2D]">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { step: "1", icon: "📋", title: "Choose Your Plan", desc: "Pick Basic, Standard, or Premium based on how many items you want." },
            { step: "2", icon: "🛍️", title: "Build Your Box", desc: "Browse our wellness catalog and select exactly the products you want." },
            { step: "3", icon: "✅", title: "Review & Checkout", desc: "Review your selections, enter your details, and place your order." },
            { step: "4", icon: "📦", title: "Receive Your Box", desc: "Your personalized wellness box is delivered to your door monthly." },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#7D9B76] text-white rounded-full flex items-center justify-center font-bold text-lg">
                {item.step}
              </div>
              <div className="text-3xl">{item.icon}</div>
              <h3 className="font-[var(--font-dm-sans)] font-semibold text-[#2D2D2D]">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#F5EFE6] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[var(--font-dm-sans)] text-3xl font-bold text-center mb-2 text-[#2D2D2D]">Featured Products</h2>
          <p className="text-center text-gray-500 mb-10 text-sm">Locally sourced Filipino wellness products</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className="text-4xl mb-3">{product.emoji}</div>
                <h3 className="font-semibold text-sm text-[#2D2D2D] mb-1">{product.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                <div className="flex gap-1 justify-center flex-wrap">
                  {product.isLocal && (
                    <span className="text-xs bg-[#7D9B76] text-white px-2 py-0.5 rounded-full">🇵🇭 Filipino Brand</span>
                  )}
                  {product.isEco && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">♻️ Eco-Friendly</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/plans">
              <button className="border border-[#7D9B76] text-[#7D9B76] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#7D9B76] hover:text-white transition-colors">
                See All Products →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CSR Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="font-[var(--font-dm-sans)] text-3xl font-bold text-center mb-2 text-[#2D2D2D]">Our CSR Commitment</h2>
        <p className="text-center text-gray-500 mb-10 text-sm">Aligned with UN SDG 12: Responsible Consumption and Production</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CSR_COMMITMENTS.map((item, i) => (
            <div key={i} className="bg-[#F5EFE6] rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-[var(--font-dm-sans)] font-semibold text-[#2D2D2D] mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#7D9B76] py-16 px-6 text-center text-white">
        <h2 className="font-[var(--font-dm-sans)] text-3xl font-bold mb-3">Ready to build your box?</h2>
        <p className="mb-6 text-green-100">Plans start at ₱399/month. Cancel anytime.</p>
        <Link href="/plans">
          <button className="bg-white text-[#7D9B76] px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors shadow-md">
            Get Started →
          </button>
        </Link>
      </section>
    </div>
  );
}
