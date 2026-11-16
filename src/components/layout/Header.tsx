"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { closeMobileMenu, toggleMobileMenu } from "@/redux/slices/uiSlice";
import { useAppDispatch } from "@/redux/hooks";

const links = [
  { href: "/shop", label: "Shop all" },
  { href: "/categories/jewellery", label: "Jewellery" },
  { href: "/categories/chains", label: "Chains" },
  { href: "/categories/earrings", label: "Earrings" },
  { href: "/about", label: "Our story" },
];

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((state) =>
    state.cart.reduce((count, item) => count + item.quantity, 0),
  );
  const wishlistCount = useAppSelector((state) => state.wishlist.length);
  const menuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);
  const [query, setQuery] = useState("");

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/shop?q=${encodeURIComponent(value)}` : "/shop");
    dispatch(closeMobileMenu());
  }

  return (
    <>
      <div className="announcement">
        A little joy in every order <span>✦</span> Thoughtful gifts, made easy
      </div>
      <header className="site-header">
        <div className="header-main shell">
          <button
            className="icon-button mobile-menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => dispatch(toggleMobileMenu())}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <Link href="/" className="brand" aria-label="Mihu Cute Corner home">
            <Image src="/logo/logo.jpg" alt="Mihu Cute Corner — Hair accessories and chains" width={72} height={72} priority />
            <span className="brand-copy">
              <strong>Mihu</strong>
              <small>CUTE CORNER</small>
            </span>
          </Link>
          <form className="header-search" onSubmit={search}>
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Search products"
              placeholder="Search chains, earrings, hair clips..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div className="header-actions">
            <Link href="/wishlist" className="header-action" aria-label={`Wishlist, ${wishlistCount} items`}>
              <span className="action-icon"><Heart size={20} /></span>
              <span className="action-label">Wishlist</span>
              {wishlistCount > 0 && <span className="count-badge">{wishlistCount}</span>}
            </Link>
            <Link href="/cart" className="header-action" aria-label={`Shopping bag, ${cartCount} items`}>
              <span className="action-icon"><ShoppingBag size={20} /></span>
              <span className="action-label">Bag</span>
              {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <div className="shell nav-inner">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => dispatch(closeMobileMenu())}>
                {link.label}
              </Link>
            ))}
            <Link className="nav-enquiry" href="/enquiry" onClick={() => dispatch(closeMobileMenu())}>Ask us anything <span>↗</span></Link>
          </div>
        </nav>
      </header>
    </>
  );
}
