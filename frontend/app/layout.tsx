import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CartButton from "@/components/CartButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TapNOrder - Food Ordering",
  description: "Order your favorite food via WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50 pb-20">
          {children}
        </main>
        <CartButton />
      </body>
    </html>
  );
}
