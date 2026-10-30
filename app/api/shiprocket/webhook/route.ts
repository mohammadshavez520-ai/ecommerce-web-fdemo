/**
 * Shiprocket Checkout — Order Webhook API
 *
 * Endpoint  : POST /api/shiprocket/webhook
 * Reference : Shiprocket Postman Documenter (2sB34bL3ig) - Order Webhook
 *
 * Triggered by Shiprocket Checkout automatically when a customer completes
 * an order (COD or Prepaid). Creates the order in your database and updates inventory.
 */

import { NextResponse } from "next/server";
import { createOrder, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderId = body.fastrr_order_id || body.order_id || `SR-${Date.now()}`;
    const shipping = body.shipping_address || body.billing_address || {};

    const firstName = shipping.first_name || "";
    const lastName = shipping.last_name || "";
    const customerName = `${firstName} ${lastName}`.trim() || body.name || "Valued Customer";

    const customerPhone = shipping.phone || body.phone || "";
    const customerEmail = shipping.email || body.email || "";

    const addressLine1 = shipping.line1 || shipping.address1 || "";
    const addressLine2 = shipping.line2 || shipping.address2 || "";
    const fullAddress = `${addressLine1} ${addressLine2}`.trim() || "Address on Shiprocket Panel";

    const city = shipping.city || "India";
    const state = shipping.state || "India";
    const pincode = shipping.pincode || shipping.zip || "000000";

    const totalAmount = Number(body.total_amount_payable || body.subtotal_price || 0);
    const paymentMethod = body.payment_type === "PREPAID" ? "Prepaid" : "COD";
    const paymentStatus = body.payment_status === "Success" || body.payment_type === "PREPAID" ? "Paid" : "Pending";

    // Extract item details
    const items = body.cart_data?.items || [];
    let productName = "Leafora Ayurvedic Formulation";
    let productId = "prod-josh-1000";
    let quantity = 1;

    if (items.length > 0) {
      quantity = Number(items[0].quantity || 1);
      const variantId = String(items[0].variant_id || "");

      // Try matching product from DB
      const allProducts = await getProducts();
      const matched = allProducts.find((p) => p.sku === variantId || p.id.includes(variantId));
      if (matched) {
        productName = matched.name;
        productId = matched.id;
      }
    }

    const newOrder = await createOrder({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      address: fullAddress,
      city,
      state,
      pincode,
      product_id: productId,
      product_name: productName,
      quantity,
      total_amount: totalAmount,
      discount_amount: Number(body.total_discount || 0),
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      status: "Confirmed",
      courier_partner: "Shiprocket Express",
      notes: `Shiprocket Order ID: ${orderId}`,
    });

    console.log(`[Shiprocket Webhook] Successfully recorded order #${newOrder.order_number}`);

    return NextResponse.json({
      success: true,
      message: "Order received and saved successfully",
      order_number: newOrder.order_number,
    });
  } catch (err: any) {
    console.error("[Shiprocket Order Webhook Exception]", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
