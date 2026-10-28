import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  FileText,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Scale,
  CreditCard,
  Truck,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Leafora Herbal Private Limited",
  description:
    "Official Terms and Conditions governing the use of Leafora Herbal Private Limited website, purchases, and authentic Ayurvedic formulations.",
};

export default function TermsPage() {
  const lastUpdated = "27 October 2026";

  return (
    <article className="space-y-8 bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-200 shadow-xs text-gray-800">
      {/* Policy Heading */}
      <div className="border-b border-gray-200 pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300">
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            <span>Binding Agreement</span>
          </span>
          <span className="text-xs font-semibold text-gray-500">
            Last Updated: {lastUpdated}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Terms &amp; Conditions
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Please read these Terms &amp; Conditions carefully before accessing or using the services of <strong>Leafora Herbal Private Limited</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) via <strong>leaforaherbal.com</strong> or placing orders by telephone with our helpline at <strong>+91 8630552164</strong>. By accessing our platform or placing an order, you agree to be legally bound by these terms.
        </p>
      </div>

      {/* Highlights Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-emerald-900 font-bold mb-0.5">
              Authentic Pure Herbal Formulations Only
            </strong>
            <span>
              All products sold by Leafora Herbal Private Limited are authentic Ayurvedic proprietary formulations crafted with 100% natural herbs and verified laboratory purity.
            </span>
          </div>
        </div>
        <a
          href="tel:+918630552164"
          className="shrink-0 py-2 px-4 rounded-xl bg-[#16341f] text-[#fbeea4] font-extrabold text-xs flex items-center gap-2 shadow-xs hover:bg-[#0e2214] transition"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Helpline: +91 8630552164</span>
        </a>
      </div>

      {/* Section 1 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            1
          </span>
          <span>Eligibility to Use &amp; Order</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          By purchasing products or registering your order with Leafora Herbal Private Limited, you represent that you are at least 18 years of age or accessing under the supervision of a parent or legal guardian who agrees to be bound by these Terms.
        </p>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            2
          </span>
          <span>Products, Formulations &amp; Wellness Usage</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          Our products (including Josh 1000 Capsule, Time Master Combo, Stop Sugar Powder, and Diasure Herb Powder) are herbal Ayurvedic health supplements designed for physiological vitality and metabolic equilibrium. They are not intended as emergency replacements for clinical prescription drugs. Individual results may vary based on Prakriti, age, and regular regimen adherence. We encourage reading product packaging guidelines and contacting our wellness team at <strong>+91 8630552164</strong> for dosage advice.
        </p>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            3
          </span>
          <span>Pricing, GST &amp; Discounts</span>
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>All-Inclusive Pricing:</strong> All prices displayed on our website are in Indian Rupees (INR ₹) and are inclusive of Goods &amp; Services Tax (GST) and packaging.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Inaugural Offers:</strong> Discounted prices (including 70% inaugural savings) are promotional and subject to stock availability.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Prepaid Savings:</strong> Orders paid online via UPI/Cards/NetBanking receive an additional flat ₹400 instant prepaid discount applied at checkout.
            </span>
          </li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            4
          </span>
          <span>Cash on Delivery (COD) &amp; Order Verification</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          We provide 100% Free Pan-India Cash on Delivery (COD) to all serviceable PIN codes. To protect both customers and couriers from bogus deliveries, our dispatch verification team may initiate a quick verification call or SMS to your registered telephone number before handing over parcels to logistics carriers. Failure to confirm or providing invalid contact details may result in order cancellation.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            5
          </span>
          <span>Intellectual Property</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          All brand names, product packaging designs, trademarks, logos, texts, formulation graphics, and multimedia content featured on this website are the proprietary property of <strong>Leafora Herbal Private Limited</strong>. Any reproduction, replication, or unauthorized commercial exploitation is strictly prohibited under Indian Copyright and Trademark laws.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            6
          </span>
          <span>Limitation of Liability</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          To the maximum extent permitted by applicable law, Leafora Herbal Private Limited, its directors, officers, and employees shall not be liable for any indirect, incidental, special, or consequential damages resulting from the misuse of products contrary to packaging instructions. Our maximum aggregate liability for any proven claim shall not exceed the purchase price paid by you for the specific product in question.
        </p>
      </section>

      {/* Section 7 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            7
          </span>
          <span>Governing Law &amp; Dispute Resolution</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          These Terms and any non-contractual obligations arising out of or in connection with them shall be governed by and construed in accordance with the substantive laws of India. Any legal dispute or claim shall be subject to the exclusive jurisdiction of the competent courts in India.
        </p>
      </section>

      {/* Corporate Help Contact */}
      <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-700 space-y-3">
        <h3 className="font-black text-gray-900 text-base">Questions Regarding Our Terms?</h3>
        <p className="text-gray-600">
          If you require any clarification on our terms or policies, please connect with our administrative desk:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-1 font-semibold">
          <span>
            Helpline:{" "}
            <a href="tel:+918630552164" className="text-emerald-800 underline font-black">
              +91 8630552164
            </a>
          </span>
          <span>
            Email:{" "}
            <a href="mailto:support@leaforaherbal.com" className="text-emerald-800 underline font-black">
              support@leaforaherbal.com
            </a>
          </span>
        </div>
      </div>
    </article>
  );
}
