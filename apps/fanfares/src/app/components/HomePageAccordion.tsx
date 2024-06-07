"use client"
import clsx from "clsx"
import { ReactNode, useEffect, useRef, useState } from "react"

export interface HomePageAccordionProps {
  boxNumber: number
  boxState: number | null
  setBoxState: (boxNumber: number | null) => void

  boxTitleId?: string
  boxButtonId?: string
  children: ReactNode
}

function Box(props: HomePageAccordionProps) {
  const {
    boxNumber,
    boxState,
    setBoxState,

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
        className={clsx("svgUp transition duration-300 mt-3", {
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

  const descriptionRef = useRef<HTMLDivElement>(null)

  const renderDescription = () => {
    return (
      <div
        ref={descriptionRef}
        className={clsx(
          "overflow-hidden leading-normal text-white transition-all duration-500 ease-in-out",
          {
            "line-clamp-1 h-6": !isOpen,
            "line-clamp-none": isOpen,
          }
        )}>
        {children}
      </div>
    )
  }

  useEffect(() => {
    if (!descriptionRef.current) return
    // if (isOpen) {
    //   const actualHeight = descriptionRef.current.scrollHeight || 0
    //   descriptionRef.current.style.height = `${actualHeight}px`
    // } else if (descriptionRef.current) {
    //   descriptionRef.current.style.height = "0"
    // }
    const timeout = setTimeout(() => setIsOpening(false), 500)
    return () => clearTimeout(timeout)
  }, [isOpen])

  return (
    <div
      id={boxButtonId}
      onClick={setBox}
      className={clsx(
        "mt-2 w-full cursor-pointer rounded flex border border-gray-50/10 p-4 shadow drop-shadow-2xl filter backdrop-blur-md transition-all duration-500 items-start min-h-[2rem]",
        {
          "bg-white/[5%] h-full": isOpen,
          "bg-white/[2%] h-fit": !isOpen,
        }
      )}>
      {renderDescription()}
      {renderArrows()}
      {/* <div
        className={clsx(
          "arrow cursor-pointer ring-offset-white transition-opacity duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        )}></div> */}
    </div>
  )
}

const SectionTitle = (props: { title: string }) => {
  return (
    <h2 className="font-font1 font-gloock mx-auto w-40 text-center text-2xl font-gloock drop-shadow-2xl md:w-full md:text-center md:text-5xl mb-4">
      {props.title}
    </h2>
  )
}

export default function HomePageAccordion() {
  const [boxState, setBoxState] = useState<number | null>(null)

  return (
    <div className="relative flex flex-col items-center content-center justify-center w-full  mx-auto mt-16">
      {/* <span aria-disabled className="z-0 faq-svg-bl" />
      <span aria-disabled className="z-0 faq-svg-tr" /> */}

      <SectionTitle title="About FanFares" />

      <Box
        boxTitleId="e2e-how-it-works-heading"
        boxButtonId="e2e-how-it-works-box"
        boxNumber={0}
        setBoxState={setBoxState}
        boxState={boxState}
      >
        <span>Freeing Creators from Advertisers through Lightning</span>
        <p
          id="e2e-how-it-works-text"
          className="block transition-all duration-1000"
        >
          FanFares is the nostr-based open source platform that empowers creators and
          audiences through Bitcoin Lightning micropayments. We're
          revolutionizing the way content is monetized, eliminating the need for
          intrusive ads and middlemen.
          <br/>
          With FanFares, podcast creators can set a small fee to purchase and unlock 
          their content, giving listeners access to an exclusive, ad-free experience.
          By harnessing the power of Bitcoin Lightning and Nostr, we're making
          it easy for you to support your favorite creators directly, while
          valuing your time and attention.
        </p>
      </Box>
      <Box boxNumber={1} setBoxState={setBoxState} boxState={boxState}>
        <span>Nostr-based and Open Source; this is podcasting for the Internet Money Era</span>
        <p className="block transition-all duration-1000">
          Nostr is the new social base layer for the internet. It's a decentralized social network that allows users to own their data and control their online presence. FanFares is built on top of Nostr, leveraging its features to create a seamless experience for podcast creators and listeners.
          <br/>
          When you purchase a podcast episode on FanFares via Lightning, it is unlocked with your Nostr identity. Simply login with any of the convenient methods and your ready to start listening with our convenient PWA.
        </p>
      </Box>
      <Box boxNumber={2} setBoxState={setBoxState} boxState={boxState}>
        <p className="block transition-all duration-1000">
          Join us in this new era of peer-to-peer communication and value
          exchange, where creators are fairly compensated and listeners enjoy a
          seamless, ad-free experience. Discover a world where content thrives
          without compromise on FanFares!
        </p>
      </Box>

    </div>
  )
}
