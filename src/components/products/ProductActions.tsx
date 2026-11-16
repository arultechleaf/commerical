"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";
import type { Product } from "@/types/product";

export default function ProductActions({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) => state.wishlist.includes(product.id));
  return (
    <div className="detail-actions">
      <button className="button button-dark" onClick={() => dispatch(addToCart(product.id))}>
        <ShoppingBag size={17} /> Add to bag
      </button>
      <button className={`button button-outline save-detail ${saved ? "is-saved" : ""}`} onClick={() => dispatch(toggleWishlist(product.id))}>
        <Heart size={17} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    </div>
  );
}
