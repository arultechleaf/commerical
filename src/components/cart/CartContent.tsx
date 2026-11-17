"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { storeInfo } from "@/data/storeInfo";
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
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<{ id: string; whatsapp: string; total: number } | null>(null);

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    setPlacing(true);
    setError("");
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "order", name, phone, items: lines.map((line) => ({ id: line.product.id, quantity: line.quantity })) }),
      });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.error || "Could not place your order.");
      const text = [
        `Hi ${storeInfo.name}! New order ${saved.id}`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        ...saved.items.map((item: { id: string; name: string; price: number; quantity: number }) => `• ${item.name} (${item.id.toUpperCase()}) x${item.quantity} = ₹${(item.price * item.quantity).toLocaleString("en-IN")}`),
        `Total: ₹${saved.total.toLocaleString("en-IN")}`,
      ].join("\n");
      setPlaced({ id: saved.id, total: saved.total, whatsapp: `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(text)}` });
      dispatch(clearCart());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place your order.");
    } finally {
      setPlacing(false);
    }
  }

  if (placed) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">♡</span>
        <h2>Order received!</h2>
        <p className="request-id">Your order number: <strong>{placed.id}</strong></p>
        <p>Total ₹{placed.total.toLocaleString("en-IN")}. Send the details on WhatsApp so we can confirm payment and delivery.</p>
        <a className="button button-dark" href={placed.whatsapp} target="_blank" rel="noopener noreferrer">Send order on WhatsApp</a>
        <Link href="/shop" className="summary-back">Keep browsing</Link>
      </div>
    );
  }

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
        <form className="order-form" onSubmit={placeOrder}>
          <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" aria-label="Your name" />
          <input name="phone" type="tel" required maxLength={30} autoComplete="tel" placeholder="Phone number" aria-label="Phone number" />
          {error && <p className="form-status error" role="alert">{error}</p>}
          <button className="button button-dark summary-cta" type="submit" disabled={placing}>{placing ? "Placing order..." : "Place order"}</button>
        </form>
        <Link href="/enquiry" className="summary-back">Or enquire about these items</Link>
        <Link href="/shop" className="summary-back">Keep browsing</Link>
        <small>We confirm payment and delivery with you on WhatsApp. No online payment is taken here.</small>
      </aside>
    </div>
  );
}
