"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  Flame,
  Star,
  Zap,
  Activity,
} from "lucide-react";
import { Product } from "@/lib/types";
import { openShiprocketCheckout } from "@/lib/shiprocket-client";

interface ProductsSectionProps {
  initialProducts?: Product[];
}

export function ProductsSection({ initialProducts }: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  // Keep client-side state freshly synced with database
  useEffect(() => {
    fetch(`/api/products?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Failed to sync products:", err));
  }, []);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "vitality") {
      return (
        p.category_id === "cat-vitality" ||
        p.id.includes("josh") ||
        p.id.includes("time")
      );
    }
    if (selectedCategory === "diabetes") {
      return (
        p.category_id === "cat-diabetes" ||
        p.id.includes("sugar") ||
        p.id.includes("diasure")
      );
    }
    return true;
  });

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[#fbf9f5] border-b border-gray-100" id="products-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/80 border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Leafora Herbal Catalog</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
            Targeted <span className="text-gradient-green">Ayurvedic Formulations</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mt-2 font-medium">
            Discover our time-tested herbal remedies. Ethically crafted with 100% natural herbs, zero chemicals, and backed by stringent quality testing.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#0b2416] text-[#fbeea4] shadow-md ring-2 ring-emerald-800"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              All Formulations ({products.length})
            </button>
            <button
              onClick={() => setSelectedCategory("vitality")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === "vitality"
                  ? "bg-[#0b2416] text-[#fbeea4] shadow-md ring-2 ring-emerald-800"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Men&apos;s Vitality &amp; Stamina</span>
            </button>
            <button
              onClick={() => setSelectedCategory("diabetes")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === "diabetes"
                  ? "bg-[#0b2416] text-[#fbeea4] shadow-md ring-2 ring-emerald-800"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Diabetes &amp; Sugar Care</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-14">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="relative flex flex-col justify-between rounded-3xl bg-white border border-gray-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-500/60 transition-all duration-300 group overflow-hidden p-5"
            >
              {/* 70% OFF Ribbon */}
              <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-xl bg-red-600 text-white font-black text-xs shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>70% OFF</span>
              </div>

              {/* Top: Image & Badge */}
              <div>
                <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/60 p-3 mb-4 flex items-center justify-center overflow-hidden border border-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-md"
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {product.category || "Ayurvedic"}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>4.9</span>
                    <span className="text-gray-400 font-normal text-[11px]">(3.4k)</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-gray-900 group-hover:text-emerald-800 transition line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {product.tagline}
                </p>

                {product.ingredients_list && product.ingredients_list.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {product.ingredients_list.slice(0, 3).map((ing, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-700">
                        {ing.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom: Pricing & Buy Buttons */}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#0f3d23]">₹{product.price}</span>
                    <span className="text-xs text-gray-400 line-through font-bold">₹{product.original_price}</span>
                  </div>
                  <span className="text-[11px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    Save ₹{product.save_amount}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Shiprocket Checkout trigger */}
                  <button
                    type="button"
                    data-fastrr-buy
                    data-product-id={product.id}
                    data-variant-id={`${product.id}-default`}
                    data-quantity="1"
                    onClick={(e) => openShiprocketCheckout(e, product.id, 1)}
                    className="gold-shimmer-btn w-full py-3 rounded-2xl text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#fbeea4]" />
                    <span>BUY NOW · COD</span>
                  </button>

                  <Link
                    href={`/product/${product.slug || product.id}`}
                    className="w-full py-2 rounded-xl text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 text-xs font-bold text-center block transition"
                  >
                    View Formula Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dual Solutions Spotlight Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Spotlight 1: Men's Vitality */}
          <div
            id="mens-vitality"
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c2415] via-[#10361f] to-[#071a0e] text-white shadow-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-[#fbeea4] border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Men&apos;s Vitality &amp; Endurance Suite</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Power, Stamina &amp; Vigour Without Compromise
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                Featuring <strong>Josh 1000 Capsules</strong> and the <strong>Time Master Dual System</strong>. Pure Shuddha Shilajit, Ashwagandha, and Safed Musli stimulate natural micro-vascular circulation, cellular ATP production, and endurance with zero steroids.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">✓ Boosts Cellular Stamina</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">✓ Fast Topical Blood Flow</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">✓ 100% Non-Hormonal</span>
              </div>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between">
              <div>
                <span className="block text-xs text-amber-300 font-bold">Limited Time 70% Discount</span>
                <span className="text-xl font-black text-white">Starting from ₹899</span>
              </div>
              {/* Shiprocket Checkout trigger */}
              <button
                type="button"
                data-fastrr-buy
                data-product-id="prod-josh-1000"
                data-variant-id="prod-josh-1000-default"
                data-quantity="1"
                onClick={(e) => openShiprocketCheckout(e, "prod-josh-1000", 1)}
                className="px-5 py-2.5 rounded-full bg-[#d4af37] hover:bg-[#b89228] text-gray-950 font-black text-xs sm:text-sm transition shadow-md cursor-pointer"
              >
                Order Men&apos;s Kit
              </button>
            </div>
          </div>

          {/* Spotlight 2: Diabetes & Sugar Care */}
          <div
            id="sugar-care"
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#082a20] via-[#0d3f30] to-[#041712] text-white shadow-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Diabetes &amp; Glycemic Balance Suite</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Rejuvenate Beta-Cells &amp; Stabilize Glucose
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                Powered by <strong>Stop Sugar (मधुमेह विनाशक चूर्ण)</strong> and <strong>Diasure 15-Herb Powder</strong>. Gurmar, Karela, Jamun, and Vijaysar naturally stop intestine sugar absorption, reduce frequent thirst, and support healthy HbA1c levels.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">✓ Regulates Fasting &amp; Post-Meal Sugar</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">✓ Pancreatic Beta-Cell Support</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">✓ Relieves Burning Feet &amp; Fatigue</span>
              </div>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between">
              <div>
                <span className="block text-xs text-emerald-300 font-bold">Limited Time 70% Discount</span>
                <span className="text-xl font-black text-white">Starting from ₹799</span>
              </div>
              {/* Shiprocket Checkout trigger */}
              <button
                type="button"
                data-fastrr-buy
                data-product-id="prod-stop-sugar"
                data-variant-id="prod-stop-sugar-default"
                data-quantity="1"
                onClick={(e) => openShiprocketCheckout(e, "prod-stop-sugar", 1)}
                className="px-5 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs sm:text-sm transition shadow-md cursor-pointer"
              >
                Order Sugar Kit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
