import type { Metadata } from "next";
import CartContent from "@/components/cart/CartContent";

export const metadata: Metadata = { title: "Your bag" };

export default function CartPage() {
  return <section className="section shell shop-page"><div className="page-heading compact-heading"><span className="eyebrow">Your Mihu finds</span><h1>Your shopping bag</h1><p>Just the lovely things you’ve picked so far.</p></div><CartContent /></section>;
}
