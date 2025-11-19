import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CartButton from "@/components/CartButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TapNOrder - Food Ordering",
  description: "Order your favorite food via WhatsApp",
};

import AuthProvider from "@/components/AuthProvider";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <AuthProvider>
            <main className="min-h-screen bg-background pb-20">
              {children}
            </main>
            <CartButton />
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
