// import { fetchProfile } from "@/controllers/firestoreHelpers"
import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import DisplaySection from "./components/DisplaySection"
import AboutExcaliburSection from "./components/AboutExcaliburSection"
import FAQSection from "./components/FAQSection"
import EmailSubscription from "./components/EmailSubscription"
import Footer from "./components/Footer"

export default async function LandingPage({ params }: any) {
  return (
    <>
      <div className="relative w-full h-screen overflow-auto">
        <div className="absolute w-full h-full -left-80 -top-80" />
        {/* <div className="absolute w-2/3 ">
          {' '}
          <Image src={MySvg} alt="SVG Top" />
        </div> */}
        <div className="relative z-40 flex flex-col w-full h-screen mt-24 ">
          <HeroSection />
          <DisplaySection />
          <AboutExcaliburSection />
          {/* <CarrouselEpisodes /> */}
          {/* <CardsSection /> */}
          <FAQSection />
          <EmailSubscription />
          <Footer />
          <div className="fixed bottom-0 left-0 z-50 flex items-end justify-center w-full h-32 bg-gradient-to-t from-black via-black/40 lg:static lg:h-auto lg:w-auto lg:bg-none" />{" "}
        </div>
      </div>
    </>
  )
}
