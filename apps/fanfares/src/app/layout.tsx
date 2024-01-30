import { Navbar } from "@/app/components/Navbar"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ContainerGrid } from "@/app/components/ContainerGrid"
import { Providers } from "./components/Providers"
import { DebugOverlay } from "./components/DebugOverlay"

import { config } from "@fortawesome/fontawesome-svg-core"
import { GlobalAudioPlayer } from "./components/GlobalAudioPlayer"
config.autoAddCss = false /* eslint-disable import/first */

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
  // Layout should define
  // - size of section
  // - padding of contents

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="md:flex">
        <Providers>
          {/* Debug Overlay */}
          {/* <DebugOverlay /> */}
          <header className="">
            <Navbar />
          </header>
          {/* Content */}
          <ContainerGrid className="block md:ml-44 md:h-screen">
            {children}
          </ContainerGrid>
          <GlobalAudioPlayer />
        </Providers>
      </body>
    </html>
  )
}
