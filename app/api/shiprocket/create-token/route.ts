/**
 * Shiprocket Checkout — Create Access Token API
 *
 * Endpoint  : POST /api/shiprocket/create-token
 * Purpose   : Generates a secure session token via Shiprocket Checkout API
 *             (https://checkout-api.shiprocket.com/api/v1/access-token/checkout)
 *             signed with HMAC-SHA256, required to open the Shiprocket Checkout iframe modal.
 */

import { NextResponse } from "next/server";
import { toNumericId, calculateShiprocketHmac } from "@/lib/shiprocket-formatter";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.SHIPROCKET_CHECKOUT_API_KEY;
    const secretKey = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;

    if (!apiKey || !secretKey || apiKey === "your_api_key_here") {
      return NextResponse.json(
        {
          success: false,
          error: "Shiprocket Checkout API Key and Secret Key are not configured in environment variables.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const productId = body.productId || "prod-josh-1000";
    const quantity = Math.max(1, Number(body.quantity || 1));
    const variantId = body.variantId || String(toNumericId(productId, 10000000));

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://leaforaherbal.com";

    const payload = {
      cart_data: {
        items: [
          {
            variant_id: String(variantId),
            quantity,
          },
        ],
      },
      redirect_url: `${siteUrl}/order-success`,
      timestamp: new Date().toISOString(),
    };

    const bodyString = JSON.stringify(payload);
    const hmac = calculateShiprocketHmac(secretKey, bodyString);

    const srResponse = await fetch("https://checkout-api.shiprocket.com/api/v1/access-token/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
        "X-Api-HMAC-SHA256": hmac,
      },
      body: bodyString,
    });

    const data = await srResponse.json();

    if (!srResponse.ok || !data.ok || !data.result?.token) {
      console.error("[Shiprocket Token Error]", data);
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to generate checkout access token",
          details: data,
        },
        { status: srResponse.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      token: data.result.token,
      order_id: data.result.data?.order_id,
    });
  } catch (error: any) {
    console.error("[Shiprocket Create Token Exception]", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error while creating checkout session",
      },
      { status: 500 }
    );
  }
}

