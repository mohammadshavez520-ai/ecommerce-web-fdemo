"use client";

import React, { useState } from "react";
import { ShoppingCart, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";

export function ProductClientActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3.5 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm transition"
          >
            -
          </button>
          <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3.5 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons — both trigger Shiprocket Checkout widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          data-fastrr-buy
          data-product-id={product.id}
          data-variant-id={`${product.id}-default`}
          data-quantity={String(quantity)}
          className="w-full py-4 px-6 rounded-2xl bg-[#16341f] hover:bg-[#0f2415] text-white font-extrabold text-base tracking-wide shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
        >
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          <span>BUY NOW</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        <button
          type="button"
          data-fastrr-buy
          data-product-id={product.id}
          data-variant-id={`${product.id}-default`}
          data-quantity={String(quantity)}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-base border-2 border-emerald-600/40 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5 text-emerald-700" />
          <span>PROCEED TO CHECKOUT</span>
        </button>
      </div>
    </div>
  );
}
