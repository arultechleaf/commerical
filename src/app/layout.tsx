import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import RobotMascot from "@/components/RobotMascot";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProducts } from "@/lib/productStore";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: {
    default: "Mithu Cute Corner | Cute, Trendy & Stylish Accessories",
    template: "%s | Mithu Cute Corner",
  },
  description: "Shop pretty chains, jewellery, earrings and hair accessories at Mithu Cute Corner. Cute little gifts for everyday moments.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const products = await getProducts();
  const recommendations = [
    ...products.filter((product) => product.category === "bangles"),
    ...products.filter((product) => product.category !== "bangles"),
  ].slice(0, 8);

  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="page-main">{children}</main>
          <Footer />
          <RobotMascot products={recommendations} />
        </Providers>
      </body>
    </html>
  );
}
