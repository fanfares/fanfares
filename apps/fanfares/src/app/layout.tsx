import { Navbar } from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Media from "react-media";
import { MobileNavbar } from "@/components/MobileNavbar";

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
      <body className="h-screen w-screen flex md:flex-row flex-col-reverse">
        {/* Desktop Navbar */}
        <div className="bg-red-500 md:block md:w-52">
          {/* <Navbar /> */}
        </div>
        {/* Mobile Navbar */}
        <div className="bg-purple-500 md:hidden h-16">
          {/* <MobileNavbar />  */}
        </div>
        {/* Content */}
        <div className="bg-green-500 flex-1 p-10">
          {children}
        </div>
      </body>
    </html>
  );
}
