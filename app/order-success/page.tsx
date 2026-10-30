"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
  CheckCircle,
  Truck,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  PackageCheck,
  Clock,
} from "lucide-react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const oid = searchParams.get("oid") || searchParams.get("order_id") || "SR-" + Date.now().toString().slice(-8);
  const ost = searchParams.get("ost") || "SUCCESS";
  const [copied, setCopied] = useState(false);

  // Meta Pixel Purchase Event Tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    const trackingKey = `tracked_purchase_${oid}`;
    const alreadyTracked = sessionStorage.getItem(trackingKey);

    // Prevent duplicate event firing on page refresh
    if (!alreadyTracked && ost.toUpperCase() === "SUCCESS") {
      const estimatedValue = 899; // Standard formulation value (INR)

      // 1. Meta Pixel (Facebook Ads) Purchase Event
      if (typeof window.fbq === "function") {
        window.fbq("track", "Purchase", {
          value: estimatedValue,
          currency: "INR",
          content_type: "product",
          order_id: oid,
        });
        console.log("[Tracking] Meta Pixel Purchase event fired for order:", oid);
      }

      // 2. Google Tag Manager / GA4 DataLayer Event
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: "purchase",
          ecommerce: {
            transaction_id: oid,
            value: estimatedValue,
            currency: "INR",
          },
        });
        console.log("[Tracking] DataLayer Purchase event pushed for order:", oid);
      }

      sessionStorage.setItem(trackingKey, "true");
    }
  }, [oid, ost]);

  const handleCopyOrderId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(oid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-200/90 text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Animated Success Badge */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-emerald-600 to-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-600/30">
        <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-2 border-white items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
          </span>
        </span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300 mb-3">
        <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span>Order Confirmed via Shiprocket</span>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-snug">
        Thank You for Your Order!
      </h1>

      <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
        Your booking has been successfully placed. Our dispatch team is packaging your fresh, 100% genuine Ayurvedic formulation for express delivery.
      </p>

      {/* Order Reference Card */}
      <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border border-amber-200/80 text-left text-xs sm:text-sm space-y-3 shadow-inner">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
              Shiprocket Order ID
            </span>
            <span className="font-mono font-black text-emerald-950 text-sm sm:text-base">
              {oid}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyOrderId}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <span className="text-gray-500 block">Status:</span>
            <span className="font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Confirmed &amp; Processing
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Dispatch Window:</span>
            <span className="font-extrabold text-gray-900 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Within 24 Hours
            </span>
          </div>
        </div>
      </div>

      {/* Express Shipping Highlight */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start sm:items-center gap-3 text-left mb-6 shadow-2xs">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <div className="font-bold text-emerald-900">Free Express Pan-India Shipping</div>
          <p className="text-[11px] text-emerald-800/90 mt-0.5">
            Your package will arrive in <strong>3 to 5 business days</strong>. Tracking details will be sent via SMS / WhatsApp once dispatched.
          </p>
        </div>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8 text-center">
        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <span className="text-[11px] font-bold text-gray-900 block leading-tight">100% Ayurvedic</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Zero Chemicals</span>
        </div>
        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
          <PackageCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <span className="text-[11px] font-bold text-gray-900 block leading-tight">Discreet Box</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Tamper-Proof</span>
        </div>
        <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
          <PhoneCall className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <span className="text-[11px] font-bold text-gray-900 block leading-tight">Help Support</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">+91 8630552164</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 py-3.5 px-6 rounded-2xl bg-[#16341f] hover:bg-[#0f2415] text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2"
        >
          <span>Return to Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <a
          href="tel:+918630552164"
          className="py-3.5 px-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm border border-emerald-300 transition flex items-center justify-center gap-2"
        >
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Call Helpline</span>
        </a>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="p-12 text-center text-sm font-semibold text-gray-600">
              Loading confirmed order details...
            </div>
          }
        >
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

