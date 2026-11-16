"use client";

import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import { useAppSelector } from "@/redux/hooks";

export default function WishlistContent() {
  const wishlist = useAppSelector((state) => state.wishlist);
  const saved = products.filter((product) => wishlist.includes(product.id));
  if (!saved.length) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">♡</span>
        <h2>Your wishlist is full of possibilities</h2>
        <p>Tap the little heart on anything you love and we’ll keep it here while you browse.</p>
        <Link href="/shop" className="button button-dark">Find your favourites</Link>
      </div>
    );
  }
  return <div className="product-grid">{saved.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
