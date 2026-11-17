"use client";

import Image from "next/image";
import { RotateCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { storeInfo } from "@/data/storeInfo";
import type { Product } from "@/types/product";

const speechLines = [
  "Safe ah\npay pannalam 🔒",
  "Vanakkam!\nHow can I help? 👋",
  "Payment 100%\nsecure ✅",
  "Click me\nto chat!",
];

export default function RobotMascot({ products }: { products: Product[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [isSpeechFading, setIsSpeechFading] = useState(false);
  const [productStart, setProductStart] = useState(0);
  const visibleProducts = products.length > 4
    ? [...products.slice(productStart), ...products.slice(0, productStart)].slice(0, 4)
    : products.slice(0, 4);
  const whatsappNumber = storeInfo.phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Vanakkam! I need help with my order.")}`;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsSpeechFading(true);
      window.setTimeout(() => {
        setSpeechIndex((current) => (current + 1) % speechLines.length);
        setIsSpeechFading(false);
      }, 300);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <div className={`robot-chat${isOpen ? " open" : ""}`} aria-hidden={!isOpen}>
        <header className="robot-chat-title">
          <Image className="robot-chat-avatar" src="/logo/logo.jpg" alt="" width={48} height={48} loading="eager" />
          <div className="robot-chat-heading">
            <strong>LS Assistant</strong>
            <span><i /> Online · Tamil / English</span>
          </div>
          <button
            type="button"
            className="robot-chat-refresh"
            onClick={() => setProductStart((current) => products.length ? (current + 1) % products.length : 0)}
            aria-label="Show other products"
          >
            <RotateCw size={22} />
          </button>
          <button type="button" className="robot-chat-close" onClick={() => setIsOpen(false)} aria-label="Close assistant">
            <X size={25} />
          </button>
        </header>
        <div className="robot-assistant-products" aria-label="Recommended products">
          {visibleProducts.length ? visibleProducts.map((product) => (
            <a className="robot-product-card" href={`/products/${product.id}`} key={product.id}>
              <span className="robot-product-photo" style={{ backgroundImage: `url("${product.image}")` }} aria-hidden="true" />
              <span className="robot-product-info">
                <strong>{product.name}</strong>
                <span className="robot-product-price">
                  <b>₹{product.price.toLocaleString("en-IN")}</b>
                  {product.compareAtPrice && <del>₹{product.compareAtPrice.toLocaleString("en-IN")}</del>}
                </span>
                <span className="robot-product-code">Code: {product.id.toUpperCase()}</span>
              </span>
            </a>
          )) : <p className="robot-products-empty">Our products are being updated. Please check back soon.</p>}
        </div>
        <footer className="robot-assistant-footer">
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <span aria-hidden="true">📱</span> Chat with us on WhatsApp
          </a>
        </footer>
      </div>

      <div className="robot-dock">
        <div className={`robot-bubble${isSpeechFading ? " fade" : ""}`} aria-live="polite">
          {speechLines[speechIndex]}
        </div>
        <button
          className="robot-art"
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close AI bot chat" : "Open AI bot chat"}
          aria-expanded={isOpen}
        >
          <svg viewBox="0 0 220 330" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="robot-green-bright" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#d4ff9a" /><stop offset=".35" stopColor="#58e82a" /><stop offset="1" stopColor="#0e8f14" />
              </linearGradient>
              <linearGradient id="robot-green-light" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#a6ff5c" /><stop offset=".5" stopColor="#3ddc20" /><stop offset="1" stopColor="#0f8a14" />
              </linearGradient>
              <linearGradient id="robot-dark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1b4a20" /><stop offset="1" stopColor="#040f06" />
              </linearGradient>
              <radialGradient id="robot-eye-glow" cx=".5" cy=".35" r=".7">
                <stop offset="0" stopColor="#f2ffe0" /><stop offset="1" stopColor="#7dff3a" />
              </radialGradient>
              <filter id="robot-blur"><feGaussianBlur stdDeviation="3" /></filter>
            </defs>

            <ellipse cx="110" cy="322" rx="62" ry="7" fill="#000" opacity=".22" />

            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M96 232 90 266 86 296" stroke="#06140a" strokeWidth="20" />
              <path d="M96 232 90 266 86 296" stroke="url(#robot-green-light)" strokeWidth="14" />
              <path d="m124 232 8 34 6 30" stroke="#06140a" strokeWidth="20" />
              <path d="m124 232 8 34 6 30" stroke="url(#robot-green-light)" strokeWidth="14" />
            </g>
            <circle cx="90" cy="266" r="10" fill="url(#robot-dark)" /><circle cx="90" cy="266" r="5.5" fill="url(#robot-green-bright)" />
            <circle cx="132" cy="266" r="10" fill="url(#robot-dark)" /><circle cx="132" cy="266" r="5.5" fill="url(#robot-green-bright)" />
            <rect x="76" y="278" width="20" height="14" rx="6" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="2.5" transform="rotate(8 86 285)" />
            <rect x="128" y="278" width="20" height="14" rx="6" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="2.5" transform="rotate(-8 138 285)" />
            <path d="M62 294q0-4 8-4h32q10 4 10 14v8q0 4-6 4H66q-6 0-6-6Zm46 0q0-4 8-4h32q10 4 12 14v8q0 4-6 4h-40q-6 0-6-6Z" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="3" />
            <rect x="62" y="306" width="50" height="5" rx="2.5" fill="#06140a" /><rect x="110" y="306" width="50" height="5" rx="2.5" fill="#06140a" />
            <ellipse cx="78" cy="298" rx="9" ry="3" fill="#fff" opacity=".5" /><ellipse cx="126" cy="298" rx="9" ry="3" fill="#fff" opacity=".5" />

            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="m72 152-24 26 16 30" stroke="#06140a" strokeWidth="20" />
              <path d="m72 152-24 26 16 30" stroke="url(#robot-green-light)" strokeWidth="14" />
            </g>
            <circle cx="48" cy="178" r="9" fill="url(#robot-dark)" /><circle cx="48" cy="178" r="4.5" fill="url(#robot-green-bright)" />
            <circle cx="67" cy="214" r="10" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="3" />
            <circle cx="74" cy="219" r="4" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="2" />

            <rect x="100" y="124" width="20" height="14" rx="5" fill="url(#robot-dark)" />
            <rect x="88" y="186" width="44" height="30" rx="8" fill="url(#robot-dark)" />
            <g stroke="#58e82a" strokeWidth="2" opacity=".8"><line x1="94" y1="195" x2="126" y2="195" /><line x1="94" y1="203" x2="126" y2="203" /></g>
            <rect x="80" y="210" width="60" height="26" rx="13" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="3" />
            <rect x="76" y="134" width="68" height="62" rx="28" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="3" />
            <ellipse cx="94" cy="148" rx="13" ry="6" fill="#fff" opacity=".5" transform="rotate(-25 94 148)" />
            <circle cx="110" cy="164" r="22" fill="url(#robot-dark)" stroke="#06140a" strokeWidth="2" />
            <circle cx="110" cy="164" r="18.5" fill="none" stroke="#7dff3a" strokeWidth="1.5" opacity=".75" />
            <text x="110" y="161" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b6ff7e" fontFamily="Arial Black,Arial">AI</text>
            <text x="110" y="174" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b6ff7e" fontFamily="Arial Black,Arial">BOT</text>

            <circle cx="72" cy="150" r="14" fill="url(#robot-dark)" /><circle cx="72" cy="150" r="9.5" fill="url(#robot-green-bright)" />
            <circle cx="148" cy="150" r="14" fill="url(#robot-dark)" /><circle cx="148" cy="150" r="9.5" fill="url(#robot-green-bright)" />
            <g fill="none" strokeLinecap="round">
              <path d="m150 152 28-20" stroke="#06140a" strokeWidth="20" />
              <path d="m150 152 28-20" stroke="url(#robot-green-light)" strokeWidth="14" />
            </g>
            <g className="robot-forearm" fill="none" strokeLinecap="round">
              <path d="m178 132 8-38" stroke="#06140a" strokeWidth="20" />
              <path d="m178 132 8-38" stroke="url(#robot-green-light)" strokeWidth="14" />
              <circle cx="188" cy="84" r="11" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="3" />
              <rect x="176" y="66" width="7" height="14" rx="3.5" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="2" transform="rotate(-18 179 73)" />
              <rect x="184" y="62" width="7" height="15" rx="3.5" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="2" />
              <rect x="192" y="65" width="7" height="14" rx="3.5" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="2" transform="rotate(18 196 72)" />
            </g>
            <circle cx="178" cy="132" r="8.5" fill="url(#robot-dark)" /><circle cx="178" cy="132" r="4" fill="url(#robot-green-bright)" />

            <g className="robot-head">
              <line x1="112" y1="50" x2="120" y2="34" stroke="#06140a" strokeWidth="5" strokeLinecap="round" />
              <g className="robot-ball">
                <circle cx="122" cy="26" r="12" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="3" />
                <text x="122" y="30" textAnchor="middle" fontSize="10" fontWeight="900" fill="#06300c" fontFamily="Arial Black,Arial">LS</text>
              </g>
              <path d="M60 84q0-44 50-44t50 44" fill="none" stroke="#06140a" strokeWidth="6" />
              <ellipse cx="56" cy="92" rx="13" ry="20" fill="url(#robot-dark)" /><ellipse cx="56" cy="92" rx="8" ry="14" fill="url(#robot-green-bright)" />
              <ellipse cx="164" cy="92" rx="13" ry="20" fill="url(#robot-dark)" /><ellipse cx="164" cy="92" rx="8" ry="14" fill="url(#robot-green-bright)" />
              <text x="164" y="95" textAnchor="middle" fontSize="8" fontWeight="900" fill="#06300c" fontFamily="Arial Black,Arial">LS</text>
              <rect x="62" y="48" width="96" height="80" rx="38" fill="url(#robot-green-bright)" stroke="#06140a" strokeWidth="3" />
              <ellipse cx="92" cy="60" rx="20" ry="6" fill="#fff" opacity=".55" transform="rotate(-14 92 60)" />
              <rect x="71" y="62" width="78" height="54" rx="26" fill="url(#robot-dark)" stroke="#020a04" strokeWidth="2" />
              <ellipse cx="94" cy="86" rx="12" ry="14" fill="#7dff3a" filter="url(#robot-blur)" opacity=".65" />
              <ellipse cx="126" cy="86" rx="12" ry="14" fill="#7dff3a" filter="url(#robot-blur)" opacity=".65" />
              <ellipse className="robot-eye" cx="94" cy="86" rx="8" ry="11" fill="url(#robot-eye-glow)" />
              <ellipse className="robot-eye" cx="126" cy="86" rx="8" ry="11" fill="url(#robot-eye-glow)" />
              <circle cx="91" cy="81" r="2.6" fill="#fff" /><circle cx="123" cy="81" r="2.6" fill="#fff" />
              <path d="M95 102q15 13 30 0" stroke="#a6ff6a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <ellipse cx="82" cy="102" rx="5" ry="3" fill="#7dff3a" opacity=".3" /><ellipse cx="138" cy="102" rx="5" ry="3" fill="#7dff3a" opacity=".3" />
            </g>
          </svg>
        </button>
      </div>
    </>
  );
}
