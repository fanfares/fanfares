import Footer from '@components/Footer';
import { Navbar } from '@components/Navbar';
import PageContent from '@components/PageContent';

import type { NextPage } from 'next';
import Head from 'next/head';
import HeroSection from 'src/views/modules/about/HeroSection';
import LandingPageContent from 'src/views/modules/landingpage/LandingPageContent';

// Good Reading Material
// https://nextjs.org/docs/api-reference/next/head

/**
 * Index/About Page
 *
 * The page that will first be shown
 */
const home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Excalibur</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Excalibur FM - Dive into the realm of music, entertainment, and culture with our 24/7 online radio station. Discover new artists, enjoy exclusive interviews, and stay updated with the latest trends. Tune in now for a magical listening experience!"
        />
      </Head>

      <div className="INDEX h-full">
        <Navbar />
        <div className="App mt-20 w-full md:mt-0">
          <HeroSection />
          <PageContent>
            <LandingPageContent />
          </PageContent>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default home;
