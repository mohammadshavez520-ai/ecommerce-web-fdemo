import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Award,
  ShieldCheck,
  PhoneCall,
  Clock,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Mail,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Return Policy | Leafora Herbal Private Limited",
  description:
    "Official Return, Replacement, and Refund Policy of Leafora Herbal Private Limited. 7-day transit replacement guarantee and transparent refund process.",
};

export default function RefundsPage() {
  const lastUpdated = "27 October 2026";

  return (
    <article className="space-y-8 bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-200 shadow-xs text-gray-800">
      {/* Policy Heading */}
      <div className="border-b border-gray-200 pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
            <span>100% Customer Protection</span>
          </span>
          <span className="text-xs font-semibold text-gray-500">
            Last Updated: {lastUpdated}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Refund &amp; Return Policy
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          At <strong>Leafora Herbal Private Limited</strong>, customer trust and wellness satisfaction are our core priorities. We operate with complete fairness and transparent policies. If you receive a damaged package or wish to cancel an order, please review the simple guidelines below or call our customer care at <strong>+91 8630552164</strong>.
        </p>
      </div>

      {/* Fast Help Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-emerald-900 font-bold mb-0.5">
              7-Day Transit Damage &amp; Defect Replacement Guarantee
            </strong>
            <span>
              If your package arrives physically damaged, tampered with, or contains an incorrect formulation, we will dispatch an expedited replacement at zero extra cost within 24 hours.
            </span>
          </div>
        </div>
        <a
          href="tel:+918630552164"
          className="shrink-0 py-2 px-4 rounded-xl bg-[#16341f] text-[#fbeea4] font-extrabold text-xs flex items-center gap-2 shadow-xs hover:bg-[#0e2214] transition"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call: +91 8630552164</span>
        </a>
      </div>

      {/* Section 1: Cancellation */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            1
          </span>
          <span>Order Cancellation (Before Dispatch)</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          You may cancel your order at any time before it has been dispatched from our central warehouse with <strong>zero penalty or cancellation charge</strong>.
        </p>
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm space-y-1.5 text-gray-700">
          <p>
            • To cancel, call or WhatsApp our helpline at <strong>+91 8630552164</strong> or email <strong>support@leaforaherbal.com</strong> with your Order ID.
          </p>
          <p>
            • For prepaid orders cancelled prior to dispatch, a 100% full refund is initiated immediately to your original payment method.
          </p>
        </div>
      </section>

      {/* Section 2: Returns & Replacements */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            2
          </span>
          <span>Return Eligibility &amp; Replacement Criteria</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          A replacement or refund request is eligible under the following circumstances reported within <strong>7 days of delivery</strong>:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Transit Damage:</strong> The outer parcel or inner medicine container is broken, cracked, leaking, or damaged during courier transit.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Incorrect Product:</strong> The delivered item does not match the product formulation selected during checkout (e.g., received Stop Sugar instead of Josh 1000).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Tampered Security Seal:</strong> The inner hygiene aluminum or induction seal is broken or tampered upon initial opening.
            </span>
          </li>
        </ul>
      </section>

      {/* Section 3: Hygiene & Health Safety Exception */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            3
          </span>
          <span>Consumables Hygiene &amp; Safety Policy</span>
        </h2>
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Strict Hygiene Standards for Herbal Formulations</span>
          </div>
          <p className="leading-relaxed">
            Due to the consumable nature of Ayurvedic health supplements (oral capsules, herbal powders, and topical massage oils), bottles or containers that have been opened, consumed, or unsealed cannot be returned for restock or exchange under consumer health sanitation guidelines. However, genuine manufacturing defects or transit damages are always 100% replaced or refunded without hesitation.
          </p>
        </div>
      </section>

      {/* Section 4: Refund Process & Timelines */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            4
          </span>
          <span>Refund Processing &amp; Bank Timelines</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          Once your return/refund claim is verified by our customer care team:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
            <strong className="block text-gray-900 font-bold">For Prepaid Orders (Cards / UPI / NetBanking):</strong>
            <p className="text-gray-600">
              Refund is credited directly back to the original funding account within <strong>5 to 7 business days</strong> as per banking turnaround standards.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
            <strong className="block text-gray-900 font-bold">For Cash on Delivery (COD) Orders:</strong>
            <p className="text-gray-600">
              Our accounts team will request your verified UPI ID or Bank NEFT account coordinates. Refund is processed within <strong>24 to 48 hours</strong> of verification.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: How to Claim */}
      <section className="p-6 rounded-3xl bg-[#0c2415] text-white space-y-4">
        <h2 className="text-lg font-black text-[#fbeea4]">
          How to Initiate a Replacement or Refund
        </h2>
        <ol className="space-y-2 text-xs sm:text-sm text-emerald-100 list-decimal list-inside leading-relaxed">
          <li>Take clear photos or a short video showing the damaged bottle/seal and outer shipping box label.</li>
          <li>
            Send the photos along with your Order ID to our WhatsApp or email: <strong>support@leaforaherbal.com</strong>.
          </li>
          <li>
            Or call our dedicated helpline directly at <strong className="text-white">+91 8630552164</strong> (8630552164) between 9:30 AM and 7:30 PM (Mon to Sat).
          </li>
          <li>Our customer care team will review the claim and dispatch your brand new replacement within 24 hours.</li>
        </ol>
      </section>
    </article>
  );
}
