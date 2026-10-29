/**
 * Shiprocket Checkout — Products by Collection API
 *
 * Endpoint  : GET /api/shiprocket/collections/[id]/products
 * Purpose   : Returns all products belonging to a specific collection (category)
 *             identified by its ID or slug. Shiprocket Checkout uses this to
 *             power upsell / cross-sell recommendations during checkout.
 *
 * Auth      : Bearer token validation via SHIPROCKET_CHECKOUT_SECRET_KEY.
 *             Shiprocket sends this key as:
 *               Authorization: Bearer <SHIPROCKET_CHECKOUT_SECRET_KEY>
 *
 * Ref       : https://documenter.getpostman.com/view/25617008/2sB34bL3ig
 */

import { NextResponse } from "next/server";
import { getCategories, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ── Auth helper ──────────────────────────────────────────────────────────────
function isAuthorized(request: Request): boolean {
  const secret = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;
  if (!secret) {
    console.warn("[Shiprocket] SHIPROCKET_CHECKOUT_SECRET_KEY is not set — endpoint is open.");
    return true;
  }
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  return token === secret;
}

// ── Shape a product into Shiprocket's expected schema ────────────────────────
function toShiprocketProduct(p: {
  id: string;
  name: string;
  slug?: string;
  sku?: string;
  tagline: string;
  description?: string;
  price: number;
  original_price: number;
  discount_percent?: number;
  image_url: string;
  images?: string[];
  in_stock: boolean;
  stock_quantity?: number;
  category?: string;
  category_id?: string;
  highlights?: string[];
  badge?: string;
  is_featured?: boolean;
}) {
  return {
    id: p.id,
    title: p.name,
    handle: p.slug || p.id,
    sku: p.sku || p.id,
    description: p.tagline || p.description || "",
    price: Math.round(p.price * 100),
    compare_at_price: Math.round(p.original_price * 100),
    discount_percentage: p.discount_percent ?? 0,
    currency: "INR",
    inventory_quantity: p.stock_quantity ?? 0,
    available: p.in_stock,
    featured_image: p.image_url,
    images: p.images && p.images.length > 0 ? p.images : [p.image_url],
    vendor: "Leafora Herbal",
    product_type: p.category || "Ayurvedic",
    tags: [
      ...(p.highlights || []).slice(0, 5),
      ...(p.badge ? [p.badge] : []),
    ],
    variants: [
      {
        id: `${p.id}-default`,
        title: "Default",
        sku: p.sku || p.id,
        price: Math.round(p.price * 100),
        compare_at_price: Math.round(p.original_price * 100),
        inventory_quantity: p.stock_quantity ?? 0,
        available: p.in_stock,
        weight: 500,
        weight_unit: "g",
        option1: "Default",
        option2: null,
        option3: null,
      },
    ],
    options: [{ name: "Title", values: ["Default"] }],
    collections: p.category_id ? [p.category_id] : [],
    is_featured: p.is_featured ?? false,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id: collectionId } = await params;

    if (!collectionId) {
      return NextResponse.json(
        { success: false, error: "Collection ID is required" },
        { status: 400 }
      );
    }

    // Resolve the collection (by ID or slug)
    const allCategories = await getCategories();
    const collection = allCategories.find(
      (c) => c.id === collectionId || c.slug === collectionId
    );

    if (!collection) {
      return NextResponse.json(
        { success: false, error: `Collection "${collectionId}" not found` },
        { status: 404 }
      );
    }

    // Fetch all products and filter by this collection
    const allProducts = await getProducts();
    const filtered = allProducts.filter(
      (p) =>
        p.category_id === collection.id ||
        p.category === collection.name
    );

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(250, Math.max(1, Number(searchParams.get("limit") || 50)));
    const offset = (page - 1) * limit;

    const paged = filtered.slice(offset, offset + limit);
    const products = paged.map(toShiprocketProduct);

    return NextResponse.json(
      {
        success: true,
        collection: {
          id: collection.id,
          title: collection.name,
          handle: collection.slug,
        },
        products,
        pagination: {
          total: filtered.length,
          page,
          limit,
          has_next_page: offset + limit < filtered.length,
        },
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
    console.error("[Shiprocket Products by Collection API] Error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

