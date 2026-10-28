import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  PhoneCall,
  Mail,
  UserCheck,
  FileText,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Leafora Herbal Private Limited",
  description:
    "Official Privacy Policy of Leafora Herbal Private Limited. Learn how we safeguard your personal information, manage orders, and protect data.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "27 October 2026";

  return (
    <article className="space-y-8 bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-200 shadow-xs text-gray-800">
      {/* Policy Heading Header */}
      <div className="border-b border-gray-200 pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>DPDP Act 2023 Compliant</span>
          </span>
          <span className="text-xs font-semibold text-gray-500">
            Last Updated: {lastUpdated}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Privacy Policy
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          This Privacy Policy describes how <strong>Leafora Herbal Private Limited</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or the &quot;Company&quot;) collects, processes, uses, and safeguards the personal information of individuals (&quot;User&quot;, &quot;you&quot;, or &quot;Customer&quot;) who browse, access, or place orders through our official website (<strong>leaforaherbal.com</strong>) or via our direct customer care helpline at <strong>+91 8630552164</strong>.
        </p>
      </div>

      {/* Fast Contact Callout Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-emerald-900 font-bold mb-0.5">
              100% Data Confidentiality &amp; Zero Spam Guarantee
            </strong>
            <span>
              Leafora Herbal Private Limited never rents, trades, or sells your phone number or personal details to unauthorized third-party advertisers. Your information is strictly utilized to process, ship, and deliver your authentic herbal wellness orders.
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

      {/* Section 1 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            1
          </span>
          <span>Legal Entity &amp; Corporate Identity</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          The website and online e-commerce operations are wholly owned and managed by:
        </p>
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5 font-medium text-gray-700">
          <p>
            <strong className="text-gray-900">Legal Name:</strong> Leafora Herbal Private Limited
          </p>
          <p>
            <strong className="text-gray-900">Brand Identity:</strong> Leafora Herbal
          </p>
          <p>
            <strong className="text-gray-900">Official Helpline:</strong>{" "}
            <a href="tel:+918630552164" className="text-emerald-800 font-bold underline">
              +91 8630552164
            </a>{" "}
            (8630552164)
          </p>
          <p>
            <strong className="text-gray-900">Official Email:</strong>{" "}
            <a href="mailto:support@leaforaherbal.com" className="text-emerald-800 font-bold underline">
              support@leaforaherbal.com
            </a>
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            2
          </span>
          <span>Information We Collect</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          We only collect personal information that is reasonably necessary to fulfill your orders, provide herbal wellness dosage advice, and communicate shipping milestones:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700">
          <li className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-gray-900 font-bold">Contact Details:</strong>
              <span>Your full name, mobile telephone number, and optional email address.</span>
            </div>
          </li>
          <li className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-gray-900 font-bold">Shipping Address:</strong>
              <span>House/Flat number, locality, landmark, city, state, and 6-digit PIN code.</span>
            </div>
          </li>
          <li className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-gray-900 font-bold">Order Preferences:</strong>
              <span>Selected product formulations, package quantities, and COD / Prepaid payment choice.</span>
            </div>
          </li>
          <li className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-gray-900 font-bold">Communication Records:</strong>
              <span>Records of telephone inquiries or WhatsApp messages placed to our helpline at +91 8630552164.</span>
            </div>
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            3
          </span>
          <span>How We Utilize Your Information</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          Personal data gathered by Leafora Herbal Private Limited is strictly deployed for legitimate business and transactional fulfillment purposes, including:
        </p>
        <div className="space-y-2 text-xs sm:text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span>Processing, packaging, and dispatching your ordered Ayurvedic formulations.</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span>Sharing delivery coordinates with our express logistics partners (BlueDart, Delhivery, Ekart, Shadowfax) for doorstep delivery.</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span>Sending transactional order confirmation, dispatch dispatch tracking codes, and delivery out-for-delivery alerts via SMS.</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span>Providing personalized Ayurvedic dosage advice and routine guidance when requested by you via our helpline 8630552164.</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span>Preventing fraudulent bookings and verifying Cash on Delivery (COD) delivery requests.</span>
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            4
          </span>
          <span>Payment Security &amp; Financial Information</span>
        </h2>
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2">
          <p className="font-semibold">
            Leafora Herbal Private Limited does NOT collect, capture, or store any sensitive banking passwords, debit/credit card CVV numbers, or Net Banking credentials on our servers.
          </p>
          <p className="text-xs text-amber-900">
            For prepaid transactions, you are redirected to PCI-DSS Level 1 compliant secure payment gateways using 256-bit encryption. For Cash on Delivery (COD) transactions, no payment information is collected online; payment is made directly to the courier agent upon physical receipt of the parcel.
          </p>
        </div>
      </section>

      {/* Section 5 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            5
          </span>
          <span>Third-Party Disclosure &amp; Logistics</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          We share your contact information and shipping address solely with authorized delivery and logistics partners strictly on a need-to-know basis to ensure order dispatch and transit tracking. Our courier associates are bound by strict non-disclosure obligations and are legally prohibited from using customer data for any secondary promotional purpose.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            6
          </span>
          <span>Cookies &amp; Local Storage</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          Our website utilizes functional cookies and local browser storage to keep track of your shopping bag, preserve your session during checkout, and analyze anonymized traffic performance to optimize user loading speeds. You may disable cookies in your browser settings at any time; however, some checkout functions may be restricted.
        </p>
      </section>

      {/* Section 7 */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
            7
          </span>
          <span>Your Rights Under DPDP Act 2023</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          As a consumer, you have the right to request access to the personal data we hold about you, request corrections to inaccurate contact information, or request the erasure of your profile from our marketing communication records. To exercise these rights, please contact our Data Protection Team at <strong>support@leaforaherbal.com</strong> or call <strong>+91 8630552164</strong>.
        </p>
      </section>

      {/* Section 8: Grievance Officer */}
      <section className="p-6 rounded-3xl bg-emerald-900 text-white space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-black text-white">
            Grievance Redressal Officer (IT Act Compliance)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          In accordance with the Information Technology Act, 2000, and the rules made thereunder, the contact details of the designated Grievance Officer for Leafora Herbal Private Limited are provided below:
        </p>
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 text-xs space-y-1.5">
          <p><strong className="text-emerald-300">Company:</strong> Leafora Herbal Private Limited</p>
          <p><strong className="text-emerald-300">Designation:</strong> Head of Compliance &amp; Customer Grievances</p>
          <p>
            <strong className="text-emerald-300">Helpline:</strong>{" "}
            <a href="tel:+918630552164" className="text-white font-extrabold underline hover:text-emerald-300">
              +91 8630552164
            </a>{" "}
            (8630552164)
          </p>
          <p>
            <strong className="text-emerald-300">Email:</strong>{" "}
            <a href="mailto:support@leaforaherbal.com" className="text-white font-extrabold underline hover:text-emerald-300">
              support@leaforaherbal.com
            </a>
          </p>
          <p><strong className="text-emerald-300">Response Window:</strong> Within 24–48 working hours</p>
        </div>
      </section>
    </article>
  );
}
