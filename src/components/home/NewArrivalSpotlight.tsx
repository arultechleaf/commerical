"use client";

import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import ProductImage from "@/components/products/ProductImage";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";

// Big "New this week" card: photo on the left, deep plum panel with price and buttons on the right.
export default function NewArrivalSpotlight({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);
  const old = product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice : undefined;
  const off = old ? Math.round((1 - product.price / old) * 100) : 0;

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <article className="spotlight-card">
      <Link href={`/products/${product.id}`} className="spotlight-photo" aria-label={`View ${product.name}`}>
        <ProductImage src={product.image} alt={product.name} sizes="(max-width: 680px) 100vw, 420px" />
        {off > 0 && <span className="spotlight-off">-{off}%</span>}
      </Link>
      <div className="spotlight-panel">
        <span className="spotlight-kicker">New this week</span>
        <h3>{product.name}</h3>
        <div className="spotlight-price">
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          <span>/pcs</span>
          {old && <del>₹{old.toLocaleString("en-IN")}</del>}
        </div>
        {old && <span className="spotlight-save">You save ₹{(old - product.price).toLocaleString("en-IN")}</span>}
        <div className="spotlight-buttons">
          <button
            type="button"
            className="spotlight-cart"
            onClick={() => { dispatch(addToCart(product.id)); setAdded(true); }}
            aria-live="polite"
          >
            {added ? <><Check size={16} /> Added</> : <><ShoppingCart size={16} /> Add to cart</>}
          </button>
          <Link href={`/products/${product.id}`} className="spotlight-details">View details</Link>
        </div>
      </div>
    </article>
  );
}
