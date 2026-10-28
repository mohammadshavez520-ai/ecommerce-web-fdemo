import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  AlertTriangle,
  Stethoscope,
  Leaf,
  CheckCircle2,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Medical & Health Disclaimer | Leafora Herbal Private Limited",
  description:
    "Official Ayurvedic Health and Medical Disclaimer for Leafora Herbal Private Limited formulations, quality compliance, and consultation advice.",
};

export default function DisclaimerPage() {
  const lastUpdated = "27 October 2026";

  return (
    <article className="space-y-8 bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-200 shadow-xs text-gray-800">
      {/* Policy Heading */}
      <div className="border-b border-gray-200 pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Quality &amp; Safety Compliance</span>
          </span>
          <span className="text-xs font-semibold text-gray-500">
            Last Updated: {lastUpdated}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Medical &amp; Health Disclaimer
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          The information, product descriptions, educational content, and clinical guidance provided by <strong>Leafora Herbal Private Limited</strong> on this website (<strong>leaforaherbal.com</strong>) or shared through our consultation helpline at <strong>+91 8630552164</strong> are strictly intended for holistic Ayurvedic wellness and dietary supplementation purposes.
        </p>
      </div>

      {/* Critical Health Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-900 font-bold mb-0.5">
              Not a Substitute for Emergency Medical Care
            </strong>
            <span>
              Leafora Herbal formulations are authentic classical Ayurvedic proprietary medicines and dietary supplements. They are not intended to diagnose, treat, cure, or prevent acute clinical emergencies or serve as a substitute for professional medical counsel.
            </span>
          </div>
        </div>
        <a
          href="tel:+918630552164"
          className="shrink-0 py-2 px-4 rounded-xl bg-[#0c2415] text-[#fbeea4] font-extrabold text-xs flex items-center gap-2 shadow-xs hover:bg-black transition"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Consult Helpline: +91 8630552164</span>
        </a>
      </div>

      {/* Section 1 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            1
          </span>
          <span>Authentic Ayurvedic Classification</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          All formulations produced by <strong>Leafora Herbal Private Limited</strong> (including Josh 1000 Capsule, Time Master Combo, Stop Sugar Powder, and Diasure Herb Powder) are manufactured in GMP-certified facilities adhering to rigorous pharmacopeial standards and laboratory testing benchmarks.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Herbal Botanicals</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero Chemical Steroids</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Heavy Metal Tested</span>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            2
          </span>
          <span>Individual Results &amp; Bodily Constitution (Prakriti)</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          Ayurveda functions at the root causal level rather than merely suppressing superficial symptoms. As each individual possesses a unique bio-energetic constitution (Vata, Pitta, Kapha balance), metabolic response rate, age profile, and dietary routine:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
            <span>Results may vary from person to person in terms of speed and perceived physiological transformation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
            <span>We recommend adhering consistently to the prescribed daily dosage protocol for <strong>60 to 90 days</strong> alongside adequate hydration, balanced nutrition, and restorative rest.</span>
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            3
          </span>
          <span>Special Health Conditions &amp; Precautions</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          Please consult your personal physician or an authorized healthcare practitioner prior to beginning any new health regimen if you:
        </p>
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm space-y-1 text-gray-700 font-medium">
          <p>• Are pregnant, planning to conceive, or lactating / nursing.</p>
          <p>• Are undergoing clinical treatment for serious cardiovascular disorders, renal failure, or liver cirrhosis.</p>
          <p>• Are currently taking high-potency allopathic prescription medications.</p>
        </div>
      </section>

      {/* Section 4 */}
      <section className="p-6 rounded-3xl bg-emerald-900 text-white space-y-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-black text-white">
            Free Herbal Wellness Consultation
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          Need personalized advice regarding your health condition or optimal daily dosage? Our verified Ayurvedic consultants are available 6 days a week to assist you free of charge.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <a
            href="tel:+918630552164"
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-white text-emerald-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-100 transition"
          >
            <PhoneCall className="w-4 h-4 text-emerald-800" />
            <span>Call Support Desk: +91 8630552164</span>
          </a>
          <span className="text-xs text-emerald-200">
            Monday to Saturday · 9:30 AM to 7:30 PM IST
          </span>
        </div>
      </section>
    </article>
  );
}
