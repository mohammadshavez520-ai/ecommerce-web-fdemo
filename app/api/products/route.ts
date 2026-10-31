import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts, createProduct } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";
import { pushProductToShiprocket } from "@/lib/shiprocket-formatter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const inStock = searchParams.has("inStock") ? searchParams.get("inStock") === "true" : undefined;
    const limit = searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined;
    const offset = searchParams.has("offset") ? Number(searchParams.get("offset")) : undefined;

    const products = await getProducts({ search, category, inStock, limit, offset });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("[API] Failed to fetch products:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Enforce Server-Side Admin Authorization
    const auth = verifyAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required to add products" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 2. Validate Required Fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Product name is required" },
        { status: 400 }
      );
    }

    if (body.price === undefined || isNaN(Number(body.price)) || Number(body.price) < 0) {
      return NextResponse.json(
        { success: false, error: "A valid selling price (greater than or equal to 0) is required" },
        { status: 400 }
      );
    }

    if (!body.image_url || !body.image_url.trim()) {
      return NextResponse.json(
        { success: false, error: "Primary product image URL is required" },
        { status: 400 }
      );
    }

    const price = Number(body.price);
    const originalPrice = Number(body.original_price || body.price);
    const saveAmount = Math.max(0, originalPrice - price);
    const discountPercent =
      originalPrice > 0 ? Math.round((saveAmount / originalPrice) * 100) : 0;

    const newProduct = await createProduct({
      name: body.name.trim(),
      slug: body.slug ? body.slug.trim() : undefined,
      tagline: body.tagline ? body.tagline.trim() : "",
      sku: body.sku?.trim() || `LEA-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      description: body.description || "",
      description_sections: Array.isArray(body.description_sections) ? body.description_sections : [],
      description_images: Array.isArray(body.description_images) ? body.description_images : [],
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.image_url],
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      dosage: body.dosage ? body.dosage.trim() : "",
      ingredients_list: Array.isArray(body.ingredients_list) ? body.ingredients_list : [],
      price,
      original_price: originalPrice,
      save_amount: saveAmount,
      discount_percent: discountPercent,
      image_url: body.image_url.trim(),
      badge: body.badge ? body.badge.trim() : "",
      is_featured: Boolean(body.is_featured),
      in_stock: body.in_stock !== undefined ? Boolean(body.in_stock) : true,
      stock_quantity: body.stock_quantity !== undefined ? Number(body.stock_quantity) : 100,
      category: body.category || "Men's Vitality & Stamina",
      category_id: body.category_id || undefined,
    });

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/product/${newProduct.slug || newProduct.id}`);
      revalidatePath("/product/[slug]", "page");
    } catch (revError) {
      console.warn("[revalidatePath] Cache purge non-fatal error:", revError);
    }

    // Push new product into Shiprocket catalog in real-time
    try {
      await pushProductToShiprocket(newProduct);
    } catch (srErr) {
      console.warn("[Shiprocket Catalog Push Warning]:", srErr);
    }

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("[API] Failed to create product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create product in database" },
      { status: 500 }
    );
  }
}
