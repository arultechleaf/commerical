import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Mihu Cute Corner | Cute, Trendy & Stylish Accessories",
    template: "%s | Mihu Cute Corner",
  },
  description: "Shop pretty chains, jewellery, earrings and hair accessories at Mihu Cute Corner. Cute little gifts for everyday moments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="page-main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
