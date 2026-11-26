import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { categories } from "@/data/categories";
import { connection } from "next/server";
import { getProducts } from "@/lib/productStore";
import { isNewArrival } from "@/lib/isNew";
import ProductCard from "@/components/products/ProductCard";
import ImageMarquee from "@/components/home/ImageMarquee";
import NewArrivalSpotlight from "@/components/home/NewArrivalSpotlight";
import { getSlides } from "@/lib/marqueeStore";

export default async function Home() {
  await connection();
  const products = await getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 8);
  const newArrivals = products
    .filter((product) => isNewArrival(product))
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .slice(0, 3);
  // Newest "just arrived" product for the big spotlight card (falls back to the newest product overall).
  const spotlight = newArrivals[0] ?? [...products].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))[0];
  // Enough copies of the categories to be wider than any screen.
  const categoryLoop = Array.from({ length: Math.ceil(8 / categories.length) }, () => categories).flat();
  const chosen = (await getSlides()).filter((slide) => slide.image);
  const slides = chosen.length
    ? chosen
    : featured.slice(0, 5).map((product) => {
        const off = product.compareAtPrice && product.compareAtPrice > product.price
          ? Math.round((1 - product.price / product.compareAtPrice) * 100)
          : 0;
        return {
          image: product.image,
          title: product.name,
          link: `/products/${product.id}`,
          offer: off ? `${off}% OFF` : "",
          price: product.price,
          oldPrice: off ? product.compareAtPrice : undefined,
          productId: product.id,
        };
      });
  return (
    <>
      <ImageMarquee slides={slides} />

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
      </section>
      {/* Category cards scroll in an endless loop (list drawn twice, track moves by one copy). */}
      <div className="category-marquee">
        <div className="category-track">
          {[...categoryLoop, ...categoryLoop].map((category, index) => (
            <Link
              className="category-card"
              href={`/categories/${category.slug}`}
              key={index}
              aria-hidden={index >= categories.length || undefined}
              tabIndex={index >= categories.length ? -1 : undefined}
            >
              <div className="category-photo" role="img" aria-label={category.name} style={{ backgroundImage: `url("${category.image}")` }} />
              <div className="category-card-copy"><span>{category.name}</span><small>{category.description}</small><b>Explore <ArrowRight size={14} /></b></div>
            </Link>
          ))}
        </div>
      </div>

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
            <div><span className="eyebrow new-eyebrow"><span className="new-dot" /> Just landed</span><h2>New <em className="new-title-accent">arrivals</em></h2><p className="section-subtitle">Fresh off the shelf, and more cute things on the way.</p></div>
            <Link href="/shop?filter=new" className="see-new-pill">See all new <ArrowRight size={15} /></Link>
          </div>
          <div className="spotlight-row">
            {spotlight && <NewArrivalSpotlight product={spotlight} />}
            <div className="soon-card">
              <span className="soon-art" aria-hidden="true"><Sparkles size={30} fill="currentColor" /></span>
              <small>Coming soon</small>
              <strong>Something new is on its way</strong>
              <Link href="/enquiry" className="soon-button">Ask to be first to know</Link>
            </div>
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
