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

  const descriptionRef = useRef<HTMLDivElement>(null)

  const renderDescription = () => {
    return (
      <div
        ref={descriptionRef}
        className={clsx(
          "overflow-hidden leading-normal text-white transition-all duration-500 ease-in-out",
          {
            "line-clamp-2": !isOpen,
            "line-clamp-none": isOpen,
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
    } else if (descriptionRef.current) {
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
        "mt-2  w-full cursor-pointer rounded  border border-gray-50/10 p-4 shadow drop-shadow-2xl filter backdrop-blur-md transition-all duration-500 ",
        {
          "bg-white/[5%] h-full": isOpen,
          "bg-white/[2%] h-10": !isOpen,
        }
      )}>
      {renderDescription()}
      <div
        className={clsx(
          "arrow cursor-pointer ring-offset-white transition-opacity duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        )}>
        {renderArrows()}
      </div>
    </div>
  )
}

const SectionTitle = (props: { title: string }) => {
  return (
    <>
      <h2 className="font-font1 mx-auto w-40 text-center text-2xl font-black uppercase drop-shadow-2xl md:w-full md:text-center md:text-5xl">
        {props.title}
      </h2>
    </>
  )
}

export default function HomePageAccordion() {
  const [boxState, setBoxState] = useState<number | null>(null)

  return (
    <div className="relative flex flex-col items-center content-center justify-center w-full px-8 mx-auto mt-24">
      {/* <span aria-disabled className="z-0 faq-svg-bl" />
      <span aria-disabled className="z-0 faq-svg-tr" /> */}
      <div className="w-full mx-auto ">
        <SectionTitle title="About Us" />
      </div>
      <div className="w-full lg:w-3/4">
        <Box
          boxTitleId="e2e-how-it-works-heading"
          boxButtonId="e2e-how-it-works-box"
          boxNumber={0}
          setBoxState={setBoxState}
          boxState={boxState}>
          <p
            id="e2e-how-it-works-text"
            className="block mt-2 transition-all duration-1000">
            Bitcoin Lightning is the breakthrough micropayment technology many
            have eagerly awaited for decades, and now it's finally here. At
            FanFares, we're harnessing this technology to liberate creators and
            their audiences from the influence of advertisers.
          </p>
        </Box>
        <Box boxNumber={1} setBoxState={setBoxState} boxState={boxState}>
          <p className="block mt-2">
            The internet has long been a catalyst for disintermediation of
            systems where middlemen have control and siphon off the majority of
            the value created. With Bitcoin Lightning and Nostr, we're taking
            another stride towards empowering peer-to-peer communication and the
            exchange of value.
          </p>
        </Box>
        <Box boxNumber={2} setBoxState={setBoxState} boxState={boxState}>
          <p className="block mt-2">
            We understand human nature, and it is a true fact that most people
            are basically lazy. We all tend to take the most convenient route
            wherever possible. While we all believe in compensating creators for
            their efforts, in a world accustomed to free access, many simply
            don't pay unless prompted.
          </p>
        </Box>

        <Box boxNumber={3} setBoxState={setBoxState} boxState={boxState}>
          <p className="">
            On FanFares, the creators of a podcast can set a fee for accessing a
            podcast. Listeners get to enjoy every episode without being
            interrupted with ads. They get back those few minutes of their
            lives, which is worth the value of the sats to most of us because
            our time is even more scarce than bitcoin!
          </p>{" "}
        </Box>
      </div>
    </div>
  )
}
