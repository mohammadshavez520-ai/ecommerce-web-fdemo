import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCategories, createCategory } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("[API] Failed to fetch categories:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Enforce Server-Side Admin Authorization
    if (!isAdminAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const newCategory = await createCategory({
      name: body.name.trim(),
      slug: body.slug ? body.slug.trim() : body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: body.description ? String(body.description).trim() : "",
      image_url: body.image_url ? String(body.image_url).trim() : "",
    });

    try {
      revalidatePath("/");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error("[API] Failed to create category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create category in database" },
      { status: 500 }
    );
  }
}
