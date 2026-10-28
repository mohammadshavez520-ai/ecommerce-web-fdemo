"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Sun,
  Moon,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white border-b border-gray-100" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/80 border border-emerald-300">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Daily Regimen Protocol</span>
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
            How To Take <span className="text-gradient-green">Leafora Formulations</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mt-2 font-medium">
            An effortless daily routine designed for optimal herbal bioavailability and fast absorption.
          </p>
        </div>

        {/* 3 Step Protocol Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {/* Step 1: Morning Routine */}
          <div className="rounded-3xl p-7 bg-[#faf9f5] border border-gray-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
                <Sun className="w-6 h-6 text-amber-600" />
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-amber-700">
                Phase 1 · Morning
              </span>

              <h3 className="text-xl font-black text-gray-900 mt-1 mb-3">
                Pre-Breakfast Activation
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                <div className="p-3 rounded-xl bg-white border border-gray-200">
                  <strong className="block text-emerald-900 font-bold mb-0.5">
                    🩸 Stop Sugar / Diasure Powder:
                  </strong>
                  Mix 1 level scoop (3-5g) with a glass of lukewarm water 30 minutes before breakfast. Prepares pancreatic receptors.
                </div>

                <div className="p-3 rounded-xl bg-white border border-gray-200">
                  <strong className="block text-amber-900 font-bold mb-0.5">
                    ⚡ Josh 1000 / Time Master Capsule:
                  </strong>
                  Take 1 capsule 30 minutes after breakfast with warm milk or water for all-day physical stamina.
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-200 flex items-center gap-2 text-xs font-bold text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Easy 2-minute daily habit</span>
            </div>
          </div>

          {/* Step 2: Evening / Night Routine */}
          <div className="rounded-3xl p-7 bg-[#faf9f5] border border-gray-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-5">
                <Moon className="w-6 h-6 text-indigo-600" />
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-indigo-700">
                Phase 2 · Evening &amp; Night
              </span>

              <h3 className="text-xl font-black text-gray-900 mt-1 mb-3">
                Night Cellular Rejuvenation
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                <div className="p-3 rounded-xl bg-white border border-gray-200">
                  <strong className="block text-emerald-900 font-bold mb-0.5">
                    🩸 Pre-Dinner Powder Dose:
                  </strong>
                  Take second scoop of Stop Sugar or Diasure Powder before dinner to prevent post-meal sugar spikes and nighttime frequent urination.
                </div>

                <div className="p-3 rounded-xl bg-white border border-gray-200">
                  <strong className="block text-amber-900 font-bold mb-0.5">
                    👑 Time Master Topical Oil:
                  </strong>
                  Gently massage 5 to 7 drops of herbal oil on the local area once daily before bedtime. Stimulates micro-vascular circulation.
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-200 flex items-center gap-2 text-xs font-bold text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Overnight tissue regeneration</span>
            </div>
          </div>

          {/* Step 3: 60-90 Day Transformation Timeline */}
          <div className="rounded-3xl p-7 bg-gradient-to-br from-[#0c2415] via-[#10361f] to-[#07190e] text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center mb-5">
                <CalendarCheck className="w-6 h-6 text-emerald-300" />
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                Phase 3 · Cumulative Results
              </span>

              <h3 className="text-xl font-black text-white mt-1 mb-3">
                60-90 Day Transformation
              </h3>

              <ul className="space-y-3 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    <strong>Days 1–15:</strong> Initial reduction in fatigue, improved stamina, and balanced digestion.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    <strong>Days 16–45:</strong> Stabilized fasting glucose, active blood warmth, and strong endurance.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    <strong>Days 46–90:</strong> Optimal HbA1c control, peak physical confidence, and deep cellular vitality.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 mt-6 border-t border-emerald-800 flex items-center gap-2 text-xs font-bold text-amber-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Non-Habit Forming &amp; Safe</span>
            </div>
          </div>
        </div>

        {/* Free Herbal Wellness Consultation Box */}
        <div className="rounded-3xl bg-[#faf8f4] border border-amber-300/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Free Herbal Consultation
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-gray-900">
              Need Personalized Dosage Advice?
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Our verified Ayurvedic practitioners are available 6 days a week to review your health goals and recommend the exact dosage plan for your body constitution (Prakriti).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="tel:+918630552164"
              className="py-3 px-6 rounded-2xl bg-[#0c2415] hover:bg-[#06170d] text-[#fbeea4] font-black text-xs sm:text-sm text-center shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Call Helpline: +91 8630552164</span>
            </a>
            <Link
              href="/#products-sec"
              className="py-3 px-6 rounded-2xl bg-[#d4af37] hover:bg-[#b89228] text-gray-950 font-black text-xs sm:text-sm text-center shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>Explore Products (70% OFF)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
