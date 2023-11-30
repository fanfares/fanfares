import AboutExcaliburSection from './components/AboutExcaliburSection';
import CarrouselEpisodes from './components/CarrouselEpisodes';
import DisplaySection from './components/DisplaySection';
import EmailSubscription from './components/EmailSubscription';
import FAQSection from './components/FAQSection';
import CardsSection from './components/FeatureCardsSection';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
function LandingPageContent() {
  return (
    <>
      <Navbar />
      <div className="relative h-screen w-full overflow-auto">
        <div className="absolute -left-80 -top-80 h-full w-full" />
        {/* <div className="absolute w-2/3 ">
          {' '}
          <Image src={MySvg} alt="SVG Top" />
        </div> */}
        <div className="relative z-40 mt-24 flex h-screen w-full flex-col ">
          <HeroSection />
          <DisplaySection />
          <AboutExcaliburSection />
          <CarrouselEpisodes />
          <CardsSection />
          <FAQSection />
          <EmailSubscription />
          <Footer />
          <div className="fixed bottom-0 left-0 z-50 flex h-32 w-full items-end justify-center bg-gradient-to-t from-black via-black/40 lg:static lg:h-auto lg:w-auto lg:bg-none" />{' '}
        </div>
      </div>
    </>
  );
}

export default LandingPageContent;
