import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  FileText,
  Truck,
  Award,
  HelpCircle,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  Mail,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Legal & Policies | Leafora Herbal Private Limited",
  description:
    "Official policies, terms, shipping guidelines, returns, and compliance information of Leafora Herbal Private Limited.",
};

const POLICIES = [
  {
    title: "Privacy Policy",
    href: "/legal/privacy-policy",
    description:
      "Details how Leafora Herbal Private Limited collects, safeguards, and processes your personal information in strict compliance with the IT Act 2000 and DPDP Act 2023.",
    icon: ShieldCheck,
    tag: "Updated Oct 2026",
  },
  {
    title: "Terms & Conditions",
    href: "/legal/terms",
    description:
      "The terms and conditions governing the use of our website, purchase of authentic Ayurvedic formulations, pricing, discounts, and customer agreements.",
    icon: FileText,
    tag: "Governing Terms",
  },
  {
    title: "Shipping & Delivery Policy",
    href: "/legal/shipping-policy",
    description:
      "Information on 100% Free Express Pan-India Delivery, Cash on Delivery (COD) service, courier partners (BlueDart, Delhivery), and 3-5 day transit timelines.",
    icon: Truck,
    tag: "Free Pan-India Delivery",
  },
  {
    title: "Refund, Return & Cancellation",
    href: "/legal/refunds",
    description:
      "Clear rules for order cancellations before dispatch, 7-day transit damage replacement, hygienic safety guidelines, and 5-7 day refund processing.",
    icon: Award,
    tag: "7-Day Replacement",
  },
  {
    title: "Medical & Health Disclaimer",
    href: "/legal/disclaimer",
    description:
      "Important health statements regarding our authentic Ayurvedic proprietary formulations, quality standards, usage consistency, and consultation guidance.",
    icon: HelpCircle,
    tag: "Health & Safety",
  },
  {
    title: "Contact & Grievance Redressal",
    href: "/legal/contact",
    description:
      "Official contact details for customer care, order assistance, operational hours, and designated Grievance Officer information with telephone support.",
    icon: PhoneCall,
    tag: "Call: 8630552164",
  },
];

export default function LegalIndexPage() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300">
          <Building className="w-3.5 h-3.5 text-emerald-800" />
          <span>Leafora Herbal Private Limited</span>
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          Legal, Compliance &amp; Policies
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Welcome to the official legal hub of <strong>Leafora Herbal Private Limited</strong>. We operate with complete regulatory adherence, ethical commerce principles, and 100% customer protection.
        </p>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POLICIES.map((policy) => {
          const Icon = policy.icon;
          return (
            <Link
              key={policy.href}
              href={policy.href}
              className="group p-6 rounded-3xl bg-white border border-gray-200/90 hover:border-emerald-600/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-[#16341f] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100/70 text-emerald-900">
                    {policy.tag}
                  </span>
                </div>

                <h2 className="text-lg font-black text-gray-900 group-hover:text-emerald-800 transition-colors mb-2">
                  {policy.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {policy.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold text-emerald-800 group-hover:text-emerald-900">
                <span>Read Full Policy</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Corporate Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Entity Information &amp; Contact Direct</span>
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          All commercial transactions, customer service engagements, and brand packaging are officially licensed and operated under <strong>Leafora Herbal Private Limited</strong>. For quick resolution regarding any policy question or ongoing order, contact our central helpline.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80">
            <span className="block font-bold text-gray-500 uppercase tracking-wider text-[10px]">Company Name</span>
            <span className="block font-black text-gray-900 text-sm mt-0.5">Leafora Herbal Private Limited</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80">
            <span className="block font-bold text-gray-500 uppercase tracking-wider text-[10px]">Toll-Free Helpline</span>
            <a href="tel:+918630552164" className="block font-black text-emerald-800 text-sm mt-0.5 hover:underline">
              +91 8630552164
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80">
            <span className="block font-bold text-gray-500 uppercase tracking-wider text-[10px]">Official Support Email</span>
            <a href="mailto:support@leaforaherbal.com" className="block font-black text-emerald-800 text-sm mt-0.5 hover:underline">
              support@leaforaherbal.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
