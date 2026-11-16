import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Gift, HeartHandshake } from "lucide-react";
import { getProduct, products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductActions from "@/components/products/ProductActions";
import ProductCard from "@/components/products/ProductCard";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return { title: product?.name ?? "Product not found", description: product?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const category = categories.find((item) => item.slug === product.category);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return (
    <>
      <section className="shell product-detail">
        <Link href="/shop" className="back-link"><ArrowLeft size={15} /> Back to all finds</Link>
        <div className="product-detail-layout">
          <div className="product-detail-image" role="img" aria-label={product.name} style={{ backgroundImage: `url("${product.image}")` }}>
            <span className="product-tag detail-tag">A Mihu favourite</span>
          </div>
          <div className="product-detail-copy">
            <span className="eyebrow">{category?.name ?? product.category}</span>
            <h1>{product.name}</h1>
            <div className="detail-price"><strong>₹{product.price.toLocaleString("en-IN")}</strong>{product.compareAtPrice && <del>₹{product.compareAtPrice.toLocaleString("en-IN")}</del>}<span>Taxes included</span></div>
            <p className="detail-description">{product.description}</p>
            <div className="detail-material"><span>Finish</span><strong>{product.material}</strong></div>
            <ProductActions product={product} />
            <div className="product-perks">
              <div><Gift size={18} /><span><b>Giftable joy</b><small>Lovely for birthdays and little surprises.</small></span></div>
              <div><HeartHandshake size={18} /><span><b>Picked with care</b><small>Questions? Send us an enquiry anytime.</small></span></div>
              <div><Check size={18} /><span><b>Need more details?</b><small><Link href="/enquiry">Ask us about this piece ↗</Link></small></span></div>
            </div>
            <p className="no-checkout-note">Online payments and order placement are not available on this demo storefront.</p>
          </div>
        </div>
      </section>
      <section className="section shell related-section">
        <div className="section-heading"><div><span className="eyebrow">More to make you smile</span><h2>You might also love</h2></div><Link href={`/categories/${product.category}`} className="inline-link">More {category?.name.toLowerCase()} <span>↗</span></Link></div>
        <div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
      </section>
    </>
  );
}
