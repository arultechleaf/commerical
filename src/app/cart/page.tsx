import type { Metadata } from "next";
import { connection } from "next/server";
import { getProducts } from "@/lib/productStore";
import CartContent from "@/components/cart/CartContent";

export const metadata: Metadata = { title: "Your bag" };

export default async function CartPage() {
  await connection();
  const products = await getProducts();
  return <section className="section shell shop-page"><div className="page-heading compact-heading"><span className="eyebrow">Your Mithu finds</span><h1>Your shopping bag</h1><p>Just the lovely things you’ve picked so far.</p></div><CartContent products={products} /></section>;
}
