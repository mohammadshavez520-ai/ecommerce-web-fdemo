"use client";

import React from "react";
import { Users, Star, ShieldCheck, Sparkles, Award, Leaf, CheckCircle2, HeartPulse } from "lucide-react";

export function About() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white border-b border-gray-100" id="about-sec">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Label */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/80 border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>About Leafora Herbal Private Limited</span>
        </span>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
          Classical Ayurveda, <span className="text-gradient-green">Standardized for Modern Life</span>
        </h2>

        {/* Intro */}
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-3 leading-relaxed font-normal">
          <strong>Leafora Herbal Private Limited</strong> was founded with a singular commitment: restoring authentic ancient Ayurvedic healing through scientifically validated, concentrated botanicals. We engineer targeted natural therapies for <strong>Men&apos;s Vitality &amp; Stamina</strong> and <strong>Blood Sugar &amp; Pancreatic Balance</strong>, completely free from chemicals, steroids, or artificial additives.
        </p>

        {/* 4 Brand Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 text-left">
          <div className="p-5 rounded-2xl bg-[#faf9f5] border border-gray-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Leaf className="w-5 h-5 text-emerald-700" />
            </div>
            <h4 className="text-sm font-black text-gray-900">100% Pure Herbs</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Ethically wild-harvested botanicals with active withanolides, fulvic acid, and charantin extracts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf9f5] border border-gray-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-amber-700" />
            </div>
            <h4 className="text-sm font-black text-gray-900">Lab-Tested Purity</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Standardized botanical extracts independently tested for purity, optimal potency, and strict quality control.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf9f5] border border-gray-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-red-700" />
            </div>
            <h4 className="text-sm font-black text-gray-900">Zero Side Effects</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Free from steroids, heavy metals, harmful sildenafil or synthetic hormones. Non-habit forming formulas.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf9f5] border border-gray-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
              <HeartPulse className="w-5 h-5 text-blue-700" />
            </div>
            <h4 className="text-sm font-black text-gray-900">Deep Bio-Absorption</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Synergistic multi-herb formulation engineered for smooth bodily digestion, cellular vitality, and daily stamina.
            </p>
          </div>
        </div>

        {/* Hindi Highlight Banner with Real Numbers */}
        <div className="mt-10 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0a2315] via-[#0e331e] to-[#06180e] text-white shadow-xl relative overflow-hidden text-center">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#fbeea4] mb-3 tracking-wide">
            Leafora Herbal — प्रकृति का शुद्ध, सुरक्षित और प्रभावी उपचार
          </h3>

          <p className="text-xs sm:text-sm text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            <strong className="text-white font-bold">Leafora Herbal Private Limited</strong> के सभी उत्पाद प्राचीन आयुर्वेदिक ग्रंथों और आधुनिक वैज्ञानिक परीक्षणों के संगम से बनाए जाते हैं। हमारे उत्पाद पुरुषों की खोई हुई ऊर्जा, स्टैमिना, और शुगर के स्तर को प्राकृतिक रूप से नियंत्रित करने में पूर्णतः सक्षम हैं।
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-800/60 max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              <Users className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-2xl sm:text-3xl font-black text-white">50,000+</span>
              <span className="text-xs font-bold text-emerald-300 mt-0.5">Satisfied Users</span>
            </div>
            <div className="flex flex-col items-center border-x border-emerald-800/60">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 mb-1" />
              <span className="text-2xl sm:text-3xl font-black text-amber-400">4.9 / 5.0</span>
              <span className="text-xs font-bold text-emerald-300 mt-0.5">Customer Rating</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">100%</span>
              <span className="text-xs font-bold text-emerald-300 mt-0.5">Pure &amp; Natural</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
