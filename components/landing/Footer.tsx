"use client";

import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, PhoneCall, Mail, Clock, Headphones } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#16341f] text-white pt-16 pb-10 border-t border-emerald-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative h-16 w-52 bg-white p-2 rounded-2xl shadow-sm border border-emerald-800/30 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Leafora Herbal Private Limited"
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>
            <p className="text-sm text-emerald-200/90 leading-relaxed font-medium">
              Leafora Herbal Private Limited — Healing Naturally. Time-tested Ayurvedic herbal formulations designed for natural body nourishment, vitality, and balance.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Herbal &amp; Lab-Tested</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-extrabold text-white mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80 font-medium">
              <li>
                <Link href="/" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/#about-sec" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/#products-sec" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Products (70% OFF)</span>
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dosage &amp; Routine</span>
                </Link>
              </li>
              <li>
                <Link href="/#reviews-sec" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customer Reviews</span>
                </Link>
              </li>
              <li>
                <Link href="/#faqs-sec" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FAQs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-base font-extrabold text-white mb-4 tracking-wide">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80 font-medium">
              <li>
                <Link href="/legal/privacy-policy" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/shipping-policy" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Shipping Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/refunds" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Refund &amp; Returns</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Medical Disclaimer</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/contact" className="hover:text-white transition flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact Us &amp; Grievance</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care / Support */}
          <div>
            <h4 className="text-base font-extrabold text-white mb-4 tracking-wide flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>Customer Care</span>
            </h4>
            <p className="text-xs text-emerald-200/80 mb-4 leading-relaxed">
              Have questions or need order assistance? Our herbal wellness experts are available to guide you.
            </p>

            {/* Helpline Card */}
            <div className="space-y-3">
              <a
                href="tel:+918630552164"
                className="block p-3.5 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/80 transition group shadow-sm"
              >
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-300 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Helpline &amp; Orders</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white text-emerald-900 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div>
                    <span className="block text-white font-black text-base tracking-wide leading-tight">
                      +91 8630552164
                    </span>
                    <span className="block text-[10px] text-emerald-200/70">
                      8630552164 · Click to Call
                    </span>
                  </div>
                </div>
              </a>

              <a
                href="mailto:support@leaforaherbal.com"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-200 text-xs font-semibold border border-emerald-800/60 transition"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">support@leaforaherbal.com</span>
              </a>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 text-[11px] text-emerald-300/80">
                <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Mon – Sat: 9:30 AM – 7:30 PM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-emerald-900/70 text-center text-xs text-emerald-300/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© All Copyright {currentYear} Leafora Herbal Private Limited. All Rights Reserved.</p>
          <p className="text-[11px] text-emerald-400/60">
            Results may vary from person to person. Authentic Ayurvedic formulations only on Leafora Herbal Private Limited.
          </p>
        </div>
      </div>
    </footer>
  );
}
