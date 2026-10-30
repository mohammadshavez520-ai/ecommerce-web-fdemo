/**
 * Shiprocket Checkout — Products by Collection API (Path Parameter compatibility)
 *
 * Endpoint  : GET /api/shiprocket/collections/[id]/products
 * Reference : Shiprocket Postman Documenter (2sB34bL3ig)
 *
 * Accepts either:
 * - Path parameter: /api/shiprocket/collections/4828601/products
 * - Or query param: ?collection_id=4828601
 * - Or placeholder test: /api/shiprocket/collections/{id}/products
 *
 * ALWAYS returns 200 OK in the Shiprocket schema.
 */

import { NextResponse } from "next/server";
import { getCategories, getProducts } from "@/lib/db";
import { formatShiprocketProduct, toNumericId } from "@/lib/shiprocket-formatter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const { searchParams } = new URL(request.url);

    // Accept either path param or query param
    const collectionIdParam = (rawId || searchParams.get("collection_id") || "").trim();

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(250, Math.max(1, Number(searchParams.get("limit") || 100)));
    const offset = (page - 1) * limit;

    const [allProducts, allCategories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    let matchedProducts = allProducts;

    const isPlaceholder =
      !collectionIdParam ||
      collectionIdParam === "{id}" ||
      collectionIdParam === ":id" ||
      collectionIdParam === "undefined" ||
      collectionIdParam === "null";

    if (!isPlaceholder) {
      const targetCollection = allCategories.find((c) => {
        const numId = toNumericId(c.id);
        return (
          String(numId) === collectionIdParam ||
          c.id.toLowerCase() === collectionIdParam.toLowerCase() ||
          c.slug?.toLowerCase() === collectionIdParam.toLowerCase() ||
          c.name?.toLowerCase() === collectionIdParam.toLowerCase()
        );
      });

      if (targetCollection) {
        matchedProducts = allProducts.filter(
          (p) =>
            p.category_id === targetCollection.id ||
            p.category === targetCollection.name
        );
      }
    }

    const total = matchedProducts.length;
    const paged = matchedProducts.slice(offset, offset + limit);
    const formattedProducts = paged.map((p) => formatShiprocketProduct(p));

    return NextResponse.json(
      {
        data: {
          total,
          products: formattedProducts,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("[Shiprocket Products by Collection API] Error:", msg);
    return NextResponse.json(
      {
        data: {
          total: 0,
          products: [],
        },
        error: msg,
      },
      { status: 500 }
    );
  }
}
