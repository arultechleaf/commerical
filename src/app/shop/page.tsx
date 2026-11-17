import type { Metadata } from "next";
import { connection } from "next/server";
import { getProducts } from "@/lib/productStore";
import ProductCatalog from "@/components/products/ProductCatalog";

export const metadata: Metadata = { title: "Shop all" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; min?: string; max?: string; filter?: string; cat?: string }> }) {
  await connection();
  const products = await getProducts();
  const { q = "", min, max, filter = "all", cat = "all" } = await searchParams;
  return (
    <section className="section shell shop-page">
      <div className="page-heading">
        <span className="eyebrow">The Mithu collection</span>
        <h1>Find your next little favourite</h1>
        <p>Cute, trendy and stylish finds, ready to make someone smile.</p>
      </div>
      <ProductCatalog
        key={`${q}|${min}|${max}|${filter}|${cat}`}
        initialCategory={cat}
        products={products}
        initialQuery={q}
        initialMin={min ? Number(min) : undefined}
        initialMax={max ? Number(max) : undefined}
        initialFilter={filter}
      />
    </section>
  );
}
