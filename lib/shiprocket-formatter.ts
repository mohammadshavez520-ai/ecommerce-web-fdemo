import crypto from "crypto";
import { Product, Category } from "@/lib/types";

/**
 * Converts a string or numeric ID into a stable positive long integer.
 * Shiprocket / Shopify schema requires `id` and `variants[].id` to be long integers.
 */
export function toNumericId(id: string | number, offset: number = 0): number {
  if (typeof id === "number" && !isNaN(id)) return id + offset;

  const knownMap: Record<string, number> = {
    "prod-josh-1000": 6329101,
    "prod-time-master": 6329102,
    "prod-stop-sugar": 6329103,
    "prod-diasure-powder": 6329104,
    "cat-vitality": 4828601,
    "cat-diabetes": 4828602,
    "cat-combos": 4828603,
  };

  const str = String(id || "").trim();
  if (knownMap[str]) {
    return knownMap[str] + offset;
  }

  // Deterministic 32-bit positive integer hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return ((hash % 800000000) + 100000000) + offset;
}

/**
 * Calculates HMAC-SHA256 signature encoded in Base64 for Shiprocket API requests.
 */
export function calculateShiprocketHmac(secretKey: string, bodyString: string): string {
  return crypto.createHmac("sha256", secretKey).update(bodyString).digest("base64");
}

/**
 * Transforms an internal Product into the exact Shiprocket / Shopify Catalog JSON format
 * as specified in Shiprocket Postman Documenter (2sB34bL3ig) & Integration Guide.
 */
export function formatShiprocketProduct(p: Product, baseUrl: string = "https://leaforaherbal.com") {
  const numericProductId = toNumericId(p.id);
  const numericVariantId = toNumericId(p.id, 10000000);

  const primaryImage =
    p.image_url ||
    (p.images && p.images.length > 0 ? p.images[0] : "") ||
    `${baseUrl}/logo.png`;

  const priceStr = Number(p.price || 0).toFixed(2);
  const originalPriceStr = Number(p.original_price || p.price || 0).toFixed(2);

  // Generate safe HTML description
  let bodyHtml = p.description || "";
  if (!bodyHtml.startsWith("<")) {
    bodyHtml = `<p>${(p.description || p.tagline || p.name).replace(/\n/g, "<br/>")}</p>`;
  }

  // Tags as comma-separated string
  const tagsList = [
    ...(p.highlights || []).slice(0, 5),
    p.category || "Ayurvedic",
    p.badge || "",
  ]
    .filter(Boolean)
    .join(", ");

  const createdAt = p.created_at || new Date().toISOString();

  return {
    id: numericProductId,
    title: p.name || "",
    body_html: bodyHtml,
    vendor: "Leafora Herbal",
    product_type: p.category || "Ayurvedic Formulations",
    created_at: createdAt,
    handle: p.slug || p.id,
    updated_at: createdAt,
    tags: tagsList,
    status: p.in_stock ? "active" : "draft",
    variants: [
      {
        id: numericVariantId,
        title: "Default Title",
        price: priceStr,
        compare_at_price: originalPriceStr,
        sku: p.sku || `LEA-${numericProductId}`,
        quantity: p.stock_quantity ?? 100,
        created_at: createdAt,
        updated_at: createdAt,
        taxable: true,
        option_values: {
          Title: "Default Title",
        },
        grams: 500,
        image: {
          src: primaryImage,
        },
        weight: 0.5,
        weight_unit: "kg",
      },
    ],
    image: {
      src: primaryImage,
    },
    options: [
      {
        name: "Title",
        values: ["Default Title"],
      },
    ],
  };
}

/**
 * Transforms an internal Category into the exact Shiprocket Collection format
 * as specified in Shiprocket Postman Documenter (2sB34bL3ig).
 */
export function formatShiprocketCollection(c: Category, baseUrl: string = "https://leaforaherbal.com") {
  const numericCollectionId = toNumericId(c.id);
  const imageSrc = c.image_url || `${baseUrl}/logo.png`;
  const createdAt = c.created_at || new Date().toISOString();

  return {
    id: numericCollectionId,
    updated_at: createdAt,
    body_html: `<p>${c.description || c.name}</p>`,
    handle: c.slug || c.id,
    image: {
      src: imageSrc,
    },
    title: c.name,
    created_at: createdAt,
  };
}

/**
 * Pushes product updates to Shiprocket's Real-time Catalog Webhook.
 * Triggered automatically whenever a product is added or updated in the Admin Panel.
 */
export async function pushProductToShiprocket(p: Product): Promise<boolean> {
  const apiKey = process.env.SHIPROCKET_CHECKOUT_API_KEY;
  const secretKey = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;

  if (!apiKey || !secretKey || apiKey === "your_api_key_here") {
    // If keys not set, Shiprocket still receives the product via the dynamic GET /api/shiprocket/products sync API.
    return false;
  }

  try {
    const formatted = formatShiprocketProduct(p);
    const payload = {
      id: formatted.id,
      title: formatted.title,
      body_html: formatted.body_html,
      vendor: formatted.vendor,
      product_type: formatted.product_type,
      updated_at: formatted.updated_at,
      status: formatted.status,
      variants: formatted.variants.map((v) => ({
        id: v.id,
        title: v.title,
        price: v.price,
        quantity: v.quantity,
        sku: v.sku,
        updated_at: v.updated_at,
        image: v.image,
        weight: v.weight,
      })),
      image: formatted.image,
    };

    const bodyString = JSON.stringify(payload);
    const hmac = calculateShiprocketHmac(secretKey, bodyString);

    const response = await fetch("https://checkout-api.shiprocket.com/wh/v1/custom/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
        "X-Api-HMAC-SHA256": hmac,
      },
      body: bodyString,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[Shiprocket Webhook] Product push warning (${response.status}):`, errText);
      return false;
    }

    console.log(`[Shiprocket Webhook] Successfully pushed product ${p.name} (ID: ${formatted.id})`);
    return true;
  } catch (err: any) {
    console.error("[Shiprocket Webhook] Failed to push product to Shiprocket:", err?.message || err);
    return false;
  }
}

/**
 * Pushes category updates to Shiprocket's Real-time Collection Webhook.
 * Triggered automatically whenever a category is added or updated in the Admin Panel.
 */
export async function pushCollectionToShiprocket(c: Category): Promise<boolean> {
  const apiKey = process.env.SHIPROCKET_CHECKOUT_API_KEY;
  const secretKey = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;

  if (!apiKey || !secretKey || apiKey === "your_api_key_here") {
    return false;
  }

  try {
    const formatted = formatShiprocketCollection(c);
    const bodyString = JSON.stringify(formatted);
    const hmac = calculateShiprocketHmac(secretKey, bodyString);

    const response = await fetch("https://checkout-api.shiprocket.com/wh/v1/custom/collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
        "X-Api-HMAC-SHA256": hmac,
      },
      body: bodyString,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[Shiprocket Webhook] Collection push warning (${response.status}):`, errText);
      return false;
    }

    console.log(`[Shiprocket Webhook] Successfully pushed collection ${c.name} (ID: ${formatted.id})`);
    return true;
  } catch (err: any) {
    console.error("[Shiprocket Webhook] Failed to push collection to Shiprocket:", err?.message || err);
    return false;
  }
}
