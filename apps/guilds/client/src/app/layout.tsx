'use client';
import { ExcaliburProvider } from "@/components/ExcaliburProvider";
import "./globals.css";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Excalibur",
//   description: "Nostr Lightning Gated Content",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ExcaliburProvider>{children}</ExcaliburProvider>
      </body>
    </html>
  );
}
