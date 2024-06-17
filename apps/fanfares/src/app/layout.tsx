import { Navbar } from "@/app/components/Navbar"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ContainerGrid } from "@/app/components/ContainerGrid"
import { Providers } from "./components/Providers"
import { DebugOverlay } from "./components/DebugOverlay"
import { Gloock } from "next/font/google"

import { config } from "@fortawesome/fontawesome-svg-core"
import { GlobalAudioPlayer } from "./components/GlobalAudioPlayer"
import Toast from "./components/Toast"
import MobileTopNavbar from "./components/MobileTopNavbar"
import AlbyBanner from "./components/AlbyBanner"
import MobileBottomNavbar from "./components/MobileBottomNavbar"

config.autoAddCss = false /* eslint-disable import/first */

const inter = Gloock({
  weight: ["400"],
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
  // Layout should define
  // - size of section
  // - padding of contents

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>{/* */}</head>
      <body className="h-screen">
        <AlbyBanner />
        <Providers>
          {/* <DebugOverlay /> */}
          <header className="">
            <Navbar />
            <MobileTopNavbar isLoggedIn={false} pubkey="123" />
          </header>
          {/* Content */}
          <ContainerGrid className="block md:ml-48 md:h-screen pb-32">
            <Toast />
            {children}
            <MobileBottomNavbar />
          </ContainerGrid>
          <GlobalAudioPlayer />
        </Providers>
      </body>
    </html>
  )
}
