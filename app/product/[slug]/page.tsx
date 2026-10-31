import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/db";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { StickyCallButton } from "@/components/landing/StickyCallButton";
import { ArrowLeft } from "lucide-react";
import { ProductDetailsClient } from "@/app/products/[id]/ProductDetailsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />

      <main className="flex-1 py-4 sm:py-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-gray-500 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-emerald-700 flex items-center gap-1 shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/#hvProducts" className="hover:text-emerald-700 shrink-0">
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold truncate max-w-[180px] sm:max-w-none">{product.name}</span>
          </nav>

          <ProductDetailsClient product={product} allProducts={allProducts} />
        </div>
      </main>

      <Footer />
      <StickyCallButton className="hidden md:flex" />
    </div>
  );
}
