import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { categories } from "@/data/categories";
import { connection } from "next/server";
import { getProducts } from "@/lib/productStore";
import { isNewArrival } from "@/lib/isNew";
import ProductCard from "@/components/products/ProductCard";

export default async function Home() {
  await connection();
  const products = await getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 8);
  const newArrivals = products
    .filter((product) => isNewArrival(product))
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .slice(0, 3);
  return (
    <>
      <section className="hero-section">
        <div className="hero-backdrop" />
        <div className="shell hero-content">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><Sparkles size={14} /> A little something lovely</span>
            <h1>For your <em>everyday</em><br />kind of magic.</h1>
            <p>Sweet accessories, pretty chains and happy little details. Find the piece that feels just like you.</p>
            <div className="hero-buttons">
              <Link href="/shop" className="button button-dark">Shop the collection <ArrowRight size={16} /></Link>
              <Link href="/about" className="hero-story-link">Meet Mithu <span>↗</span></Link>
            </div>
            <div className="hero-note"><span className="hero-note-icon"><Heart size={14} fill="currentColor" /></span> Picked with love, just for you</div>
          </div>
          <div className="hero-art">
            <div className="hero-photo" role="img" aria-label="A collection of pretty gold and pearl jewellery" />
            <div className="hero-logo-card"><Image src="/logo/logo.jpg" alt="Mithu Cute Corner logo" width={104} height={104} /></div>
            <div className="hero-sticker">Cute<br /><span>looks good<br />on you!</span> ✦</div>
          </div>
        </div>
        <div className="hero-bottom shell"><span>♡</span> Little things. Big smiles. <span>♡</span></div>
      </section>

      <section className="section shell category-section">
        <div className="section-heading">
          <div><span className="eyebrow">Find your favourite</span><h2>A corner for every kind of cute</h2></div>
          <Link href="/shop" className="inline-link">See everything <ArrowRight size={15} /></Link>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link className={`category-card category-card-${index + 1}`} href={`/categories/${category.slug}`} key={category.slug}>
              <div className="category-photo" role="img" aria-label={category.name} style={{ backgroundImage: `url("${category.image}")` }} />
              <div className="category-card-copy"><span>{category.name}</span><small>{category.description}</small><b>Explore <ArrowRight size={14} /></b></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section featured-section">
        <div className="shell">
          <div className="section-heading">
            <div><span className="eyebrow">The ones you’ll love</span><h2>Little favourites</h2><p className="section-subtitle">A few hand-picked pieces to make your day a bit brighter.</p></div>
            <Link href="/shop" className="inline-link">Shop all 300 finds <ArrowRight size={15} /></Link>
          </div>
          <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="section new-section">
        <div className="shell">
          <div className="section-heading">
            <div><span className="eyebrow new-eyebrow"><span className="new-dot" /> Just landed</span><h2>New arrivals</h2><p className="section-subtitle">Fresh off the shelf, and more cute things on the way.</p></div>
            <Link href="/shop?filter=new" className="inline-link">See all new <ArrowRight size={15} /></Link>
          </div>
          <div className="new-grid">
            {newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}
            <Link href="/enquiry" className="coming-soon-card">
              <span className="coming-soon-art" aria-hidden="true">🦋</span>
              <small>Coming soon</small>
              <strong>Something new is on its way</strong>
              <em>Ask to be first to know <ArrowRight size={14} /></em>
            </Link>
          </div>
        </div>
      </section>

      <section className="story-strip shell">
        <div className="story-strip-art"><span>♡</span><span>✦</span><span>♡</span></div>
        <div className="story-strip-copy"><span className="eyebrow">A note from our corner</span><h2>Made to bring a little joy.</h2><p>We believe the smallest things can make the happiest memories. Every Mithu find is chosen to help you celebrate your own style and the people you love.</p><Link href="/about" className="inline-link">A little more about us <ArrowRight size={15} /></Link></div>
        <div className="story-strip-badge">Cute<br />Trendy<br />Stylish</div>
      </section>

      <section className="newsletter-band">
        <div className="shell newsletter-inner">
          <div><span className="eyebrow">A little love in your inbox</span><h2>Stay in our cute little loop</h2><p>New finds, gift ideas and happy updates. No noise, just the good stuff.</p></div>
          <Link href="/enquiry" className="button button-dark">Say hello to Mithu <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
