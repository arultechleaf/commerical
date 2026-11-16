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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const products = await getProducts();
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  return (
    <section className="section shell shop-page">
      <div className="category-hero">
        <div className="category-hero-photo" role="img" aria-label={category.name} style={{ backgroundImage: `url("${category.image}")` }} />
        <div><span className="eyebrow">A little Mithu magic</span><h1>{category.name}</h1><p>{category.description}</p></div>
      </div>
      <ProductCatalog products={products} initialCategory={category.slug} />
    </section>
  );
}
