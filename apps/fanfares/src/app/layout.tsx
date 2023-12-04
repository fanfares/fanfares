import { Navbar } from "@/components/Navbar"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({
  weight: ["400", "700", "900"],
  style: ["normal"],
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Fanfares",
  description: "Podcasting built on Nostr",
  openGraph: {
    title: "Fanfares",
    description: "Podcasting built on Nostr",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <Navbar />
      <body>{children}</body>
    </html>
  )
}
