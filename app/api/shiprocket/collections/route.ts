/**
 * Shiprocket Checkout — Fetch Collections API
 *
 * Endpoint  : GET /api/shiprocket/collections?page=1&limit=100
 * Reference : Shiprocket Postman Documenter (2sB34bL3ig) - Catalog APIs -> Fetch Collections
 * Guide     : https://docs.google.com/document/d/1uEcKW0uPAldhKiFCqJbAQnAmBTP6Azvlt_Rcxu5BW_0
 *
 * Response Structure:
 * {
 *   "data": {
 *     "total": 3,
 *     "collections": [ ...Shopify/Shiprocket formatted collections... ]
 *   }
 * }
 */

import { NextResponse } from "next/server";
import { getCategories } from "@/lib/db";
import { formatShiprocketCollection } from "@/lib/shiprocket-formatter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(250, Math.max(1, Number(searchParams.get("limit") || 100)));
    const offset = (page - 1) * limit;

    const allCategories = await getCategories();
    const total = allCategories.length;
    const paged = allCategories.slice(offset, offset + limit);

    const formattedCollections = paged.map((c) => formatShiprocketCollection(c));

    return NextResponse.json(
      {
        data: {
          total,
          collections: formattedCollections,
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
    console.error("[Shiprocket Collections API] Error:", msg);
    return NextResponse.json(
      {
        data: {
          total: 0,
          collections: [],
        },
        error: msg,
      },
      { status: 500 }
    );
  }
}
