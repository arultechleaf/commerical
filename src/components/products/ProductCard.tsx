"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) => state.wishlist.includes(product.id));

  return (
    <article className="product-card">
      <div
        className="product-photo"
        role="img"
        aria-label={product.name}
        style={{ backgroundImage: `url("${product.image}")` }}
      >
        {product.newArrival && <span className="product-tag">Just arrived</span>}
        <button
          className={`wishlist-button ${saved ? "is-saved" : ""}`}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => dispatch(toggleWishlist(product.id))}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <button className="quick-add" onClick={() => dispatch(addToCart(product.id))}>
          <ShoppingBag size={15} /> Quick add
        </button>
      </div>
      <div className="product-card-info">
        <Link href={`/products/${product.id}`} className="product-title">{product.name}</Link>
        <div className="product-price">
          <span>₹{product.price.toLocaleString("en-IN")}</span>
          {product.compareAtPrice && <del>₹{product.compareAtPrice.toLocaleString("en-IN")}</del>}
        </div>
      </div>
    </article>
  );
}
