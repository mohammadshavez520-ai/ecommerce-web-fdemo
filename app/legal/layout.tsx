import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PhoneCall,
  ShieldCheck,
  Award,
  Truck,
  Lock,
  FileText,
  HelpCircle,
  Mail,
  ChevronRight,
} from "lucide-react";
import { Footer } from "@/components/landing/Footer";

const POLICY_LINKS = [
  { href: "/legal/privacy-policy", label: "Privacy Policy", icon: ShieldCheck },
  { href: "/legal/terms", label: "Terms & Conditions", icon: FileText },
  { href: "/legal/shipping-policy", label: "Shipping Policy", icon: Truck },
  { href: "/legal/refunds", label: "Refund & Returns", icon: Award },
  { href: "/legal/disclaimer", label: "Medical Disclaimer", icon: HelpCircle },
  { href: "/legal/contact", label: "Contact & Grievance", icon: PhoneCall },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcfbfa] flex flex-col text-gray-900">
      {/* Top Notice Ticker */}
      <div className="w-full bg-[#0a2315] text-[#fbeea4] py-2 px-4 text-xs font-semibold tracking-wide border-b border-emerald-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <span className="flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Official Legal, Policy &amp; Compliance Portal · Leafora Herbal Private Limited</span>
          </span>
          <span className="text-emerald-300 text-[11px]">
            Toll-Free Customer Care:{" "}
            <a href="tel:+918630552164" className="text-white font-bold underline hover:text-[#fbeea4]">
              +91 8630552164
            </a>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-700 hover:text-emerald-900 bg-gray-100 hover:bg-gray-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>

            <a
              href="tel:+918630552164"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#16341f] hover:bg-[#0c2415] transition shadow-sm group"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">+91 8630552164</span>
              <span className="sm:hidden">Call Support</span>
            </a>
          </div>
        </div>

        {/* Policy Navigation Tabs */}
        <div className="border-t border-gray-100 bg-[#f9faf7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold text-gray-600">
              {POLICY_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap hover:text-emerald-900 hover:bg-white transition border border-transparent hover:border-gray-200/80 shadow-2xs hover:shadow-xs"
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Trust Badges Bar */}
      <section className="bg-emerald-50/70 border-b border-emerald-100/90 py-3 text-xs text-emerald-950 font-semibold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>100% Lab-Tested Purity</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Award className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>100% Authentic Classical Ayurveda</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Free Pan-India Cash On Delivery</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>256-Bit SSL Encrypted Security</span>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}

        {/* Global Legal Page Help Callout */}
        <section className="mt-12 rounded-3xl bg-gradient-to-br from-[#0c2415] via-[#123922] to-[#07190e] text-white p-6 sm:p-10 shadow-xl border border-emerald-900 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-700/60 inline-block">
                Dedicated Support &amp; Grievance Redressal
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Need Help with Policies or Orders?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                Our support team is committed to 100% transparency. For order tracking, cancellation requests, or policy clarifications, please contact our helpline directly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a
                href="tel:+918630552164"
                className="py-3 px-6 rounded-2xl bg-[#34d399] hover:bg-[#10b981] text-emerald-950 font-black text-sm text-center shadow-md transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-950" />
                <span>Call Helpline: +91 8630552164</span>
              </a>
              <a
                href="mailto:support@leaforaherbal.com"
                className="py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm text-center border border-emerald-400/30 transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-emerald-300" />
                <span>support@leaforaherbal.com</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
