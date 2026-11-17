"use client";

import Image from "next/image";
import Link from "next/link";
import { CircleDot, Gem, Heart, Link2, Menu, Search, ShoppingBag, Sparkles, User, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { closeMobileMenu, toggleMobileMenu } from "@/redux/slices/uiSlice";
import { useAppDispatch } from "@/redux/hooks";

type MenuType = { label: string; href: string; Icon: typeof Gem };
type MenuList = { title: string; items: { label: string; href: string; tag?: string }[] };
type NavLink = { href: string; label: string; heading: string; types: MenuType[]; lists: MenuList[]; feature: { kicker: string; title: string; href: string; art: string } };

// Every link below is checked against the real catalogue (search covers product
// name + material), so none of them lands on an empty page.
const range = (base: string) => [
  { label: "Under ₹300", href: `${base}?max=300` },
  { label: "₹300 – ₹500", href: `${base}?min=300&max=500` },
  { label: "Above ₹500", href: `${base}?min=500` },
];
const links: NavLink[] = [
  { href: "/shop?filter=new", label: "New in", heading: "Just landed",
    types: [{ label: "New chains", href: "/shop?filter=new&cat=chains", Icon: Link2 }, { label: "New earrings", href: "/shop?filter=new&cat=earrings", Icon: Gem }, { label: "New bangles", href: "/shop?filter=new&cat=bangles", Icon: CircleDot }, { label: "New hair", href: "/shop?filter=new&cat=accessories", Icon: Sparkles }, { label: "New jewellery", href: "/shop?filter=new&cat=jewellery", Icon: Heart }],
    lists: [
      { title: "Fresh arrivals", items: [{ label: "All new products", href: "/shop?filter=new" }, { label: "New under ₹300", href: "/shop?filter=new&max=300" }, { label: "New above ₹500", href: "/shop?filter=new&min=500" }] },
      { title: "Upcoming", items: [{ label: "Coming soon", href: "/enquiry", tag: "Soon" }, { label: "Pre-order enquiry", href: "/enquiry" }, { label: "Get notified", href: "/enquiry" }] },
    ],
    feature: { kicker: "Just arrived", title: "Fresh this week", href: "/shop?filter=new", art: "✨" } },
  { href: "/categories/jewellery", label: "Jewellery", heading: "Shop by finish",
    types: [{ label: "Pearl", href: "/categories/jewellery?q=pearl", Icon: CircleDot }, { label: "Rose gold", href: "/categories/jewellery?q=rose%20gold", Icon: Sparkles }, { label: "Gold tone", href: "/categories/jewellery?q=gold-tone", Icon: Gem }, { label: "Silver", href: "/categories/jewellery?q=silver", Icon: Link2 }, { label: "Enamel", href: "/categories/jewellery?q=enamel", Icon: Heart }],
    lists: [
      { title: "By style", items: [{ label: "Petal", href: "/categories/jewellery?q=petal" }, { label: "Daisy", href: "/categories/jewellery?q=daisy" }, { label: "Moon & star", href: "/categories/jewellery?q=moon" }] },
      { title: "Jewellery price", items: range("/categories/jewellery") },
    ],
    feature: { kicker: "Shop all", title: "Jewellery collection", href: "/categories/jewellery", art: "💍" } },
  { href: "/categories/chains", label: "Chains", heading: "Chain styles",
    types: [{ label: "Butterfly", href: "/categories/chains?q=butterfly", Icon: Sparkles }, { label: "Heart", href: "/categories/chains?q=heart", Icon: Heart }, { label: "Daisy", href: "/categories/chains?q=daisy", Icon: CircleDot }, { label: "Moon", href: "/categories/chains?q=moon", Icon: Gem }, { label: "Charm", href: "/categories/chains?q=charm", Icon: Link2 }],
    lists: [
      { title: "By finish", items: [{ label: "Pearl", href: "/categories/chains?q=pearl" }, { label: "Silver", href: "/categories/chains?q=silver" }, { label: "Gold tone", href: "/categories/chains?q=gold-tone" }] },
      { title: "Chain price", items: range("/categories/chains") },
    ],
    feature: { kicker: "Best loved", title: "All chains", href: "/categories/chains", art: "⛓️" } },
  { href: "/categories/earrings", label: "Earrings", heading: "Earring styles",
    types: [{ label: "Studs", href: "/categories/earrings?q=stud", Icon: CircleDot }, { label: "Hoops", href: "/categories/earrings?q=hoop", Icon: Link2 }, { label: "Drops", href: "/categories/earrings?q=drop", Icon: Sparkles }, { label: "Hearts", href: "/categories/earrings?q=heart", Icon: Heart }, { label: "Butterfly", href: "/categories/earrings?q=butterfly", Icon: Gem }],
    lists: [
      { title: "By finish", items: [{ label: "Pearl", href: "/categories/earrings?q=pearl" }, { label: "Rose gold", href: "/categories/earrings?q=rose%20gold" }, { label: "Silver", href: "/categories/earrings?q=silver" }] },
      { title: "Earring price", items: range("/categories/earrings") },
    ],
    feature: { kicker: "Party ready", title: "All earrings", href: "/categories/earrings", art: "💎" } },
  { href: "/categories/accessories", label: "Hair accessories", heading: "Hair styles",
    types: [{ label: "Hair clips", href: "/categories/accessories?q=clip", Icon: Sparkles }, { label: "Bows", href: "/categories/accessories?q=bow", Icon: Heart }, { label: "Hair pins", href: "/categories/accessories?q=pin", Icon: Gem }, { label: "Scrunchies", href: "/categories/accessories?q=scrunchie", Icon: CircleDot }, { label: "Sets", href: "/categories/accessories?q=set", Icon: Link2 }],
    lists: [
      { title: "By style", items: [{ label: "Heart", href: "/categories/accessories?q=heart" }, { label: "Butterfly", href: "/categories/accessories?q=butterfly" }, { label: "Daisy", href: "/categories/accessories?q=daisy" }] },
      { title: "Hair price", items: range("/categories/accessories") },
    ],
    feature: { kicker: "Cute picks", title: "All hair accessories", href: "/categories/accessories", art: "🎀" } },
  { href: "/shop?filter=best", label: "Gifts", heading: "Gift ideas",
    types: [{ label: "Bestsellers", href: "/shop?filter=best", Icon: Sparkles }, { label: "Hearts", href: "/shop?q=heart", Icon: Heart }, { label: "Pearl", href: "/shop?q=pearl", Icon: CircleDot }, { label: "Butterfly", href: "/shop?q=butterfly", Icon: Gem }, { label: "On sale", href: "/shop?filter=sale", Icon: Link2 }],
    lists: [
      { title: "Gift by budget", items: range("/shop") },
      { title: "Gift services", items: [{ label: "Free gift wrap", href: "/enquiry", tag: "Free" }, { label: "Custom gift box", href: "/enquiry" }, { label: "Bulk orders", href: "/enquiry" }] },
    ],
    feature: { kicker: "Free gift wrap", title: "Gifts made easy", href: "/shop?filter=best", art: "🎁" } },
  { href: "/about", label: "Our story", heading: "About Mithu",
    types: [{ label: "About us", href: "/about", Icon: Heart }, { label: "Contact", href: "/contact", Icon: Link2 }, { label: "Ask us", href: "/enquiry", Icon: Sparkles }, { label: "Wishlist", href: "/wishlist", Icon: Gem }, { label: "Bag", href: "/cart", Icon: CircleDot }],
    lists: [
      { title: "Help", items: [{ label: "Contact us", href: "/contact" }, { label: "Send an enquiry", href: "/enquiry" }, { label: "Your bag", href: "/cart" }] },
      { title: "Policies", items: [{ label: "Terms & Conditions", href: "/policies/terms-and-conditions" }, { label: "Privacy Policy", href: "/policies/privacy-policy" }, { label: "Shipping Policy", href: "/policies/shipping-policy" }] },
    ],
    feature: { kicker: "Meet Mithu", title: "Our little story", href: "/about", art: "💗" } },
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
        Free gift wrap on every order <span>·</span> Delivery across India in 3–5 days
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
          <Link href="/" className="brand" aria-label="Mithu Cute Corner home">
            <Image src="/logo/logo.jpg" alt="Mithu Cute Corner — Hair accessories and chains" width={72} height={72} priority />
            <span className="brand-copy">
              <strong>Mithu</strong>
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
            <Link href="/admin/login" className="header-action" aria-label="Admin login">
              <span className="action-icon"><User size={20} /></span>
              <span className="action-label">Login</span>
            </Link>
          </div>
        </div>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <div className="shell nav-inner">
            {links.map((link) => {
              const close = () => dispatch(closeMobileMenu());
              return (
                <div key={link.label} className="nav-item has-mega">
                  <Link href={link.href} className="nav-top" onClick={close}>
                    {link.label} <span className="nav-caret" aria-hidden="true">▾</span>
                  </Link>
                  <div className="mega-menu">
                    <div className="mega-grid">
                      <div>
                        <h3>{link.heading}</h3>
                        <div className="mega-types">
                          {link.types.map(({ label, href, Icon }) => (
                            <Link key={label} href={href} className="mega-type" onClick={close}>
                              <span className="mega-type-icon"><Icon size={30} strokeWidth={1.6} /></span>
                              {label}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="mega-lists">
                        {link.lists.map((list) => (
                          <div key={list.title} className="mega-list">
                            <h3>{list.title}</h3>
                            {list.items.map((item) => (
                              <Link key={item.label} href={item.href} onClick={close}>
                                {item.label}{item.tag && <b className="mega-offer">{item.tag}</b>}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                      <Link href={link.feature.href} className="mega-feature" onClick={close}>
                        <span className="mega-feature-art" aria-hidden="true">{link.feature.art}</span>
                        <small>{link.feature.kicker}</small>
                        <strong>{link.feature.title}</strong>
                        <em>Shop now →</em>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
            <Link className="nav-enquiry" href="/shop?filter=sale" onClick={() => dispatch(closeMobileMenu())}>Sale up to 30% off</Link>
          </div>
        </nav>
      </header>
    </>
  );
}
