/**
 * /checkout — Redirected to home page.
 *
 * Checkout is now fully handled by Shiprocket Checkout (fastrr widget).
 * When a user clicks "Buy Now", the fastrr.js script opens the
 * Shiprocket 1-click checkout overlay directly.
 *
 * This page redirects any direct visits back to the homepage.
 */
import { redirect } from "next/navigation";

export default function CheckoutPage() {
  redirect("/");
}
