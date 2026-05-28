import Link from "next/link";
import Image from "next/image";
import { PLANS, CSR_COMMITMENTS, PRODUCTS } from "@/lib/data";

export default function Home() {
  const featuredProducts = PRODUCTS.filter((p) => p.isLocal).slice(0, 4);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80"
            alt="Fitness and wellness lifestyle"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Dark gradient overlay for text contrast — WCAG AA */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="max-w-2xl">
            <span className="inline-block bg-[#0D9488] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              🇵🇭 Filipino Wellness · Est. 2026
            </span>
            <h1 className="font-[var(--font-dm-sans)] text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
              Your Personal<br />
              <span className="text-[#84CC16]">Wellness Box</span><br />
              Every Month
            </h1>
            <p className="text-gray-200 text-lg mb-8 max-w-lg leading-relaxed">
              Build your own box — choose from recovery gear, healthy snacks, skincare, and lifestyle products. All curated from Filipino local brands.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/plans">
                <button className="bg-[#84CC16] hover:bg-[#0D9488] text-white px-8 py-4 rounded-full text-base font-bold transition-colors shadow-lg min-h-[52px]">
                  Build Your Box →
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full text-base font-semibold transition-colors min-h-[52px] backdrop-blur-sm">
                  How It Works
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: "🔒", text: "Secure checkout" },
                { icon: "🚚", text: "Free Metro Manila delivery" },
                { icon: "↩️", text: "Cancel anytime" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-gray-300 text-sm">
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section className="bg-[#84CC16] text-white py-6 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "20+", label: "Wellness Products" },
            { value: "3", label: "Flexible Plans" },
            { value: "100%", label: "Filipino Brands" },
            { value: "UN SDG 12", label: "Aligned" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-[var(--font-dm-sans)] text-2xl font-extrabold">{s.value}</p>
              <p className="text-green-200 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#0D9488] font-bold text-sm uppercase tracking-widest">Simple Process</span>
            <h2 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#1C1917] mt-2">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { step: "1", icon: "📋", title: "Choose Your Plan", desc: "Pick Basic, Standard, or Premium based on how many items you want.", color: "bg-[#84CC16]" },
              { step: "2", icon: "🛍️", title: "Build Your Box", desc: "Browse our wellness catalog and pick exactly the products you love.", color: "bg-[#0D9488]" },
              { step: "3", icon: "✅", title: "Review & Checkout", desc: "Review your picks, sign in, enter your details, and place your order.", color: "bg-[#84CC16]" },
              { step: "4", icon: "📦", title: "Receive Your Box", desc: "Your personalized wellness box arrives at your door every month.", color: "bg-[#0D9488]" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-md`}>
                  {item.step}
                </div>
                <div className="text-3xl">{item.icon}</div>
                <h3 className="font-[var(--font-dm-sans)] font-bold text-[#1C1917]">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Wellness Video Section ───────────────────────────── */}
      <section className="bg-[#F7FEE7] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#84CC16] font-bold text-sm uppercase tracking-widest">See It In Action</span>
            <h2 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#1C1917] mt-2">Built for Active Filipinos</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Every item in your box is chosen by you — from local recovery gear to healthy snacks that fuel your lifestyle.
            </p>
          </div>
          {/* YouTube privacy-enhanced embed — no cookies unless user interacts */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube-nocookie.com/embed/UItWltVZZmE?autoplay=1&mute=1&loop=1&playlist=UItWltVZZmE&controls=1&rel=0&modestbranding=1"
              title="BoxNiJuanPH — Filipino Wellness Lifestyle"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Video embedded via YouTube Privacy-Enhanced Mode — no cookies set until you interact. <Link href="/privacy" className="underline hover:text-[#84CC16]">Privacy Policy</Link>
          </p>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#0D9488] font-bold text-sm uppercase tracking-widest">Local Picks</span>
            <h2 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#1C1917] mt-2">Featured Products</h2>
            <p className="text-gray-500 mt-2 text-sm">Locally sourced Filipino wellness products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="relative h-44 bg-gray-50 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-[#1C1917] mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                  <div className="flex gap-1 flex-wrap">
                    {product.isLocal && (
                      <span className="text-xs bg-[#84CC16] text-white px-2 py-0.5 rounded-full">🇵🇭 Local</span>
                    )}
                    {product.isEco && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">♻️ Eco</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/plans">
              <button className="bg-[#84CC16] hover:bg-[#0D9488] text-white px-8 py-3 rounded-full font-bold transition-colors min-h-[48px]">
                Browse All Products →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Plans Preview ────────────────────────────────────── */}
      <section className="bg-[#1C1917] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#84CC16] font-bold text-sm uppercase tracking-widest">Flexible Pricing</span>
            <h2 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-white mt-2">Plans for Every Lifestyle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.id} className="relative rounded-2xl overflow-hidden group">
                <div className="relative h-48">
                  <Image src={plan.image} alt={`${plan.name} plan`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  {plan.badge && (
                    <span className="absolute top-3 right-3 bg-[#0D9488] text-white text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</span>
                  )}
                </div>
                <div className="bg-[#1F2937] p-5">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-[var(--font-dm-sans)] font-bold text-white text-lg">{plan.name}</h3>
                    <span className="font-extrabold text-[#84CC16] text-xl">₱{plan.price}<span className="text-sm font-normal text-gray-400">/mo</span></span>
                  </div>
                  <p className="text-gray-400 text-xs mb-3">{plan.items} items · {plan.description}</p>
                  <Link href="/plans">
                    <button className="w-full bg-[#84CC16] hover:bg-[#0D9488] text-white py-2.5 rounded-full text-sm font-bold transition-colors min-h-[44px]">
                      Choose {plan.name}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CSR Section ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#84CC16] font-bold text-sm uppercase tracking-widest">Our Commitment</span>
            <h2 className="font-[var(--font-dm-sans)] text-4xl font-extrabold text-[#1C1917] mt-2">CSR &amp; Sustainability</h2>
            <p className="text-gray-500 mt-2 text-sm">Aligned with UN SDG 12: Responsible Consumption and Production</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CSR_COMMITMENTS.map((item, i) => (
              <div key={i} className="bg-[#F7FEE7] border border-green-100 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-[var(--font-dm-sans)] font-bold text-[#1C1917] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80"
            alt="Active lifestyle"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-[#84CC16]/85" />
        </div>
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto">
          <h2 className="font-[var(--font-dm-sans)] text-4xl font-extrabold mb-3">Ready to build your box?</h2>
          <p className="mb-8 text-green-100 text-lg">Plans start at ₱399/month. Free delivery within Metro Manila. Cancel anytime.</p>
          <Link href="/plans">
            <button className="bg-white text-[#84CC16] hover:bg-green-50 px-10 py-4 rounded-full font-extrabold text-base transition-colors shadow-xl min-h-[52px]">
              Get Started Today →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
