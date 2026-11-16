import type { Metadata } from "next";
import WishlistContent from "@/components/wishlist/WishlistContent";

export const metadata: Metadata = { title: "Your wishlist" };

export default function WishlistPage() {
  return <section className="section shell shop-page"><div className="page-heading compact-heading"><span className="eyebrow">Saved with love</span><h1>Your wishlist</h1><p>All the little things you’ve got your eye on.</p></div><WishlistContent /></section>;
}
