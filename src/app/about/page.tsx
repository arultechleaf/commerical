import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, WandSparkles } from "lucide-react";

export const metadata: Metadata = { title: "Our story" };

export default function AboutPage() {
  return (
    <section className="section shell about-page">
      <div className="about-hero">
        <div className="about-logo"><Image src="/logo/logo.jpg" alt="Mithu Cute Corner" width={240} height={240} /></div>
        <div><span className="eyebrow">Welcome to our little corner</span><h1>Small details.<br /><em>Big happy energy.</em></h1><p>Mithu Cute Corner is all about finding that little something that feels like you: cheerful hair accessories, sweet chains and everyday sparkle.</p><Link href="/shop" className="button button-dark">Find your little favourite <span>↗</span></Link></div>
      </div>
      <div className="about-values">
        <article><span><Heart size={20} /></span><h2>Picked with love</h2><p>We look for fun, feel-good pieces that bring an extra little smile to your everyday.</p></article>
        <article><span><Sparkles size={20} /></span><h2>Made to be you</h2><p>From a soft everyday touch to a standout gift, there’s room here for every kind of style.</p></article>
        <article><span><WandSparkles size={20} /></span><h2>Joy in the details</h2><p>Because a cute little accessory can turn an ordinary moment into a happy one.</p></article>
      </div>
      <div className="about-end"><span className="eyebrow">A cute · trendy · stylish kind of day</span><h2>Come find something lovely.</h2><Link href="/shop" className="inline-link">Explore all the collections <span>↗</span></Link></div>
    </section>
  );
}
