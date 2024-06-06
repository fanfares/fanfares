"use client"
import clsx from "clsx"
import { ReactNode, useEffect, useRef, useState } from "react"
import SectionTitle from "./SectionTitle"

export interface FaqBoxProps {
  boxNumber: number
  boxState: number | null
  setBoxState: (boxNumber: number | null) => void
  boxTitle: string
  boxTitleId?: string
  boxButtonId?: string
  children: ReactNode
}

function FaqBox(props: FaqBoxProps) {
  const {
    boxNumber,
    boxState,
    setBoxState,
    boxTitle,
    boxButtonId,
    boxTitleId,
    children,
  } = props
  const [isOpening, setIsOpening] = useState(false)
  const isOpen = boxNumber === boxState

  const setBox = () => {
    setIsOpening(true)
    if (!isOpen) {
      setBoxState(boxNumber)
    } else {
      setBoxState(null)
    }
  }

  const renderArrows = () => {
    return (
      <button
        className={clsx("svgUp transition duration-300", {
          "rotate-180": isOpen,
          "rotate-0": !isOpen,
          "opacity-0": isOpening,
          "opacity-100": !isOpening,
        })}>
        <svg
          width="10"
          role="button"
          aria-label="open dropdown"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 1L5 5L9 1"
            stroke="#4B5563"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )
  }
  // const renderUpArrow = () => {
  //   return (
  //     <button className="svgUp">
  //       <svg
  //         role="button"
  //         aria-label="close dropdown"
  //         width="10"
  //         height="6"
  //         viewBox="0 0 10 6"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg">
  //         <path d="M1 5L5 1L9 5" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  //       </svg>
  //     </button>
  //   );
  // };

  // const renderDownArrow = () => {
  //   return (
  //     <button className="svgDown">
  //       <svg
  //         width="10"
  //         role="button"
  //         aria-label="open dropdown"
  //         height="6"
  //         viewBox="0 0 10 6"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg">
  //         <path d="M1 1L5 5L9 1" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  //       </svg>
  //     </button>
  //   );
  // };

  const descriptionRef = useRef<HTMLDivElement>(null)

  const renderDescription = () => {
    return (
      <div
        ref={descriptionRef}
        className={clsx(
          "mt-8 overflow-hidden leading-normal text-white transition-all duration-500 ease-in-out",
          {
            "mt-0 h-0": !isOpen,
          }
        )}>
        {children}
      </div>
    )
  }

  useEffect(() => {
    if (isOpen && descriptionRef.current) {
      const actualHeight = descriptionRef.current.scrollHeight || 0
      descriptionRef.current.style.height = `${actualHeight}px`
    } else if(descriptionRef.current){
      descriptionRef.current.style.height = "0"
    }
    const timeout = setTimeout(() => setIsOpening(false), 500)
    return () => clearTimeout(timeout)
  }, [isOpen])

  return (
    <div
      id={boxButtonId}
      onClick={setBox}
      className={clsx(
        "mt-2 cursor-pointer rounded  border border-gray-50/10 p-4 shadow drop-shadow-2xl filter backdrop-blur-md transition-all duration-500 ",
        {
          "bg-white/[5%]": isOpen,
          "bg-white/[2%]": !isOpen,
        }
      )}>
      <div className="flex items-center justify-between h-2 ">
        <div>
          <h2
            id={boxTitleId}
            className="text-base font-semibold leading-none md:text-lg">
            {boxTitle}
          </h2>
        </div>
        <div
          className={clsx(
            "arrow cursor-pointer ring-offset-white transition-opacity duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          )}>
          {/* {isOpen && !isOpening ? renderUpArrow() : renderDownArrow()} */}
          {renderArrows()}
        </div>
      </div>
      <div
        className={clsx(
          "h-full transition-[height] delay-1000 duration-500 ease-in-out",
          {
            " h-full ": isOpen,
            "  h-0": !isOpen,
          }
        )}>
        {renderDescription()}
      </div>
      {/* {renderDescription()} */}
    </div>
  )
}

export default function FAQSection() {
  const [boxState, setBoxState] = useState<number | null>(null)

  return (
    <div className="relative flex flex-col items-center content-center justify-center w-full px-8 mx-auto mt-32">
      {/* <span aria-disabled className="z-0 faq-svg-bl" />
      <span aria-disabled className="z-0 faq-svg-tr" /> */}
      <div className="w-full mx-auto ">
        <SectionTitle title="F.A.Q" />
      </div>
      <div className="w-full lg:w-3/4">
        <h2
          id="e2e-general-heading"
          className="block mt-8 text-xl font-semibold md:text-2xl">
          General
        </h2>
        <FaqBox
          boxTitleId="e2e-how-it-works-heading"
          boxButtonId="e2e-how-it-works-box"
          boxNumber={0}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={"How does Excalibur work?"}>
          <p
            id="e2e-how-it-works-text"
            className="block mt-2 transition-all duration-1000">
            Excalibur is a Web 3 Audio Platform where creators can monetize
            their audio content by receiving contributions from listeners.
            Additionally, it&apos;s a decentralized space where creators can
            build a loyal and engaged community. Excalibur provides an
            additional revenue stream for podcasters in an industry where other
            revenue sources can be unpredictable. The listeners and community
            members have the chance to own a digital membership card by making
            contributions to the creator of their favorite content whether
            that&apos;s a podcast, audiobook, or something else.
          </p>
        </FaqBox>
        <FaqBox
          boxNumber={1}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={"What is a Digital Membership Card?"}>
          <p className="block mt-2">
            It’s a unique digital membership card in the form of a Non Fungible
            Token that cannot be copied or substituted. It is recorded on the
            blockchain, which is used to certify its authenticity and ownership.
          </p>
        </FaqBox>
        <FaqBox
          boxNumber={2}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={"What does the Digital Membership Card get me?"}>
          <p className="block mt-2">
            Your digital membership card gives you access to a community of
            like-minded people who also enjoyed a specific piece of audio
            content enough to make a contribution and obtain a digital
            collectible that acts as a membership card for that particular
            community. The digital membership card gives you entry to a platform
            where you can speak to other membership holders, and the creator
            themselves.
          </p>
        </FaqBox>
        <h2 className="block mt-8 text-xl font-semibold md:text-2xl">
          For Creators
        </h2>
        <FaqBox
          boxNumber={3}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={"How does Excalibur work?"}>
          <ol>
            <li>
              <p className="">
                - Excalibur is a Decentralised Media Platform where creators can
                monetize their audio content by receiving payments from
                listeners. It&apos;s a decentralized space where creators can
                build a loyal and an engaged community. Excalibur provides an
                additional revenue stream for podcasters in an industry where
                other revenue sources can be unpredictable
              </p>
            </li>
            {/* <li>
              <p className="">
                - Excalibur also acts as a gateway to Web3 for creators who want to get into the space.
              </p>
            </li>
            <li>
              <p className="">
                - Another benefit is the opportunity to build a decentralized, engaged community around your content.
              </p>
            </li> */}
          </ol>
        </FaqBox>
        <FaqBox
          boxNumber={4}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={"Why does it cost 0.01489 SOL to publish an audio file?"}>
          <p className="block mt-2">
            This is a transaction fee, known as a gas fee, which is standard to
            Web3. This gas fee facilitates the actual upload and is what allows
            any platform to be decentralized.
          </p>
        </FaqBox>
        <h2 className="block mt-8 text-xl font-semibold md:text-2xl">
          For Listeners and Community Members
        </h2>
        <FaqBox
          boxNumber={5}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={"Why would I use Excalibur?"}>
          <ol>
            <li>
              <p className="">
                Excalibur gives you the chance to find and share great content
                through your social network. You can comment , share and engage
                in discussions about the content that you have found.
                Additionally you have the opportunity to support the creators
                through peer to peer payments in Bitcoin.
              </p>
            </li>
            {/* <li>
              <p className="">
                - Your digital membership card gives you entry to a platform where you can speak to other membership
                holders, and the creator themselves.
              </p>
            </li>
            <li>
              <p className="">
                - As a community member, you have influence, an opinion, and ownership of a part of the content you
                love.
              </p>
            </li> */}
          </ol>
        </FaqBox>
        <FaqBox
          boxNumber={6}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={
            "Can I use Excalibur if I am not familiar with Web3, NFTs, or Crypto?"
          }>
          <p className="block mt-2">
            Yes, absolutely! To ensure our platform is accessible to all
            community members and listeners we have Web3auth sign in and set up
            which is easy and straightforward for everyone to use.
          </p>
        </FaqBox>
        <h2 className="block mt-8 text-xl font-semibold md:text-2xl">
          Your Wallet
        </h2>
        <FaqBox
          boxNumber={7}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={"What is a Bitcoin Lightning Wallet?"}>
          <p className="">
            This is a digital wallet that allows you transfer bitcoin instantly
            at virtually no cost.
          </p>
        </FaqBox>
        <FaqBox
          boxNumber={8}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={"Which wallet should I use?"}>
          <p className="">
            There are many Bitcoin Lightning wallets available. We recommend
            that you download one at getalby.com and install it as a browser
            extension.
          </p>
        </FaqBox>
        {/* <FaqBox boxNumber={9} setBoxState={setBoxState} boxState={boxState} boxTitle={'How do I create a Glow wallet?'}>
          <p className="">
            Glow, can be downloaded at Glow.app, make sure to write down (non-digitally) your 12-word seed phrase and
            keep it in a safe place.
          </p>
        </FaqBox> */}
        <FaqBox
          boxNumber={9}
          setBoxState={() => {
            9
          }}
          boxState={9}
          boxTitle={"How can we help you further?"}>
          <p className="">
            Email us at&nbsp;
            <a className="underline" href="mailto:support@excalibur.fm">
              support@excalibur.fm
            </a>
          </p>
        </FaqBox>
      </div>
    </div>
  )
}
