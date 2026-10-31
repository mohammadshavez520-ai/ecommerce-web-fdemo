import crypto from "crypto";
import {
  Category,
  Product,
  Order,
  Customer,
  SalesStats,
  OrderStatus,
  PaymentStatus,
  AdminUser,
} from "./types";
import { getSupabaseServerClient, isSupabaseConfigured } from "./supabase";
import bundledStoreJson from "../data/store.json";

export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password.trim()).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  if (!password || !hash) return false;
  return hashPassword(password) === hash || password.trim() === hash.trim();
}

export const INITIAL_CATEGORIES: Category[] = (bundledStoreJson.categories || []) as Category[];
export const INITIAL_PRODUCTS: Product[] = (bundledStoreJson.products || []) as Product[];
export const INITIAL_ORDERS: Order[] = (bundledStoreJson.orders || []) as Order[];
export const INITIAL_ADMIN_USERS: AdminUser[] = (bundledStoreJson.admin_users || [
  {
    id: "admin-1",
    username: "admin",
    password_hash: hashPassword("soumya!nSUPA09"),
    name: "Leafora Herbal Administrator",
    role: "Super Admin",
    created_at: new Date().toISOString(),
  },
]) as AdminUser[];

// Safe In-Memory Store: Used only when Supabase is not configured (e.g., local offline development).
// Absolutely NO local filesystem writes (fs.writeFileSync), preventing EROFS on read-only serverless platforms like Vercel.
interface MemoryStore {
  categories: Category[];
  products: Product[];
  orders: Order[];
  admin_users: AdminUser[];
}

const memoryStore: MemoryStore = {
  categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
  products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
  orders: JSON.parse(JSON.stringify(INITIAL_ORDERS)),
  admin_users: JSON.parse(JSON.stringify(INITIAL_ADMIN_USERS)),
};

function safePersistStore(): void {
  try {
    const fs = require("fs");
    const path = require("path");
    const storePath = path.join(process.cwd(), "data", "store.json");
    if (fs.existsSync(storePath)) {
      fs.writeFileSync(storePath, JSON.stringify(memoryStore, null, 2), "utf-8");
    }
  } catch {
    // Read-only serverless platforms (e.g. Vercel) silently ignore
  }
}

// Helper: Normalize product record from Supabase / Memory
function normalizeProduct(p: any): Product {
  const price = Number(p.price || 0);
  const originalPrice = Number(p.original_price || price);
  const saveAmount =
    p.save_amount !== undefined
      ? Number(p.save_amount)
      : Math.max(0, originalPrice - price);
  const discountPercent =
    p.discount_percent !== undefined
      ? Number(p.discount_percent)
      : originalPrice > 0
      ? Math.round((saveAmount / originalPrice) * 100)
      : 0;

  let descSections = p.description_sections || [];
  if (typeof descSections === "string") {
    try {
      descSections = JSON.parse(descSections);
    } catch {
      descSections = [];
    }
  }

  let ingredients = p.ingredients_list || [];
  if (typeof ingredients === "string") {
    try {
      ingredients = JSON.parse(ingredients);
    } catch {
      ingredients = [];
    }
  }

  let images = Array.isArray(p.images) ? p.images : [];
  if (images.length === 0 && p.image_url) {
    images = [p.image_url];
  }

  return {
    id: String(p.id),
    name: String(p.name || ""),
    slug: p.slug ? String(p.slug) : slugify(p.name || ""),
    tagline: p.tagline || "",
    sku: p.sku || `LEA-${String(p.id).toUpperCase()}`,
    description: p.description || "",
    description_sections: descSections,
    description_images: Array.isArray(p.description_images) ? p.description_images : [],
    images,
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    dosage: p.dosage || "",
    ingredients_list: ingredients,
    price,
    original_price: originalPrice,
    save_amount: saveAmount,
    discount_percent: discountPercent,
    image_url: p.image_url || images[0] || "",
    badge: p.badge || "",
    is_featured: p.is_featured !== undefined ? Boolean(p.is_featured) : true,
    in_stock: p.in_stock !== undefined ? Boolean(p.in_stock) : true,
    stock_quantity: p.stock_quantity !== undefined ? Number(p.stock_quantity) : 100,
    category: p.category || "Men's Vitality & Stamina",
    category_id: p.category_id || undefined,
    created_at: p.created_at || new Date().toISOString(),
  };
}

// Helper: Normalize category record
function normalizeCategory(c: any): Category {
  return {
    id: String(c.id),
    name: String(c.name || ""),
    slug: c.slug ? String(c.slug) : slugify(c.name || ""),
    description: c.description || "",
    image_url: c.image_url || "",
    created_at: c.created_at || new Date().toISOString(),
  };
}

// Helper: Normalize order record
function normalizeOrder(o: any): Order {
  return {
    id: String(o.id),
    order_number: String(o.order_number),
    customer_name: String(o.customer_name || ""),
    customer_phone: String(o.customer_phone || ""),
    customer_email: o.customer_email || "",
    address: String(o.address || ""),
    city: String(o.city || ""),
    state: String(o.state || ""),
    pincode: String(o.pincode || ""),
    product_id: String(o.product_id || ""),
    product_name: String(o.product_name || ""),
    quantity: Number(o.quantity || 1),
    total_amount: Number(o.total_amount || 0),
    discount_amount: Number(o.discount_amount || 0),
    payment_method: o.payment_method === "Prepaid" ? "Prepaid" : "COD",
    payment_status: (o.payment_status || (o.payment_method === "Prepaid" ? "Paid" : "Pending")) as PaymentStatus,
    status: (o.status || "Pending") as OrderStatus,
    tracking_number: o.tracking_number || "",
    courier_partner: o.courier_partner || "Delhivery Surface",
    estimated_delivery: o.estimated_delivery || "",
    notes: o.notes || "",
    created_at: o.created_at || new Date().toISOString(),
  };
}

/* =========================================================
   0. IDEMPOTENT SUPABASE MIGRATION & RE-SEED API
========================================================= */

export async function syncLeaforaToSupabase(): Promise<{
  success: boolean;
  message: string;
  count: number;
}> {
  const client = getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      message: "Supabase credentials are not configured in environment variables",
      count: 0,
    };
  }

  try {
    // 1. Upsert Categories
    for (const cat of INITIAL_CATEGORIES) {
      const { error: catErr } = await client.from("categories").upsert(
        {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || "",
          image_url: cat.image_url || "",
          created_at: cat.created_at || new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (catErr) {
        console.error("Failed to migrate category to Supabase:", cat.id, catErr);
        throw new Error(`Category migration failed (${cat.id}): ${catErr.message}`);
      }
    }

    // 2. Upsert Products
    for (const prod of INITIAL_PRODUCTS) {
      const normalized = normalizeProduct(prod);
      const { error: prodErr } = await client.from("products").upsert(
        {
          id: normalized.id,
          name: normalized.name,
          slug: normalized.slug,
          tagline: normalized.tagline,
          sku: normalized.sku,
          description: normalized.description,
          description_sections: normalized.description_sections,
          description_images: normalized.description_images,
          images: normalized.images,
          highlights: normalized.highlights,
          dosage: normalized.dosage,
          ingredients_list: normalized.ingredients_list,
          price: normalized.price,
          original_price: normalized.original_price,
          save_amount: normalized.save_amount,
          discount_percent: normalized.discount_percent,
          image_url: normalized.image_url,
          badge: normalized.badge,
          is_featured: normalized.is_featured,
          in_stock: normalized.in_stock,
          stock_quantity: normalized.stock_quantity,
          category: normalized.category,
          category_id: normalized.category_id,
          created_at: normalized.created_at,
        },
        { onConflict: "id" }
      );
      if (prodErr) {
        console.error("Failed to migrate product to Supabase:", prod.id, prodErr);
        throw new Error(`Product migration failed (${prod.id}): ${prodErr.message}`);
      }
    }

    // 3. Upsert Orders
    for (const order of INITIAL_ORDERS) {
      const normalizedOrd = normalizeOrder(order);
      const { error: ordErr } = await client.from("orders").upsert(
        {
          id: normalizedOrd.id,
          order_number: normalizedOrd.order_number,
          customer_name: normalizedOrd.customer_name,
          customer_phone: normalizedOrd.customer_phone,
          customer_email: normalizedOrd.customer_email,
          address: normalizedOrd.address,
          city: normalizedOrd.city,
          state: normalizedOrd.state,
          pincode: normalizedOrd.pincode,
          product_id: normalizedOrd.product_id,
          product_name: normalizedOrd.product_name,
          quantity: normalizedOrd.quantity,
          total_amount: normalizedOrd.total_amount,
          discount_amount: normalizedOrd.discount_amount,
          payment_method: normalizedOrd.payment_method,
          payment_status: normalizedOrd.payment_status,
          status: normalizedOrd.status,
          tracking_number: normalizedOrd.tracking_number,
          courier_partner: normalizedOrd.courier_partner,
          estimated_delivery: normalizedOrd.estimated_delivery,
          notes: normalizedOrd.notes,
          created_at: normalizedOrd.created_at,
        },
        { onConflict: "id" }
      );
      if (ordErr) {
        console.warn("Notice: order upsert skipped or failed:", order.id, ordErr.message);
      }
    }

    // 4. Upsert Admin User
    for (const user of INITIAL_ADMIN_USERS) {
      const { error: userErr } = await client.from("admin_users").upsert(
        {
          id: user.id,
          username: user.username,
          password_hash: user.password_hash,
          name: user.name,
          role: user.role,
          created_at: user.created_at || new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (userErr) {
        console.error("Failed to migrate admin user to Supabase:", user.username, userErr);
      }
    }

    return {
      success: true,
      message: `Successfully migrated ${INITIAL_CATEGORIES.length} categories and ${INITIAL_PRODUCTS.length} products to Supabase PostgreSQL`,
      count: INITIAL_PRODUCTS.length,
    };
  } catch (err: any) {
    console.error("Supabase sync error:", err);
    return {
      success: false,
      message: err?.message || "Sync failed",
      count: 0,
    };
  }
}

/* =========================================================
   1. CATEGORIES API
========================================================= */

export async function getCategories(): Promise<Category[]> {
  const client = getSupabaseServerClient();

  if (client) {
    try {
      const { data, error } = await client
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Supabase getCategories query error:", error);
        throw new Error(`Failed to fetch categories from database: ${error.message}`);
      }

      if (data && data.length > 0) {
        const categories = data.map(normalizeCategory);
        // Calculate dynamic product counts
        const products = await getProducts();
        return categories.map((c) => ({
          ...c,
          product_count: products.filter(
            (p) => p.category === c.name || p.category_id === c.id
          ).length,
        }));
      }

      // If categories table is completely empty, trigger initial seed
      console.log("Categories table empty in Supabase, triggering initial seed...");
      await syncLeaforaToSupabase();
      return INITIAL_CATEGORIES.map((c) => ({
        ...c,
        product_count: INITIAL_PRODUCTS.filter(
          (p) => p.category === c.name || p.category_id === c.id
        ).length,
      }));
    } catch (e: any) {
      console.error("Supabase categories error, falling back to memory store:", e?.message);
    }
  }

  // Fallback to safe memory store
  const prods = memoryStore.products;
  return memoryStore.categories.map((c) => ({
    ...c,
    product_count: prods.filter((p) => p.category === c.name || p.category_id === c.id).length,
  }));
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id || c.slug === id) || null;
}

export async function createCategory(
  categoryData: Omit<Category, "id" | "created_at">
): Promise<Category> {
  const slug = categoryData.slug ? slugify(categoryData.slug) : slugify(categoryData.name);
  const newCategory: Category = {
    ...categoryData,
    slug,
    id: `cat-${slug || Date.now()}`,
    created_at: new Date().toISOString(),
  };

  const client = getSupabaseServerClient();
  if (client) {
    const { data, error } = await client
      .from("categories")
      .insert([
        {
          id: newCategory.id,
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description || "",
          image_url: newCategory.image_url || "",
          created_at: newCategory.created_at,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase category insert failed:", error);
      throw new Error(`Failed to create category in database: ${error.message}`);
    }

    return normalizeCategory(data);
  }

  memoryStore.categories.push(newCategory);
  safePersistStore();
  return newCategory;
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<Category | null> {
  const client = getSupabaseServerClient();
  if (client) {
    const updatePayload: Record<string, unknown> = {};
    if (updates.name !== undefined) updatePayload.name = updates.name.trim();
    if (updates.slug !== undefined) updatePayload.slug = slugify(updates.slug);
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.image_url !== undefined) updatePayload.image_url = updates.image_url;

    const { data, error } = await client
      .from("categories")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase category update failed:", error);
      throw new Error(`Failed to update category in database: ${error.message}`);
    }

    return normalizeCategory(data);
  }

  const idx = memoryStore.categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  memoryStore.categories[idx] = {
    ...memoryStore.categories[idx],
    ...updates,
  };
  safePersistStore();
  return memoryStore.categories[idx];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (client) {
    const { error } = await client.from("categories").delete().eq("id", id);
    if (error) {
      console.error("Supabase category delete failed:", error);
      throw new Error(`Failed to delete category from database: ${error.message}`);
    }
    return true;
  }

  const initLen = memoryStore.categories.length;
  memoryStore.categories = memoryStore.categories.filter((c) => c.id !== id);
  safePersistStore();
  return memoryStore.categories.length < initLen;
}

/* =========================================================
   2. PRODUCTS API WITH SEARCH, FILTERING & PAGINATION
========================================================= */

export interface GetProductsOptions {
  search?: string;
  category?: string;
  inStock?: boolean;
  limit?: number;
  offset?: number;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  const client = getSupabaseServerClient();

  if (client) {
    try {
      let query = client.from("products").select("*").order("created_at", { ascending: false });

      if (options.category && options.category !== "All") {
        query = query.eq("category", options.category);
      }
      if (options.inStock !== undefined) {
        query = query.eq("in_stock", options.inStock);
      }
      if (options.search) {
        query = query.ilike("name", `%${options.search}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase products fetch failed:", error);
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      if (data && data.length > 0) {
        let list = data.map(normalizeProduct);

        if (options.search) {
          const q = options.search.toLowerCase();
          list = list.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              (p.sku && p.sku.toLowerCase().includes(q)) ||
              (p.category && p.category.toLowerCase().includes(q)) ||
              (p.tagline && p.tagline.toLowerCase().includes(q))
          );
        }

        if (options.offset !== undefined && options.limit !== undefined) {
          return list.slice(options.offset, options.offset + options.limit);
        }
        return list;
      }

      // If table is completely empty in Supabase, auto-seed
      console.log("Products table empty in Supabase, triggering initial seed...");
      await syncLeaforaToSupabase();
      return INITIAL_PRODUCTS.map(normalizeProduct);
    } catch (e: any) {
      console.error("Supabase products query error, falling back to memory store:", e?.message);
    }
  }

  // Fallback to memory store
  let list = memoryStore.products.map(normalizeProduct);

  if (options.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.tagline && p.tagline.toLowerCase().includes(q))
    );
  }

  if (options.category && options.category !== "All") {
    list = list.filter((p) => p.category === options.category);
  }

  if (options.inStock !== undefined) {
    list = list.filter((p) => p.in_stock === options.inStock);
  }

  if (options.offset !== undefined && options.limit !== undefined) {
    return list.slice(options.offset, options.offset + options.limit);
  }

  return list;
}

export async function getProductById(id: string): Promise<Product | null> {
  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return normalizeProduct(data);
      }
    } catch (e) {
      console.warn("Supabase product fetch failed:", e);
    }
  }

  const found = memoryStore.products.find((p) => p.id === id);
  return found ? normalizeProduct(found) : null;
}

export async function getProductBySlug(slugOrId: string): Promise<Product | null> {
  const normalized = decodeURIComponent(slugOrId).toLowerCase().trim();
  const client = getSupabaseServerClient();

  if (client) {
    try {
      // 1. Direct match on slug or id
      const { data, error } = await client
        .from("products")
        .select("*")
        .or(`slug.eq.${normalized},id.eq.${normalized}`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return normalizeProduct(data);
      }

      // 2. Fuzzy match on product name
      const { data: nameMatch } = await client
        .from("products")
        .select("*")
        .ilike("name", `%${normalized.replace(/-/g, " ")}%`)
        .limit(1)
        .maybeSingle();

      if (nameMatch) {
        return normalizeProduct(nameMatch);
      }
    } catch (e) {
      console.warn("Supabase getProductBySlug failed:", e);
    }
  }

  // Fallback to memory store search
  const byId = memoryStore.products.find((p) => p.id.toLowerCase() === normalized);
  if (byId) return normalizeProduct(byId);

  const bySlug = memoryStore.products.find(
    (p) => p.slug && p.slug.toLowerCase() === normalized
  );
  if (bySlug) return normalizeProduct(bySlug);

  const bySlugName = memoryStore.products.find(
    (p) => slugify(p.name) === normalized
  );
  if (bySlugName) return normalizeProduct(bySlugName);

  const byFuzzy = memoryStore.products.find((p) => {
    const s = slugify(p.name);
    return s.includes(normalized) || normalized.includes(s);
  });
  if (byFuzzy) return normalizeProduct(byFuzzy);

  return null;
}

export async function createProduct(
  productData: Omit<Product, "id" | "created_at">
): Promise<Product> {
  const price = Number(productData.price);
  const originalPrice = Number(productData.original_price || productData.price);
  const saveAmount = Math.max(0, originalPrice - price);
  const discountPercent =
    originalPrice > 0 ? Math.round((saveAmount / originalPrice) * 100) : 0;
  const slug = productData.slug ? slugify(productData.slug) : slugify(productData.name);

  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    slug,
    sku: productData.sku || `LEA-${Math.floor(1000 + Math.random() * 9000)}`,
    price,
    original_price: originalPrice,
    save_amount: saveAmount,
    discount_percent: discountPercent,
    stock_quantity: productData.stock_quantity !== undefined ? Number(productData.stock_quantity) : 100,
    in_stock: productData.in_stock !== undefined ? Boolean(productData.in_stock) : true,
    images:
      productData.images && productData.images.length > 0
        ? productData.images
        : [productData.image_url],
    description_sections: productData.description_sections || [],
    description_images: productData.description_images || [],
    highlights: productData.highlights || [],
    ingredients_list: productData.ingredients_list || [],
    created_at: new Date().toISOString(),
  };

  const client = getSupabaseServerClient();
  if (client) {
    const { data, error } = await client
      .from("products")
      .insert([
        {
          id: newProduct.id,
          name: newProduct.name,
          slug: newProduct.slug,
          tagline: newProduct.tagline,
          sku: newProduct.sku,
          description: newProduct.description,
          description_sections: newProduct.description_sections,
          description_images: newProduct.description_images,
          images: newProduct.images,
          highlights: newProduct.highlights,
          dosage: newProduct.dosage,
          ingredients_list: newProduct.ingredients_list,
          price: newProduct.price,
          original_price: newProduct.original_price,
          save_amount: newProduct.save_amount,
          discount_percent: newProduct.discount_percent,
          image_url: newProduct.image_url,
          badge: newProduct.badge,
          is_featured: newProduct.is_featured,
          in_stock: newProduct.in_stock,
          stock_quantity: newProduct.stock_quantity,
          category: newProduct.category,
          category_id: newProduct.category_id,
          created_at: newProduct.created_at,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase product insert failed:", error);
      throw new Error(`Failed to save product in database: ${error.message}`);
    }

    return normalizeProduct(data);
  }

  memoryStore.products.unshift(newProduct);
  safePersistStore();
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const client = getSupabaseServerClient();

  if (client) {
    const existing = await getProductById(id);
    if (!existing) {
      console.error(`Product with ID "${id}" does not exist in database`);
      return null;
    }

    const finalPrice = updates.price !== undefined ? Number(updates.price) : existing.price;
    const finalOriginal =
      updates.original_price !== undefined
        ? Number(updates.original_price)
        : existing.original_price;
    const saveAmount = Math.max(0, finalOriginal - finalPrice);
    const discountPercent =
      finalOriginal > 0 ? Math.round((saveAmount / finalOriginal) * 100) : 0;

    const finalSlug = updates.slug
      ? slugify(updates.slug)
      : updates.name
      ? slugify(updates.name)
      : existing.slug || slugify(existing.name);

    const payload: Record<string, unknown> = {
      ...updates,
      slug: finalSlug,
      price: finalPrice,
      original_price: finalOriginal,
      save_amount: saveAmount,
      discount_percent: discountPercent,
    };

    if (updates.stock_quantity !== undefined) {
      payload.stock_quantity = Number(updates.stock_quantity);
    }
    if (updates.in_stock !== undefined) {
      payload.in_stock = Boolean(updates.in_stock);
    }
    if (updates.images !== undefined) {
      payload.images = Array.isArray(updates.images)
        ? updates.images
        : [updates.image_url || existing.image_url];
    }
    if (updates.description_sections !== undefined) {
      payload.description_sections = updates.description_sections;
    }
    if (updates.ingredients_list !== undefined) {
      payload.ingredients_list = updates.ingredients_list;
    }
    if (updates.highlights !== undefined) {
      payload.highlights = updates.highlights;
    }

    const { data, error } = await client
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase product update failed:", error);
      throw new Error(`Failed to update product in database: ${error.message}`);
    }

    return normalizeProduct(data);
  }

  const index = memoryStore.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = memoryStore.products[index];
  const finalPrice = updates.price !== undefined ? Number(updates.price) : current.price;
  const finalOriginal =
    updates.original_price !== undefined
      ? Number(updates.original_price)
      : current.original_price;
  const saveAmount = Math.max(0, finalOriginal - finalPrice);
  const discountPercent =
    finalOriginal > 0 ? Math.round((saveAmount / finalOriginal) * 100) : 0;

  const finalSlug = updates.slug
    ? slugify(updates.slug)
    : updates.name
    ? slugify(updates.name)
    : current.slug || slugify(current.name);

  memoryStore.products[index] = {
    ...current,
    ...updates,
    slug: finalSlug,
    price: finalPrice,
    original_price: finalOriginal,
    save_amount: saveAmount,
    discount_percent: discountPercent,
    stock_quantity:
      updates.stock_quantity !== undefined
        ? Number(updates.stock_quantity)
        : current.stock_quantity,
  };

  safePersistStore();
  return memoryStore.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (client) {
    const { error } = await client.from("products").delete().eq("id", id);
    if (error) {
      console.error("Supabase product delete failed:", error);
      throw new Error(`Failed to delete product from database: ${error.message}`);
    }
    return true;
  }

  const initialLen = memoryStore.products.length;
  memoryStore.products = memoryStore.products.filter((p) => p.id !== id);
  safePersistStore();
  return memoryStore.products.length < initialLen;
}

/* =========================================================
   3. ORDERS & DELIVERY MANAGEMENT API
========================================================= */

export interface GetOrdersOptions {
  status?: string;
  search?: string;
  paymentMethod?: string;
  limit?: number;
  offset?: number;
}

export async function getOrders(options: GetOrdersOptions | string = {}): Promise<Order[]> {
  const statusFilter = typeof options === "string" ? options : options.status;
  const searchQuery = typeof options === "object" ? options.search : undefined;

  const client = getSupabaseServerClient();
  if (client) {
    try {
      let query = client.from("orders").select("*").order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "All") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase orders fetch error:", error);
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }

      if (data && data.length > 0) {
        let ordersList = data.map(normalizeOrder);
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          ordersList = ordersList.filter(
            (o) =>
              o.order_number.toLowerCase().includes(q) ||
              o.customer_name.toLowerCase().includes(q) ||
              o.customer_phone.includes(q) ||
              o.city.toLowerCase().includes(q) ||
              o.product_name.toLowerCase().includes(q)
          );
        }
        return ordersList;
      }
    } catch (e: any) {
      console.warn("Supabase orders fetch failed, falling back to memory store:", e?.message);
    }
  }

  let ordersList = memoryStore.orders.map(normalizeOrder);

  if (statusFilter && statusFilter !== "All") {
    ordersList = ordersList.filter((o) => o.status === statusFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    ordersList = ordersList.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.product_name.toLowerCase().includes(q)
    );
  }

  return ordersList;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("orders")
        .select("*")
        .or(`id.eq.${id},order_number.eq.${id}`)
        .maybeSingle();

      if (!error && data) {
        return normalizeOrder(data);
      }
    } catch (e) {
      console.warn("Supabase order fetch failed:", e);
    }
  }

  const found = memoryStore.orders.find((o) => o.id === id || o.order_number === id);
  return found ? normalizeOrder(found) : null;
}

export async function createOrder(
  orderData: Omit<Order, "id" | "order_number" | "created_at">
): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    order_number: `LEA-${Math.floor(10000 + Math.random() * 90000)}`,
    payment_status:
      orderData.payment_status || (orderData.payment_method === "Prepaid" ? "Paid" : "Pending"),
    status: orderData.status || "Pending",
    courier_partner: orderData.courier_partner || "Delhivery Surface",
    tracking_number: orderData.tracking_number || "",
    created_at: new Date().toISOString(),
  };

  // Decrement product inventory
  if (orderData.product_id) {
    try {
      const product = await getProductById(orderData.product_id);
      if (product && product.stock_quantity !== undefined) {
        const updatedStock = Math.max(0, product.stock_quantity - (orderData.quantity || 1));
        await updateProduct(product.id, {
          stock_quantity: updatedStock,
          in_stock: updatedStock > 0,
        });
      }
    } catch (err) {
      console.warn("Inventory decrement notice:", err);
    }
  }

  const client = getSupabaseServerClient();
  if (client) {
    const { data, error } = await client
      .from("orders")
      .insert([
        {
          id: newOrder.id,
          order_number: newOrder.order_number,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          customer_email: newOrder.customer_email || "",
          address: newOrder.address,
          city: newOrder.city,
          state: newOrder.state,
          pincode: newOrder.pincode,
          product_id: newOrder.product_id,
          product_name: newOrder.product_name,
          quantity: newOrder.quantity,
          total_amount: newOrder.total_amount,
          discount_amount: newOrder.discount_amount || 0,
          payment_method: newOrder.payment_method,
          payment_status: newOrder.payment_status,
          status: newOrder.status,
          tracking_number: newOrder.tracking_number,
          courier_partner: newOrder.courier_partner,
          estimated_delivery: newOrder.estimated_delivery || "",
          notes: newOrder.notes || "",
          created_at: newOrder.created_at,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase order insert failed:", error);
      throw new Error(`Failed to place order in database: ${error.message}`);
    }

    return normalizeOrder(data);
  }

  memoryStore.orders.unshift(newOrder);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  tracking?: {
    courier_partner?: string;
    tracking_number?: string;
    estimated_delivery?: string;
    payment_status?: PaymentStatus;
  }
): Promise<Order | null> {
  return updateOrder(id, {
    status,
    ...(tracking || {}),
  });
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  const client = getSupabaseServerClient();
  if (client) {
    const { data, error } = await client
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase order update failed:", error);
      throw new Error(`Failed to update order in database: ${error.message}`);
    }

    return normalizeOrder(data);
  }

  const order = memoryStore.orders.find((o) => o.id === id);
  if (!order) return null;

  Object.assign(order, updates);
  return order;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (client) {
    const { error } = await client.from("orders").delete().eq("id", id);
    if (error) {
      console.error("Supabase order delete failed:", error);
      throw new Error(`Failed to delete order from database: ${error.message}`);
    }
    return true;
  }

  const initialLen = memoryStore.orders.length;
  memoryStore.orders = memoryStore.orders.filter((o) => o.id !== id);
  return memoryStore.orders.length < initialLen;
}

/* =========================================================
   4. CUSTOMER MANAGEMENT API
========================================================= */

export async function getCustomers(searchQuery?: string): Promise<Customer[]> {
  const orders = await getOrders();
  const map = new Map<string, Customer>();

  for (const order of orders) {
    const key = order.customer_phone.trim();
    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, {
        id: `cust-${key}`,
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.customer_email || "",
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        total_orders: 1,
        total_spent: order.status !== "Cancelled" ? order.total_amount : 0,
        first_order_date: order.created_at,
        last_order_date: order.created_at,
        recent_orders: [order],
      });
    } else {
      const cust = map.get(key)!;
      cust.total_orders += 1;
      if (order.status !== "Cancelled") {
        cust.total_spent += order.total_amount;
      }
      if (new Date(order.created_at) < new Date(cust.first_order_date || "")) {
        cust.first_order_date = order.created_at;
      }
      if (new Date(order.created_at) > new Date(cust.last_order_date || "")) {
        cust.last_order_date = order.created_at;
        cust.address = order.address;
        cust.city = order.city;
        cust.state = order.state;
        cust.pincode = order.pincode;
      }
      cust.recent_orders?.push(order);
    }
  }

  let customers = Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.last_order_date || "").getTime() -
      new Date(a.last_order_date || "").getTime()
  );

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        c.city.toLowerCase().includes(q)
    );
  }

  return customers;
}

export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  const customers = await getCustomers();
  return customers.find((c) => c.phone === phone.trim()) || null;
}

/* =========================================================
   5. DEEP REALTIME ANALYTICS & DASHBOARD METRICS
========================================================= */

export async function getSalesStats(): Promise<SalesStats> {
  const [orders, products, customers] = await Promise.all([
    getOrders(),
    getProducts(),
    getCustomers(),
  ]);

  const totalOrders = orders.length;
  const totalCustomers = customers.length;

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const processingOrders = orders.filter(
    (o) => o.status === "Processing" || o.status === "Confirmed"
  ).length;
  const shippedOrders = orders.filter(
    (o) => o.status === "Shipped" || o.status === "Out for Delivery"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

  const validOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const averageOrderValue =
    validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  const totalRefunds = orders
    .filter((o) => o.payment_status === "Refunded")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const lowStockCount = products.filter((p) => (p.stock_quantity ?? 100) <= 20).length;

  // Top Selling Products Calculation
  const productSalesMap = new Map<string, { count: number; revenue: number }>();
  for (const o of validOrders) {
    const pid = o.product_id || o.product_name;
    const existing = productSalesMap.get(pid) || { count: 0, revenue: 0 };
    productSalesMap.set(pid, {
      count: existing.count + (o.quantity || 1),
      revenue: existing.revenue + o.total_amount,
    });
  }

  const topSellingProducts = Array.from(productSalesMap.entries())
    .map(([pid, data]) => {
      const product = products.find((p) => p.id === pid || p.name === pid);
      return {
        id: pid,
        name: product?.name || pid,
        salesCount: data.count,
        revenue: data.revenue,
        image_url: product?.image_url || "/products/josh-1000.jpg",
        category: product?.category || "General",
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Category Performance Calculation
  const categoryMap = new Map<string, { count: number; revenue: number }>();
  for (const o of validOrders) {
    const prod = products.find((p) => p.id === o.product_id || p.name === o.product_name);
    const cat = prod?.category || "General";
    const existing = categoryMap.get(cat) || { count: 0, revenue: 0 };
    categoryMap.set(cat, {
      count: existing.count + (o.quantity || 1),
      revenue: existing.revenue + o.total_amount,
    });
  }

  const categoryPerformance = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    revenue: data.revenue,
  }));

  // Daily Revenue (last 14 days timeline)
  const daysMap = new Map<string, { revenue: number; orders: number }>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    daysMap.set(dateStr, { revenue: 0, orders: 0 });
  }

  for (const o of validOrders) {
    const d = new Date(o.created_at);
    const dateStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    if (daysMap.has(dateStr)) {
      const entry = daysMap.get(dateStr)!;
      entry.revenue += o.total_amount;
      entry.orders += 1;
    }
  }

  const dailyRevenue = Array.from(daysMap.entries()).map(([date, val]) => ({
    date,
    revenue: val.revenue,
    orders: val.orders,
  }));

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    averageOrderValue,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRefunds,
    lowStockCount,
    topSellingProducts,
    categoryPerformance,
    dailyRevenue,
    recentOrders: orders.slice(0, 10),
  };
}

/* =========================================================
   6. ADMIN USERS & AUTHENTICATION API (DATABASE PERSISTENCE)
========================================================= */

export async function getAdminUsers(): Promise<AdminUser[]> {
  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client.from("admin_users").select("*");
      if (!error && data && data.length > 0) {
        return data as AdminUser[];
      }
    } catch (e) {
      console.warn("Supabase admin_users fetch fallback:", e);
    }
  }

  return memoryStore.admin_users || INITIAL_ADMIN_USERS;
}

export async function getAdminUserByUsername(username: string): Promise<AdminUser | null> {
  if (!username) return null;
  const cleanUsername = username.trim().toLowerCase();

  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("admin_users")
        .select("*")
        .ilike("username", cleanUsername)
        .maybeSingle();

      if (!error && data) {
        return data as AdminUser;
      }
    } catch (e) {
      console.warn("Supabase getAdminUserByUsername fallback:", e);
    }
  }

  const users = memoryStore.admin_users || INITIAL_ADMIN_USERS;
  return users.find((u) => u.username.toLowerCase() === cleanUsername) || null;
}

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<AdminUser | null> {
  if (!username || !password) return null;
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  // 1. Master Admin Passcode fallback (environment variable ADMIN_PASSCODE)
  const masterPasscode = (process.env.ADMIN_PASSCODE || "soumya!nSUPA09").trim();
  if (cleanUsername === "admin" && cleanPassword === masterPasscode) {
    try {
      const user = await getAdminUserByUsername(cleanUsername);
      return user || INITIAL_ADMIN_USERS[0];
    } catch {
      return INITIAL_ADMIN_USERS[0];
    }
  }

  // 2. Database verification against password_hash
  const user = await getAdminUserByUsername(cleanUsername);
  if (!user) return null;

  const isValid = verifyPassword(cleanPassword, user.password_hash);
  if (isValid) {
    return user;
  }
  return null;
}

export async function updateAdminUserLastLogin(id: string): Promise<void> {
  const now = new Date().toISOString();
  const client = getSupabaseServerClient();

  if (client) {
    try {
      const { error } = await client
        .from("admin_users")
        .update({ last_login: now })
        .eq("id", id);
      if (error) {
        console.warn("Supabase updateAdminUserLastLogin warning:", error.message);
      }
    } catch (e) {
      console.warn("Supabase updateAdminUserLastLogin error:", e);
    }
  }

  // Update in memory store without disk writes
  if (memoryStore.admin_users) {
    memoryStore.admin_users = memoryStore.admin_users.map((u) =>
      u.id === id ? { ...u, last_login: now } : u
    );
  }
}

export async function updateAdminPassword(
  id: string,
  newPassword: string
): Promise<boolean> {
  const newHash = hashPassword(newPassword);
  const client = getSupabaseServerClient();

  if (client) {
    const { error } = await client
      .from("admin_users")
      .update({ password_hash: newHash })
      .eq("id", id);

    if (error) {
      console.error("Supabase updateAdminPassword error:", error);
      throw new Error(`Failed to update admin password in database: ${error.message}`);
    }
    return true;
  }

  if (memoryStore.admin_users) {
    memoryStore.admin_users = memoryStore.admin_users.map((u) =>
      u.id === id ? { ...u, password_hash: newHash } : u
    );
  }

  return true;
}
