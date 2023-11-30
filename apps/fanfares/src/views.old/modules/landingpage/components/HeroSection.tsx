import { FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center text-center font-standard">
      <div className="topSvg mx-auto w-[160px] transition-all duration-300 md:w-[340px] lg:w-[576px]">
        <h1 className="text-center font-heading text-4xl font-black uppercase leading-[40px] tracking-tight drop-shadow-2xl md:text-[4.7rem] md:leading-[4.7rem]  lg:text-[8rem] lg:leading-[7rem]">
          unleash your story
        </h1>
      </div>
      <p className="max-w-xs mt-8 text-xs font-thin text-center md:max-w-md md:text-lg lg:max-w-lg lg:text-xl">
        Excalibur is a creator led audio platform built for creators to share and monetise their audio content using
        decentralised blockchain technology.
      </p>
      <p className="px-4 mt-4 text-xs italic font-thin md:max-w-2xl md:text-base">
        &quot;We empower creators to build community with their audience and to be rewarded fairly. Excalibur is a Web3
        audio platform designed to deliver a higher quality of media with a seamless web3 user experience.&quot;
      </p>
      <a
        className="flex items-center mt-2"
        target="_blank"
        rel="noreferrer"
        href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=simon-smith-a860885
">
        Simon Smith , CEO & Founder.
        <FontAwesomeIcon className="ml-2 text-lg text-buttonAccentHover" icon={faLinkedin} />{' '}
      </a>
      <Link href="/upload" passHref>
        <a
          target="_blank"
          className="p-2 mt-10 text-sm font-medium rounded-md bg-buttonDefault drop-shadow-md hover:scale-105 hover:bg-buttonAccentHover/80 active:scale-95 md:px-4 md:py-3">
          Get started
        </a>
      </Link>
    </div>
  );
};

export default HeroSection;
