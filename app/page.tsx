import React from "react";
import { getProducts } from "@/lib/db";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProductsSection } from "@/components/landing/Products";
import { About } from "@/components/landing/About";
import { Ingredients } from "@/components/landing/Ingredients";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CustomerReviews } from "@/components/landing/CustomerReviews";
import { Faqs } from "@/components/landing/Faqs";
import { StickyCallButton } from "@/components/landing/StickyCallButton";
import { Footer } from "@/components/landing/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header />
      <main className="flex-1">
        <Hero initialProducts={products} />
        <ProductsSection initialProducts={products} />
        <About />
        <Ingredients />
        <HowItWorks />
        <CustomerReviews />
        <Faqs />
      </main>
      <Footer />
      <StickyCallButton />
    </div>
  );
}
