import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { connection } from "next/server";
import { getProducts } from "@/lib/productStore";
import ProductCatalog from "@/components/products/ProductCatalog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  return { title: category?.name ?? "Category not found", description: category?.description };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ min?: string; max?: string; q?: string }> }) {
  await connection();
  const products = await getProducts();
  const { slug } = await params;
  const { min, max, q = "" } = await searchParams;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  return (
    <section className="section shell shop-page">
      <div className="category-hero">
        <div className="category-hero-photo" role="img" aria-label={category.name} style={{ backgroundImage: `url("${category.image}")` }} />
        <div><span className="eyebrow">A little Mithu magic</span><h1>{category.name}</h1><p>{category.description}</p></div>
      </div>
      <ProductCatalog
        key={`${slug}|${min}|${max}|${q}`}
        initialQuery={q}
        products={products}
        initialCategory={category.slug}
        initialMin={min ? Number(min) : undefined}
        initialMax={max ? Number(max) : undefined}
      />
    </section>
  );
}
