import { redirect, notFound } from "next/navigation";
import { getProductById, getProductBySlug, getProducts, slugify } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LegacyProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = (await getProductById(id)) || (await getProductBySlug(id));

  if (!product) {
    redirect("/");
  }

  redirect(`/product/${product.slug || slugify(product.name)}`);
}
