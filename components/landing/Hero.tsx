"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Truck,
  Sparkles,
  Leaf,
  CheckCircle2,
  ArrowRight,
  Flame,
  Star,
  Zap,
  Activity,
  Heart
} from "lucide-react";

const HERO_PRODUCTS = [
  {
    id: "prod-josh-1000",
    name: "Josh 1000 Capsule",
    tagline: "Triple-Action Stamina, Energy & Male Vigour",
    category: "Men's Vitality",
    badge: "🔥 70% OFF · Best Seller",
    price: 899,
    originalPrice: 2999,
    image: "/products/josh-1000.jpg",
    highlights: ["Shilajit & Ashwagandha", "Boosts Physical Stamina", "Non-Hormonal & 100% Herbal"],
    color: "from-amber-500/20 to-emerald-900/10",
  },
  {
    id: "prod-stop-sugar",
    name: "Stop Sugar Powder",
    tagline: "मधुमेह विनाशक चूर्ण · Natural Blood Sugar Regulator",
    category: "Sugar & Diabetes",
    badge: "🌿 70% OFF · Clinical Herbs",
    price: 799,
    originalPrice: 2699,
    image: "/products/stop-sugar.jpg",
    highlights: ["Gurmar & Jamun Seed", "Pancreatic Beta-Cell Support", "Prevents Post-Meal Spikes"],
    color: "from-emerald-500/20 to-teal-900/10",
  },
  {
    id: "prod-time-master",
    name: "Time Master Combo",
    tagline: "80ml Topical Massage Oil + 60 Vitality Capsules",
    category: "Complete Regimen",
    badge: "👑 70% OFF · Dual System",
    price: 1499,
    originalPrice: 4999,
    image: "/products/time-master-combo.jpg",
    highlights: ["Instant Topical Effect", "Deep Micro-Circulation", "Enduring Stamina & Strength"],
    color: "from-orange-500/20 to-stone-900/10",
  },
  {
    id: "prod-diasure-powder",
    name: "Diasure Herb Powder",
    tagline: "15 Potent Ayurvedic Herbs for Managing Glucose (200g)",
    category: "Metabolic Wellness",
    badge: "⭐ 70% OFF · 15 Herb Synergy",
    price: 899,
    originalPrice: 2999,
    image: "/products/diasure-powder.jpg",
    highlights: ["Neem, Karela & Vijaysar", "Relieves Diabetic Fatigue", "Protects Vital Organs"],
    color: "from-blue-500/20 to-emerald-900/10",
  },
];

export function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProduct = HERO_PRODUCTS[activeIdx];

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#f5f8f5] via-[#fafbf9] to-white overflow-hidden border-b border-gray-100">
      {/* Subtle decorative golden-emerald background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>Leafora Herbal Private Limited</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            <span>Flat 70% Off Today</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>100% Pure Botanical Extracts</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0c2415] tracking-tight leading-[1.12]">
            Pure Ayurvedic Formulations.
            <br />
            <span className="text-gradient-gold">Healing Naturally.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mt-4 leading-relaxed font-medium">
            Certified Ayurvedic solutions formulated with pure standardized botanicals. Targeted solutions for{" "}
            <strong className="text-emerald-950 font-bold">Men&apos;s Stamina &amp; Vitality</strong> and{" "}
            <strong className="text-emerald-950 font-bold">Natural Diabetes &amp; Sugar Balance</strong>.
          </p>
        </div>

        {/* Interactive Hero Product Showcase Card */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-white border border-gray-200/90 shadow-xl overflow-hidden">
          {/* Product Switcher Tabs */}
          <div className="bg-[#0b2416] p-2.5 sm:p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-emerald-950">
            {HERO_PRODUCTS.map((prod, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={prod.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3 py-2.5 rounded-2xl text-left transition-all duration-200 flex flex-col cursor-pointer ${
                    isActive
                      ? "bg-white text-gray-900 shadow-md ring-2 ring-[#d4af37]"
                      : "bg-white/10 text-emerald-100/80 hover:bg-white/15"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    {prod.category}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold truncate">
                    {prod.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Product Feature Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-10 items-center">
            {/* Left: Product Image with Floating Discount Badges */}
            <div className="md:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[340px] aspect-square rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/70 p-4 border border-gray-200/70 shadow-inner flex items-center justify-center group">
                {/* 70% OFF Corner Badge */}
                <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs tracking-wider shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>70% OFF</span>
                </div>

                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-xl bg-emerald-900/80 backdrop-blur-md text-emerald-200 font-bold text-[10px]">
                  100% Lab Tested
                </div>

                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right: Product Highlights & Quick Purchase CTA */}
            <div className="md:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{activeProduct.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {activeProduct.name}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 font-medium">
                {activeProduct.tagline}
              </p>

              {/* Price Banner */}
              <div className="flex flex-wrap items-baseline gap-3 p-3.5 rounded-2xl bg-[#faf8f4] border border-amber-200/80">
                <span className="text-3xl font-black text-[#0f3d23]">
                  ₹{activeProduct.price}
                </span>
                <span className="text-base text-gray-400 line-through font-bold">
                  ₹{activeProduct.originalPrice}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-extrabold text-xs">
                  Save ₹{activeProduct.originalPrice - activeProduct.price} (70% OFF)
                </span>
              </div>

              {/* Checklist Highlights */}
              <div className="space-y-2 pt-1">
                {activeProduct.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  data-fastrr-buy
                  data-product-id={activeProduct.id}
                  data-variant-id={`${activeProduct.id}-default`}
                  data-quantity="1"
                  className="gold-shimmer-btn flex-1 py-3.5 px-6 rounded-2xl text-white font-black text-sm text-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ORDER NOW · CASH ON DELIVERY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href={`/products/${activeProduct.id}`}
                  className="py-3.5 px-5 rounded-2xl border-2 border-emerald-900 text-emerald-950 font-bold text-xs sm:text-sm text-center hover:bg-emerald-50 transition flex items-center justify-center gap-1.5"
                >
                  <span>Formula Details</span>
                </Link>
              </div>

              {/* Guarantees */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-bold text-gray-500">
                <span className="flex items-center gap-1 text-emerald-800">
                  <Truck className="w-3.5 h-3.5" /> Free Express Shipping
                </span>
                <span className="flex items-center gap-1 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Ayurvedic · No Chemicals
                </span>
                <span className="flex items-center gap-1 text-emerald-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9/5 Rating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Value Pillars below Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mt-8">
          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs text-left flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-gray-900">100% Ayurvedic</h4>
              <p className="text-[11px] text-gray-500">Pure potent herbs, zero steroids or synthetics</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs text-left flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-gray-900">Flat 70% Discount</h4>
              <p className="text-[11px] text-gray-500">Direct factory price for all customers</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs text-left flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-gray-900">Lab-Tested Purity</h4>
              <p className="text-[11px] text-gray-500">Rigorous laboratory quality standards</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs text-left flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-gray-900">Cash On Delivery</h4>
              <p className="text-[11px] text-gray-500">Pay only when order reaches your doorstep</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
