"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCart, removeFromCart, setQuantity } from "@/redux/slices/cartSlice";

export default function CartContent({ products }: { products: Product[] }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const lines = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.quantity, 0);

  if (!lines.length) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">♡</span>
        <h2>Your bag is taking a little break</h2>
        <p>Find something lovely and it’ll be waiting here while you browse.</p>
        <Link href="/shop" className="button button-dark">Explore the collection</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-lines">
        {lines.map(({ product, quantity }) => (
          <article className="cart-line" key={product.id}>
            <Link href={`/products/${product.id}`} className="cart-line-photo" style={{ backgroundImage: `url("${product.image}")` }} aria-label={product.name} />
            <div className="cart-line-copy">
              <span className="eyebrow">{product.category}</span>
              <Link href={`/products/${product.id}`} className="product-title">{product.name}</Link>
              <span className="cart-unit-price">₹{product.price.toLocaleString("en-IN")} each</span>
              <div className="quantity-control">
                <button aria-label={`Decrease ${product.name} quantity`} disabled={quantity <= 1} onClick={() => dispatch(setQuantity({ productId: product.id, quantity: quantity - 1 }))}><Minus size={14} /></button>
                <span>{quantity}</span>
                <button aria-label={`Increase ${product.name} quantity`} onClick={() => dispatch(setQuantity({ productId: product.id, quantity: quantity + 1 }))}><Plus size={14} /></button>
              </div>
            </div>
            <div className="cart-line-end">
              <strong>₹{(product.price * quantity).toLocaleString("en-IN")}</strong>
              <button className="remove-line" aria-label={`Remove ${product.name}`} onClick={() => dispatch(removeFromCart(product.id))}><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
        <button className="text-button clear-cart" onClick={() => dispatch(clearCart())}>Clear bag</button>
      </div>
      <aside className="cart-summary">
        <h2>A little summary</h2>
        <div className="summary-row"><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
        <p>Shipping and any final details can be confirmed when you send us an enquiry.</p>
        <Link href="/enquiry" className="button button-dark summary-cta">Enquire about these items</Link>
        <Link href="/shop" className="summary-back">Keep browsing</Link>
        <small>This demo storefront does not process payments or create orders.</small>
      </aside>
    </div>
  );
}
