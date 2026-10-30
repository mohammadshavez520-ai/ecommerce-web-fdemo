/**
 * Shiprocket Checkout — Fetch Products API
 *
 * Endpoint  : GET /api/shiprocket/products?page=1&limit=100
 * Reference : Shiprocket Postman Documenter (2sB34bL3ig) - Catalog APIs -> Fetch Products
 * Guide     : https://docs.google.com/document/d/1uEcKW0uPAldhKiFCqJbAQnAmBTP6Azvlt_Rcxu5BW_0
 *
 * Response Structure:
 * {
 *   "data": {
 *     "total": 4,
 *     "products": [ ...Shopify/Shiprocket formatted products... ]
 *   }
 * }
 */

import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";
import { formatShiprocketProduct } from "@/lib/shiprocket-formatter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(250, Math.max(1, Number(searchParams.get("limit") || 100)));
    const offset = (page - 1) * limit;

    const allProducts = await getProducts();
    const total = allProducts.length;
    const paged = allProducts.slice(offset, offset + limit);

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
    console.error("[Shiprocket Products API] Error:", msg);
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
