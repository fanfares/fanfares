import Toast from "@/views.old/components/Toast"
import IsIOSModal from "@/views.old/modals/IsIOSModal"
import {
  ExcaliburSolanaWalletAdapter,
  SolanaWalletInterceptor,
} from "@/views.old/modules/app/ExcaliburSolanaWalletAdapter"
import { GoogleAnalytics } from "@/views.old/modules/app/GoogleAnalytics"
import GlobalAudioPlayer from "@/views.old/modules/player/GlobalAudioPlayer"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"

import type { AppProps } from "next/app"
import { useRouter } from "next/router"

import "src/views/styles/globals.css"
config.autoAddCss = false

// May want to load in these things afer...

function LandingPage({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  )
}

function ExcaliburApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics />
      <ExcaliburSolanaWalletAdapter>
        <SolanaWalletInterceptor />
        {/* <DebugText /> */}
        <IsIOSModal />
        <Toast />
        <GlobalAudioPlayer />
        <Component {...pageProps} />
      </ExcaliburSolanaWalletAdapter>
    </>
  )
}

function MyApp(props: AppProps) {
  const route = useRouter()

  if (route.pathname === "/") {
    return LandingPage(props)
  }

  return ExcaliburApp(props)
}

export default MyApp
