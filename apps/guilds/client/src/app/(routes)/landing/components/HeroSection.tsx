import AnimatedMenuButton from "@/components/AnimatedButton"
import Link from "next/link"
import { BiLogoLinkedinSquare } from "react-icons/bi"

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center text-center font-standard">
      <div className="topSvg mx-auto w-[160px] transition-all duration-300 md:w-[340px] lg:w-[576px]">
        <h1 className="text-center font-heading text-4xl font-black uppercase leading-[40px] tracking-tight drop-shadow-2xl md:text-[4.7rem] md:leading-[4.7rem]  lg:text-[8rem] lg:leading-[7rem]">
          unleash your story
        </h1>
      </div>
      <p className="max-w-xs mt-8 text-xs font-thin text-center md:max-w-md md:text-lg lg:max-w-lg lg:text-xl">
        Excalibur is a creator led media platform that allows uncensored
        broadcasting of text, video and audio.
      </p>
      <p className="px-4 mt-4 text-xs italic font-thin md:max-w-2xl md:text-base">
        &quot;We empower creators to build community with their audience and to
        be rewarded fairly. Excalibur is a Web3 audio platform designed to
        deliver a higher quality of media with a seamless web3 user
        experience.&quot;
      </p>
      <a
        className="flex items-center mt-2"
        target="_blank"
        rel="noreferrer"
        href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=simon-smith-a860885
">
        Simon Smith , CEO & Founder.
        <BiLogoLinkedinSquare />
      </a>
      <Link
        target="_blank"
        href="/upload"
        passHref
        className="mt-10 text-sm font-medium">
        <AnimatedMenuButton label="Get Started" />
      </Link>
    </div>
  )
}

export default HeroSection
