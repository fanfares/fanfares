import { Navbar } from "@/app/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MobileNavbar } from "@/app/components/MobileNavbar";
import { ContainerGrid } from "@/app/components/ContainerGrid";
import { Providers } from "./components/Providers";
import { DebugOverlay } from "./components/DebugOverlay";

const inter = Inter({
  weight: ["400", "700", "900"],
  style: ["normal"],
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fanfares",
  description: "Podcasting built on Nostr",
  openGraph: {
    title: "Fanfares",
    description: "Podcasting built on Nostr",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout should define
  // - size of section
  // - padding of contents

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="container flex flex-col-reverse items-start w-full h-screen mx-auto md:mx-0 md:flex-row">
        <Providers>
          {/* Debug Overlay */}
          <DebugOverlay />

          {/* Desktop Navbar */}
          <header className="w-full md:w-36 lg:w-52 ">
            <div className="md:block md:w-52">
              <Navbar />
            </div>
            {/* Mobile Navbar */}
            <div className="h-16 md:hidden">
              <MobileNavbar />
            </div>
          </header>
          {/* Content */}
          <ContainerGrid className="flex-1">{children}</ContainerGrid>
        </Providers>
      </body>
    </html>
  );
}
