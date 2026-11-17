"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { isNewArrival } from "@/lib/isNew";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) => state.wishlist.includes(product.id));
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <article className="product-card">
      <div
        className="product-photo"
        role="img"
        aria-label={product.name}
        style={{ backgroundImage: `url("${product.image}")` }}
      >
        <Link
          href={`/products/${product.id}`}
          className="product-image-link"
          aria-label={`View ${product.name}`}
        />
        {discount > 0 ? (
          <span className="sale-badge">-{discount}%</span>
        ) : isNewArrival(product) ? (
          <span className="product-tag">Just arrived</span>
        ) : null}
        <div className="product-actions">
          <button
            className="add-to-cart-button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => dispatch(addToCart(product.id))}
          >
            <ShoppingCart size={24} strokeWidth={2.2} />
          </button>
          <button
            className={`wishlist-button ${saved ? "is-saved" : ""}`}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            onClick={() => dispatch(toggleWishlist(product.id))}
          >
            <Heart size={24} strokeWidth={2.2} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <div className="product-card-info">
        <Link href={`/products/${product.id}`} className="product-title">{product.name}</Link>
        <span className="product-code">Code: {product.id.toUpperCase()}</span>
        <div className="product-price">
          {product.compareAtPrice && <del>₹{product.compareAtPrice.toLocaleString("en-IN")}</del>}
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          <span className="price-unit">/pcs</span>
        </div>
      </div>
    </article>
  );
}
