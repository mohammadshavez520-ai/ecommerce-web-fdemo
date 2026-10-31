import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID parameter is required" },
        { status: 400 }
      );
    }

    const category = await getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("[API] Failed to fetch category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Enforce Server-Side Admin Authorization
    if (!isAdminAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID parameter is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updated = await updateCategory(id, {
      name: body.name ? String(body.name).trim() : undefined,
      slug: body.slug ? String(body.slug).trim() : undefined,
      description: body.description !== undefined ? String(body.description) : undefined,
      image_url: body.image_url !== undefined ? String(body.image_url) : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Category "${id}" not found or update failed` },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error("[API] Failed to update category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update category in database" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Enforce Server-Side Admin Authorization
    if (!isAdminAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID parameter is required" },
        { status: 400 }
      );
    }

    const success = await deleteCategory(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: `Category "${id}" not found or delete failed` },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, message: `Category ${id} deleted successfully` });
  } catch (error: any) {
    console.error("[API] Failed to delete category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete category from database" },
      { status: 500 }
    );
  }
}
