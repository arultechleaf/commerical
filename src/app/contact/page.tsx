import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { storeInfo } from "@/data/storeInfo";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <section className="section shell contact-page">
      <div className="page-heading"><span className="eyebrow">We’re right around the corner</span><h1>Let’s have a little chat</h1><p>Product question, gift idea or just want to say hi? We’d love to hear from you.</p></div>
      <div className="contact-layout">
        <div className="contact-aside">
          <div className="contact-note"><MessageCircle size={23} /><h2>A real person, always</h2><p>Send a note and we’ll be happy to help with product details, availability or a special gift.</p></div>
          <a className="contact-detail" href={`mailto:${storeInfo.email}`}><Mail size={18} /><span><small>Email us</small><strong>{storeInfo.email}</strong></span></a>
          <a className="contact-detail" href={`tel:${storeInfo.phone.replaceAll(" ", "")}`}><Phone size={18} /><span><small>Call us</small><strong>{storeInfo.phone}</strong></span></a>
          <div className="contact-detail"><MapPin size={18} /><span><small>Visit us</small><strong>{storeInfo.address}</strong></span></div>
          <a className="contact-detail" href={storeInfo.instagram} target="_blank" rel="noreferrer"><InstagramIcon size={18} /><span><small>Follow us</small><strong>{storeInfo.instagramHandle}</strong></span></a>
          <p className="contact-footnote">We usually reply within 1–2 business days.</p>
          <Link href="/enquiry" className="inline-link">Looking for a particular item? Make an enquiry ↗</Link>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}
