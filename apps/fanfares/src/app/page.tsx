import PageWrapper from "@/components/PageWrapper"
import DiscoverPage from "@/components/discover"
import { NIP_108_KINDS } from "nip108"

export default function Home() {
  // ------------------- STATES -------------------------

  // ------------------- FUNCTIONS -------------------------

  // ------------------- RENDERERS -------------------------

  // ------------------- MAIN -------------------------

  //TODO make this the Discover page
  return (
    <>
      {/* <h1><{NIP_108_KINDS.gate}></h1> */}
      <PageWrapper>
        <DiscoverPage />
      </PageWrapper>
    </>
  )
}
