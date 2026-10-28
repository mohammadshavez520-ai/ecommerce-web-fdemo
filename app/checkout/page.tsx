"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ShieldCheck, Truck, Lock, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Product } from "@/lib/types";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") || "prod-josh-1000";
  const initialQty = parseInt(searchParams.get("quantity") || "1", 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(initialQty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
    paymentMethod: "COD" as "COD" | "Prepaid",
  });

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          // Fallback fetch first product
          fetch("/api/products")
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.products.length > 0) {
                setProduct(d.products[0]);
              }
            });
        }
      })
      .catch((err) => console.error("Error loading product for checkout:", err));
  }, [productId]);

  const subtotal = product ? product.price * quantity : 899;
  const prepaidDiscount = formData.paymentMethod === "Prepaid" ? 400 : 0;
  const totalAmount = Math.max(0, subtotal - prepaidDiscount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError("Please enter a valid 10-digit mobile number for order delivery updates.");
      return;
    }

    if (!formData.address.trim() || !formData.pincode.trim()) {
      setError("Please provide your complete delivery address and pincode.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          address: formData.address,
          city: formData.city || "Local",
          state: formData.state || "India",
          pincode: formData.pincode,
          product_id: product?.id || "prod-1",
          product_name: product?.name || "Leafora Herbal Formulation",
          quantity,
          total_amount: totalAmount,
          discount_amount: prepaidDiscount,
          payment_method: formData.paymentMethod,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit booking");
      }

      router.push(`/order-success/${data.order.order_number}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
      </div>

      <div className="text-center sm:text-left mb-8 border-b border-gray-200 pb-4">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Secure E-Commerce Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
          Customer Details &amp; Shipping
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Complete your information below to receive your genuine Leafora Herbal order.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Details */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number (10 digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="For invoice and order tracking"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Street Address &amp; House/Flat No. <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House/Flat No., Apartment, Street, Nearby Landmark"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pincode (6 digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 302017"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    formData.paymentMethod === "COD"
                      ? "border-emerald-600 bg-emerald-50/40"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-extrabold text-sm text-gray-900">
                      Cash on Delivery (COD)
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pay cash to delivery executive at your doorstep. No advance payment required.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    formData.paymentMethod === "Prepaid"
                      ? "border-emerald-600 bg-emerald-50/40"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Prepaid"
                    checked={formData.paymentMethod === "Prepaid"}
                    onChange={() => setFormData({ ...formData, paymentMethod: "Prepaid" })}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                        Online Payment (UPI / Cards / NetBanking)
                      </div>
                      <span className="text-[11px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        SAVE ₹400
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Instant flat ₹400 discount automatically applied. (Razorpay Gateway ready).
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-md space-y-5">
              <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h3>

              {/* Product item display */}
              {product && (
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">{product.tagline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-black text-emerald-800 text-sm">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <del className="text-xs text-gray-400">
                        ₹{product.original_price.toLocaleString("en-IN")}
                      </del>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Price Details */}
              <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {formData.paymentMethod === "Prepaid" && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Prepaid Instant Discount</span>
                    <span>-₹400</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery &amp; Shipping Charges</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>

                <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Payable:</span>
                  <span className="text-emerald-800 text-lg">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-[#16341f] hover:bg-[#0f2415] disabled:bg-gray-400 text-white font-extrabold text-base tracking-wide shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Placing Booking...</span>
                  </>
                ) : (
                  <>
                    <span>CONFIRM &amp; PLACE ORDER</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="space-y-2 pt-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% genuine Ayurvedic formula · Lab Tested Purity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dispatches within 24 hours · Delivery in 3-5 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Encrypted SSL checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbfa]">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-sm">Loading checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
