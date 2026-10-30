"use client";

import { trackMetaEvent } from "@/components/MetaPixel";

declare global {
  interface Window {
    HeadlessCheckout?: {
      addToCart: (
        event: any,
        token: string,
        options?: { fallbackUrl?: string }
      ) => void;
    };
    fastrr_config?: any;
  }
}

/**
 * Initiates the official Shiprocket Checkout modal for a given product and quantity.
 */
export async function openShiprocketCheckout(
  event: React.MouseEvent | any,
  productId: string,
  quantity: number = 1
): Promise<void> {
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  if (event && event.stopPropagation) {
    event.stopPropagation();
  }

  try {
    const res = await fetch("/api/shiprocket/create-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.token) {
      const errMsg = data.error || "Unable to start checkout. Please check Shiprocket credentials.";
      console.error("[Shiprocket Checkout]", errMsg);
      alert(errMsg);
      return;
    }

    const token = data.token;
    const fallbackUrl = typeof window !== "undefined" ? `${window.location.origin}/order-success` : "/order-success";

    // Track Meta Ads InitiateCheckout Event
    trackMetaEvent("InitiateCheckout", {
      content_ids: [productId],
      content_type: "product",
      num_items: quantity,
      currency: "INR",
    });

    // Use official HeadlessCheckout object from shopify.js
    if (typeof window !== "undefined" && window.HeadlessCheckout && window.HeadlessCheckout.addToCart) {
      window.HeadlessCheckout.addToCart(event, token, {
        fallbackUrl,
      });
      return;
    }

    console.warn("[Shiprocket] HeadlessCheckout not ready yet. Retrying in 500ms...");
    setTimeout(() => {
      if (typeof window !== "undefined" && window.HeadlessCheckout && window.HeadlessCheckout.addToCart) {
        window.HeadlessCheckout.addToCart(event, token, {
          fallbackUrl,
        });
      } else {
        alert("Shiprocket Checkout script is loading. Please click Buy Now again in a moment.");
      }
    }, 500);
  } catch (err: any) {
    console.error("[Shiprocket Checkout Error]", err);
    alert("Checkout error: " + (err?.message || "Could not launch checkout"));
  }
}

