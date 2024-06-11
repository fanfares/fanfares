import { redirect } from "next/navigation"
import Button from "./components/Button"
import router from "next/router"
import Link from "next/link"
import HomePageAccordion from "./components/HomePageAccordion"
import Image from "next/image"
import Logo from "./assets/logo.svg"

export default function Home() {
  // ------------------- STATES -------------------------

  // ------------------- FUNCTIONS -------------------------

  // ------------------- RENDERERS -------------------------

  // ------------------- MAIN -------------------------

  // redirect('/discover');

  //TODO make this the Discover page
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center md:justify-start gap-4">
        <Link href="/" className="flex flex-col items-center md:hidden">
          <Image
            className=""
            width={70}
            height={70}
            src={Logo}
            alt="FanFares Logo"
          />
        </Link>
        <div className="flex-col">
          <h1 className="text-4xl font-gloock">FanFares</h1>
          <p className="text-base/5">
            Welcome to the Internet-Money Era of Podcasting.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:hidden gap-4 mt-8">
        <Link
          href="/upload"
          className={`px-1 flex items-center justify-center p-2 border-2 border-buttonAccentHover rounded-full bg-buttonAccent hover:bg-buttonAccentHover transition-all duration-300 ease-in-out transform text-sm hover:bg-skin-fill gap-2 font-gloock`}>
          <span className="">Upload your podcast</span>
        </Link>
        <Link
          href="/discover"
          className={`px-1 flex items-center justify-center p-2 border-2 border-buttonAccentHover rounded-full bg-buttonAccent hover:bg-buttonAccentHover transition-all duration-300 ease-in-out transform text-sm hover:bg-skin-fill gap-2 font-gloock`}>
          <span className="">Purchase podcasts</span>
        </Link>
      </div>

      <HomePageAccordion />
      {/* <div className="p-6 hidden md:block">
        <p className="text-lg ">
          Bitcoin Lightning is the breakthrough micropayment technology many
          have eagerly awaited for decades, and now it's finally here. At
          FanFares, we're harnessing this technology to liberate creators and
          their audiences from the influence of advertisers.
        </p>
        <p className="text-lg mt-4">
          The internet has long been a catalyst for disintermediation of systems
          where middlemen have control and siphon off the majority of the value
          created. With Bitcoin Lightning and Nostr, we're taking another stride
          towards empowering peer-to-peer communication and the exchange of
          value.
        </p>

        <p className="text-lg mt-4 ">
          We understand human nature, and it is a true fact that most people are
          basically lazy. We all tend to take the most convenient route wherever
          possible. While we all believe in compensating creators for their
          efforts, in a world accustomed to free access, many simply don't pay
          unless prompted.
        </p>
        <p className="text-lg  mt-4">
          On FanFares, the creators of a podcast can set a fee for accessing a
          podcast. Listeners get to enjoy every episode without being
          interrupted with ads. They get back those few minutes of their lives,
          which is worth the value of the sats to most of us because our time is
          even more scarce than bitcoin!
        </p>
      </div> */}
    </div>
  )
}
/* <h1><{NIP_108_KINDS.gate}></h1> */
