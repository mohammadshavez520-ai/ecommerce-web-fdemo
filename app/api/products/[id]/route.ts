import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProductById, getProductBySlug, updateProduct, deleteProduct } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

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
        { success: false, error: "Product identifier is required" },
        { status: 400 }
      );
    }

    const product = (await getProductById(id)) || (await getProductBySlug(id));

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error(`[API] Failed to fetch product:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
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
    const auth = verifyAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin credentials required to modify products" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID parameter is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // 2. Validate Numerical Inputs
    if (body.price !== undefined && (isNaN(Number(body.price)) || Number(body.price) < 0)) {
      return NextResponse.json(
        { success: false, error: "Selling price must be a valid positive number" },
        { status: 400 }
      );
    }

    if (
      body.original_price !== undefined &&
      (isNaN(Number(body.original_price)) || Number(body.original_price) < 0)
    ) {
      return NextResponse.json(
        { success: false, error: "Original price must be a valid positive number" },
        { status: 400 }
      );
    }

    if (
      body.stock_quantity !== undefined &&
      (isNaN(Number(body.stock_quantity)) || Number(body.stock_quantity) < 0)
    ) {
      return NextResponse.json(
        { success: false, error: "Stock quantity must be a non-negative integer" },
        { status: 400 }
      );
    }

    const updated = await updateProduct(id, {
      ...body,
      name: body.name ? String(body.name).trim() : undefined,
      slug: body.slug ? String(body.slug).trim() : undefined,
      price: body.price !== undefined ? Number(body.price) : undefined,
      original_price: body.original_price !== undefined ? Number(body.original_price) : undefined,
      stock_quantity: body.stock_quantity !== undefined ? Number(body.stock_quantity) : undefined,
      in_stock: body.in_stock !== undefined ? Boolean(body.in_stock) : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Product "${id}" not found or failed to update` },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/product/${updated.slug || updated.id}`);
      revalidatePath("/product/[slug]", "page");
      revalidatePath("/products/[id]", "page");
    } catch (revError) {
      console.warn("[revalidatePath] Cache purge non-fatal error:", revError);
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error(`[API] Failed to update product:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update product in database" },
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
    const auth = verifyAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin credentials required to delete products" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID parameter is required" },
        { status: 400 }
      );
    }

    const success = await deleteProduct(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: `Product "${id}" not found or delete failed` },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/product/[slug]", "page");
      revalidatePath("/products/[id]", "page");
    } catch (revError) {
      console.warn("[revalidatePath] Cache purge non-fatal error:", revError);
    }

    return NextResponse.json({ success: true, message: `Product ${id} deleted successfully` });
  } catch (error: any) {
    console.error(`[API] Failed to delete product:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete product from database" },
      { status: 500 }
    );
  }
}
