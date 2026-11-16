import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { storeInfo } from "@/data/storeInfo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <Image src="/logo/logo.jpg" alt="" width={76} height={76} />
          <div>
            <h2>{storeInfo.name}</h2>
            <p>{storeInfo.tagline}</p>
            <p className="footer-note">For the little things that make you smile.</p>
          </div>
        </div>
        <div className="footer-links">
          <h3>Explore</h3>
          <Link href="/shop">Shop all</Link>
          <Link href="/categories/chains">Chains</Link>
          <Link href="/categories/accessories">Hair accessories</Link>
          <Link href="/about">Our story</Link>
        </div>
        <div className="footer-links">
          <h3>Here to help</h3>
          <Link href="/contact">Contact us</Link>
          <Link href="/enquiry">Product enquiry</Link>
          <Link href="/cart">Your shopping bag</Link>
          <Link href="/wishlist">Your wishlist</Link>
        </div>
        <div className="footer-links footer-contact">
          <h3>Say hello</h3>
          <a href={`mailto:${storeInfo.email}`}><Mail size={15} />{storeInfo.email}</a>
          <a href={`tel:${storeInfo.phone.replaceAll(" ", "")}`}><Phone size={15} />{storeInfo.phone}</a>
          <span><MapPin size={15} />{storeInfo.address}</span>
          <a href={storeInfo.instagram} target="_blank" rel="noreferrer"><InstagramIcon size={15} />{storeInfo.instagramHandle}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="shell footer-bottom-inner">
          <span>© {storeInfo.name}. Made for happy little moments.</span>
          <span>Secure enquiries · No online checkout</span>
        </div>
      </div>
    </footer>
  );
}
