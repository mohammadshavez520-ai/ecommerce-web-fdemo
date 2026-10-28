"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Mail,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Building,
  UserCheck,
  Headphones,
  Send,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function ContactGrievancePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    orderId: "",
    category: "Order Support",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please provide your name and phone number.");
      return;
    }
    setFormSubmitted(true);
  };

  return (
    <article className="space-y-8 bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-200 shadow-xs text-gray-800">
      {/* Policy Heading */}
      <div className="border-b border-gray-200 pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300">
            <Headphones className="w-3.5 h-3.5 text-emerald-700" />
            <span>Official Helpdesk &amp; Grievance Matrix</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Contact Us &amp; Customer Grievances
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          At <strong>Leafora Herbal Private Limited</strong>, our verified wellness consultants and customer service specialists are committed to resolving your queries swiftly and transparently. Contact our direct telephone helpline at <strong>+91 8630552164</strong> or submit a callback ticket below.
        </p>
      </div>

      {/* Primary Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Telephone Card */}
        <a
          href="tel:+918630552164"
          className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-emerald-200 hover:border-emerald-600 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <PhoneCall className="w-6 h-6 text-[#fbeea4]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Primary Helpline (Call)
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-1 mb-1 group-hover:text-emerald-800 transition-colors">
              +91 8630552164
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              8630552164 · Click to call our direct customer care specialist.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-emerald-100 flex items-center gap-2 text-xs font-black text-emerald-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Lines Open: Mon – Sat</span>
          </div>
        </a>

        {/* Email Support Card */}
        <a
          href="mailto:support@leaforaherbal.com"
          className="p-6 rounded-3xl bg-gradient-to-br from-gray-50 via-white to-gray-50/50 border border-gray-200 hover:border-emerald-600 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#16341f] text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Official Email Desk
            </span>
            <h3 className="text-base font-black text-gray-900 mt-1 mb-1 truncate group-hover:text-emerald-800 transition-colors">
              support@leaforaherbal.com
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Send us order inquiries, unboxing photos for replacements, or dosage questions.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-500">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Replies within 24 hours</span>
          </div>
        </a>

        {/* Operating Hours Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 border border-amber-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center mb-4 shadow-sm">
              <Clock className="w-6 h-6 text-amber-200" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Support Schedule
            </span>
            <h3 className="text-base font-black text-gray-900 mt-1 mb-1">
              9:30 AM – 7:30 PM IST
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Monday through Saturday (excluding national gazetted holidays).
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-amber-100 flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Wellness Advisors On-Call</span>
          </div>
        </div>
      </div>

      {/* Interactive Contact / Callback Form */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Fast Response Form
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            Send an Inquiry or Request a Callback
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Fill in your details below and an executive from <strong>Leafora Herbal Private Limited</strong> will reach out to you directly on <strong>+91 8630552164</strong>.
          </p>
        </div>

        {formSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-emerald-950">Thank You, {formData.name}!</h3>
            <p className="text-xs sm:text-sm text-emerald-900 max-w-md mx-auto">
              Your inquiry has been received. Our customer care representative will call you at <strong>{formData.phone}</strong> shortly.
            </p>
            <button
              type="button"
              onClick={() => setFormSubmitted(false)}
              className="py-2 px-5 rounded-xl bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-950 transition"
            >
              Submit Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Order ID / Tracking No. (If applicable)
                </label>
                <input
                  type="text"
                  placeholder="e.g. LEA-10821"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Inquiry Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Order Support">Order Tracking &amp; Delivery Support</option>
                <option value="Dosage Advice">Free Herbal Dosage Advice</option>
                <option value="Replacement Request">Replacement or Damage Claim</option>
                <option value="Order Cancellation">Order Cancellation Request</option>
                <option value="General Inquiry">General Product Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Your Message / Question
              </label>
              <textarea
                rows={3}
                placeholder="Describe your inquiry or order details..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-[#16341f] hover:bg-[#0c2415] text-[#fbeea4] font-black text-sm flex items-center justify-center gap-2 shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry &amp; Request Callback</span>
            </button>
          </form>
        )}
      </section>

      {/* Official Grievance Redressal Cell */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0c2415] text-white space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-black text-white">
            Formal Grievance Redressal Cell (IT Act &amp; Consumer Protection)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          If any issue or grievance regarding your order remains unaddressed after contacting general support, consumers may escalate the matter directly to our senior regulatory compliance officer:
        </p>
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-xs space-y-2 text-emerald-200">
          <p><strong className="text-white">Entity:</strong> Leafora Herbal Private Limited</p>
          <p><strong className="text-white">Designation:</strong> Head of Grievance &amp; Consumer Redressal</p>
          <p>
            <strong className="text-white">Escalation Telephone:</strong>{" "}
            <a href="tel:+918630552164" className="text-[#fbeea4] font-black underline">
              +91 8630552164
            </a>{" "}
            (8630552164)
          </p>
          <p>
            <strong className="text-white">Escalation Email:</strong>{" "}
            <a href="mailto:support@leaforaherbal.com" className="text-[#fbeea4] font-black underline">
              support@leaforaherbal.com
            </a>
          </p>
          <p><strong className="text-white">Grievance Acknowledgement:</strong> Within 24 hours</p>
          <p><strong className="text-white">Final Resolution Timeline:</strong> Maximum 15 working days</p>
        </div>
      </section>
    </article>
  );
}
