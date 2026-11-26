"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlistSlice";

type Notice = { text: string; href: string; action: string; key: number };

// Cart and heart buttons on a scrolling home image, using the same store as the product cards.
// After a click a small message pops up so the shopper sees it worked.
export default function SlideActions({ productId, name, hidden }: { productId: string; name: string; hidden?: boolean }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) => state.wishlist.includes(productId));
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pop, setPop] = useState<"cart" | "heart" | null>(null);
  const tab = hidden ? -1 : undefined;

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!pop) return;
    const timer = setTimeout(() => setPop(null), 400);
    return () => clearTimeout(timer);
  }, [pop]);

  function addCart() {
    dispatch(addToCart(productId));
    setPop("cart");
    setNotice({ text: `${name} added to your bag`, href: "/cart", action: "View bag", key: Date.now() });
  }

  function toggleHeart() {
    dispatch(toggleWishlist(productId));
    setPop("heart");
    setNotice(
      saved
        ? { text: `${name} removed from wishlist`, href: "/wishlist", action: "View wishlist", key: Date.now() }
        : { text: `${name} saved to wishlist`, href: "/wishlist", action: "View wishlist", key: Date.now() },
    );
  }

  return (
    <>
      <div className="image-marquee-actions">
        <button type="button" className={`add-to-cart-button ${pop === "cart" ? "is-popping" : ""}`} tabIndex={tab} aria-label={`Add ${name} to cart`} onClick={addCart}>
          <ShoppingCart size={20} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          className={`wishlist-button ${saved ? "is-saved" : ""} ${pop === "heart" ? "is-popping" : ""}`}
          tabIndex={tab}
          aria-label={saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          onClick={toggleHeart}
        >
          <Heart size={20} strokeWidth={2.2} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      {/* Rendered into <body>: the moving strip uses a transform, which would trap a fixed popup. */}
      {notice && createPortal(
        <div className="slide-toast" role="status" key={notice.key}>
          <span>{notice.text}</span>
          <Link href={notice.href}>{notice.action}</Link>
        </div>,
        document.body,
      )}
    </>
  );
}
