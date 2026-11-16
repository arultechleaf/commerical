import type { Metadata } from "next";
import { connection } from "next/server";
import { getProducts } from "@/lib/productStore";
import ProductCatalog from "@/components/products/ProductCatalog";

export const metadata: Metadata = { title: "Shop all" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await connection();
  const products = await getProducts();
  const { q = "" } = await searchParams;
  return (
    <section className="section shell shop-page">
      <div className="page-heading">
        <span className="eyebrow">The Mithu collection</span>
        <h1>Find your next little favourite</h1>
        <p>Cute, trendy and stylish finds, ready to make someone smile.</p>
      </div>
      <ProductCatalog products={products} initialQuery={q} />
    </section>
  );
}
