import type { Metadata } from "next";
import ProductCatalog from "@/components/products/ProductCatalog";

export const metadata: Metadata = { title: "Shop all" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return (
    <section className="section shell shop-page">
      <div className="page-heading">
        <span className="eyebrow">The Mihu collection</span>
        <h1>Find your next little favourite</h1>
        <p>Three hundred cute, trendy and stylish finds, ready to make someone smile.</p>
      </div>
      <ProductCatalog initialQuery={q} />
    </section>
  );
}
