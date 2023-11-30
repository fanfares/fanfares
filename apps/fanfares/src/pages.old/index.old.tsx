import LandingPageContent from "@/views.old/modules/landingpage/LandingPageContent"
import type { NextPage } from "next"
import Head from "next/head"

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Excalibur.FM</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <LandingPageContent />
    </>
  )
}

export default IndexPage
