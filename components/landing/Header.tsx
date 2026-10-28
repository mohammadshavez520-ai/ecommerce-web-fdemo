"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ShoppingBag,
  ShieldCheck,
  PhoneCall,
  Leaf,
  Truck,
  CreditCard,
  Sparkles,
  Flame,
  ArrowRight
} from "lucide-react";

export function Header({ onOpenCheckout }: { onOpenCheckout?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full z-40 bg-white">
      {/* Top Announcement Ticker */}
      <div className="w-full bg-[#0a2315] text-white py-2 overflow-hidden border-b border-emerald-900/50 text-xs sm:text-sm font-medium tracking-wide">
        <div className="animate-ticker flex items-center space-x-10 whitespace-nowrap">
          <span className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            100% Authentic Classical Ayurveda
          </span>
          <span className="flex items-center gap-2 font-bold text-[#fbeea4]">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            FLAT 70% OFF INAUGURAL SALE
          </span>
          <span className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Free Cash On Delivery (COD) All Over India
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 100% Pure Herbal Extracts · Lab Tested
          </span>
          <span className="flex items-center gap-2 font-semibold text-emerald-300">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Extra ₹400 OFF on Prepaid Orders
          </span>

          {/* Loop duplicate */}
          <span className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            100% Authentic Classical Ayurveda
          </span>
          <span className="flex items-center gap-2 font-bold text-[#fbeea4]">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            FLAT 70% OFF INAUGURAL SALE
          </span>
          <span className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Free Cash On Delivery (COD) All Over India
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 100% Pure Herbal Extracts · Lab Tested
          </span>
          <span className="flex items-center gap-2 font-semibold text-emerald-300">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Extra ₹400 OFF on Prepaid Orders
          </span>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with Leafora Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-14 w-48 sm:h-16 sm:w-56 flex items-center">
              <img
                src="/logo.png"
                alt="Leafora Herbal Private Limited"
                className="h-full w-full object-contain object-left group-hover:scale-[1.02] transition-transform duration-200"
              />
              <span className="sr-only">Leafora Herbal Private Limited</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-[13px] font-bold text-gray-700 tracking-wide">
            <Link href="/#products-sec" className="hover:text-emerald-700 transition flex items-center gap-1">
              <span>All Products</span>
              <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black">70% OFF</span>
            </Link>
            <Link href="/#mens-vitality" className="hover:text-emerald-700 transition">
              Men&apos;s Vitality
            </Link>
            <Link href="/#sugar-care" className="hover:text-emerald-700 transition">
              Sugar &amp; Diabetes Care
            </Link>
            <Link href="/#ingredients" className="hover:text-emerald-700 transition">
              15 Super Herbs
            </Link>
            <Link href="/#how-it-works" className="hover:text-emerald-700 transition">
              How To Use
            </Link>
            <Link href="/#reviews-sec" className="hover:text-emerald-700 transition">
              Reviews
            </Link>
            <Link href="/#faqs-sec" className="hover:text-emerald-700 transition">
              FAQs
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+918630552164"
              className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-emerald-800 transition px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50/70"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>+91 8630552164</span>
            </a>

            <Link
              href="/#products-sec"
              className="gold-shimmer-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#fbeea4]" />
              <span>ORDER NOW</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/#products-sec"
              className="p-2 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>70% OFF</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-5 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between">
              <span>🎉 Inaugural Offer Active</span>
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px]">70% OFF</span>
            </div>

            <Link
              href="/#products-sec"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-900 hover:text-emerald-700 border-b border-gray-100"
            >
              All Formulations
            </Link>
            <Link
              href="/#mens-vitality"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-900 hover:text-emerald-700 border-b border-gray-100"
            >
              ⚡ Men&apos;s Vitality (Josh 1000 &amp; Time Master)
            </Link>
            <Link
              href="/#sugar-care"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-900 hover:text-emerald-700 border-b border-gray-100"
            >
              🩸 Diabetes &amp; Sugar Care (Stop Sugar &amp; Diasure)
            </Link>
            <Link
              href="/#about-sec"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-900 hover:text-emerald-700 border-b border-gray-100"
            >
              About Leafora Herbal Private Limited
            </Link>
            <Link
              href="/#ingredients"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-900 hover:text-emerald-700 border-b border-gray-100"
            >
              15 Super Herbs &amp; Extracts
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-900 hover:text-emerald-700 border-b border-gray-100"
            >
              Dosage &amp; How To Use
            </Link>
            <Link
              href="/#reviews-sec"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-900 hover:text-emerald-700 border-b border-gray-100"
            >
              Customer Reviews
            </Link>
            <Link
              href="/#faqs-sec"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-900 hover:text-emerald-700 border-b border-gray-100"
            >
              Frequently Asked Questions
            </Link>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:+918630552164"
                className="w-full py-3 rounded-xl bg-gray-100 text-gray-900 font-extrabold text-xs text-center flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>Call Helpline: +91 8630552164</span>
              </a>
              <Link
                href="/#products-sec"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-[#0a2315] text-[#fbeea4] font-extrabold text-sm text-center shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>SHOP WITH 70% DISCOUNT</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
