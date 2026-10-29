/**
 * Shiprocket Checkout — Collections API
 *
 * Endpoint  : GET /api/shiprocket/collections
 * Purpose   : Returns all product collections (categories) in the Shiprocket
 *             Checkout custom-integration schema so Shiprocket can organise
 *             products by collection during checkout upsell / cross-sell flows.
 *
 * Auth      : Bearer token validation via SHIPROCKET_CHECKOUT_SECRET_KEY.
 *             Shiprocket sends this key as:
 *               Authorization: Bearer <SHIPROCKET_CHECKOUT_SECRET_KEY>
 *
 * Ref       : https://documenter.getpostman.com/view/25617008/2sB34bL3ig
 */

import { NextResponse } from "next/server";
import { getCategories } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ── Auth helper ──────────────────────────────────────────────────────────────
function isAuthorized(request: Request): boolean {
  const secret = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;
  if (!secret) {
    // If no secret is configured, allow open access (useful during initial setup).
    console.warn("[Shiprocket] SHIPROCKET_CHECKOUT_SECRET_KEY is not set — endpoint is open.");
    return true;
  }
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  return token === secret;
}

// ── Shape a category into Shiprocket's expected collection schema ─────────────
function toShiprocketCollection(c: {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  product_count?: number;
  created_at?: string;
}) {
  return {
    id: c.id,
    title: c.name,
    handle: c.slug || c.id,
    description: c.description || "",
    image: c.image_url || null,
    products_count: c.product_count ?? 0,
    published_at: c.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const categories = await getCategories();
    const collections = categories.map(toShiprocketCollection);

    return NextResponse.json(
      {
        success: true,
        collections,
        count: collections.length,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("[Shiprocket Collections API] Error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

