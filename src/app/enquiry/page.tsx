import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = { title: "Product enquiry" };

export default function EnquiryPage() {
  return (
    <section className="section shell contact-page">
      <div className="page-heading"><span className="eyebrow">We’re happy to help</span><h1>Ask us about anything</h1><p>Tell us what caught your eye and we’ll get back to you with the details.</p></div>
      <div className="contact-layout">
        <div className="contact-aside"><div className="contact-note"><PackageSearch size={23} /><h2>Curious about a find?</h2><p>Ask us about materials, availability, gifting ideas or anything else you’d like to know before deciding.</p></div><p className="enquiry-disclaimer">This storefront is a product catalogue. An enquiry does not place an order or reserve an item.</p></div>
        <EnquiryForm />
      </div>
    </section>
  );
}
