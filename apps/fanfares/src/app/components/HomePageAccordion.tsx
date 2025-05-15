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

function Box({
  boxNumber,
  boxState,
  setBoxState,
  boxButtonId,
  boxTitleId,
  children,
}: HomePageAccordionProps) {
  const [isOpening, setIsOpening] = useState(false)
  const isOpen = boxNumber === boxState
  const descriptionRef = useRef<HTMLDivElement>(null)

  const setBox = () => {
    setIsOpening(true)
    setBoxState(isOpen ? null : boxNumber)
  }

  useEffect(() => {
    const timeout = setTimeout(() => setIsOpening(false), 500)
    return () => clearTimeout(timeout)
  }, [isOpen])

  return (
    <div
      id={boxButtonId}
      onClick={setBox}
      className={clsx(
        "mt-2 cursor-pointer w-full max-w-2xl rounded border border-gray-50/10 p-4 shadow drop-shadow-2xl backdrop-blur-md transition-all duration-500",
        {
          "bg-white/[5%] h-full": isOpen,
          "bg-white/[2%] h-fit": !isOpen,
        }
      )}>
      <div className="flex justify-between w-full items-start gap-4">
        <div
          ref={descriptionRef}
          className={clsx(
            "overflow-hidden text-white leading-normal transition-all duration-500 ease-in-out",
            {
              "line-clamp-1 h-6": !isOpen,
              "line-clamp-none": isOpen,
            }
          )}>
          {children}
        </div>

        <button
          className={clsx("svgUp mt-1 transition duration-300 shrink-0", {
            "rotate-180": isOpen,
            "rotate-0": !isOpen,
            "opacity-0": isOpening,
            "opacity-100": !isOpening,
          })}>
          <svg
            width="10"
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
      </div>
    </div>
  )
}

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="font-font1 font-gloock mx-auto w-40 text-center text-2xl font-gloock drop-shadow-2xl md:w-full md:text-center md:text-5xl mb-4">
    {title}
  </h2>
)

export default function HomePageAccordion() {
  const [boxState, setBoxState] = useState<number | null>(null)

  const sections = [
    {
      title: "The Problem",
      content: `The current digital content ecosystem is broken. Creators are trapped in a system where platforms extract excessive value, algorithms dictate visibility, and payment processors act as gatekeepers. Content monetization has become increasingly centralized, with platforms controlling who can earn and how much they receive.\n\nMeanwhile, audiences face fragmented subscription services, privacy violations, and a disconnect from directly supporting the creators they value.`,
    },
    {
      title: "The Solution: Fanfares",
      content: `Fanfares is a revolutionary system built on Bitcoin Lightning and Nostr that enables direct, sovereign payments for digital content. No intermediaries. No platform fees. No censorship.\n\nOur core innovation is simple yet powerful:\n– Creators publish content encrypted until payment is received\n– Payments are processed instantly through Lightning\n– Content is automatically decrypted and delivered\n– 50% referral fees incentivize organic sharing\n\nFanfares transforms the relationship between creators and audiences by removing platforms as middlemen and creating economic alignment that makes unauthorized sharing less profitable than legitimate recommendation.`,
    },
    {
      title: "How It Works",
      content: `For Creators:\n\nUpload audio content and set your price\nShare a simple link through existing channels\nReceive instant payments directly to your Lightning wallet\nBuild direct relationships with your audience through Nostr\n\nFor Listeners:\n\nDiscover content through existing channels or recommendations\nPay once with Lightning - no subscriptions or account setup\nAccess content instantly in your browser\nEarn 50% commission by recommending content you enjoy\n\nFor Podcasters:\n\nContinue publishing free episodes via RSS\nMention premium content in your show notes\nListeners click through to make Lightning payments\nContent unlocks and plays automatically\n\nFor Content Curators:\n\nDiscover exceptional content worth sharing\nEarn substantial income through referral commissions\nBuild a reputation for quality recommendations\nCreate a new entrepreneurial path independent of platforms`,
    },
    {
      title: "The Fanfares Difference",
      content: `Sovereign Infrastructure\n\nLightning Network payments for instant, low-fee transactions\nNostr protocol for censorship-resistant creator-audience relationships\nEncryption that unlocks only upon payment\nIntegrated wallets (powered by Coinos) for seamless user experience\n\nEconomic Alignment\n\n50% referral fees paid instantly through Prism payment splits\nPay-per-item model creates better quality signals than subscriptions\nDirect creator payments with no platform taking a cut\nPiracy disincentivized — sharing through legitimate referrals (earning 50%) is far more profitable than unauthorized distribution (earning nothing)\nInstant payment splits ensure referrers receive their commission immediately without waiting periods or minimum thresholds\n\nUser Sovereignty\n\nOwn your identity - use our Nostr keys or bring your own\nOwn your wallet - use our Lightning address or bring your own\nOwn your audience - no platform can come between you and your supporters\nOwn your content - no platform can demonetize or remove your work`,
    },
    {
      title: "Why Audio Content First?",
      content: `The podcast ecosystem already has a discovery infrastructure we can leverage\nAudio content creators are particularly vulnerable to platform dependency\nThe Bitcoin podcast community provides a perfect initial audience to demonstrate value\nQuality audio deserves fair compensation without platform intermediaries`,
    },
    {
      title: "The Rise of the Content Curator Entrepreneur",
      content: `Fanfares creates an entirely new entrepreneurial class: the professional content curator. Unlike platform algorithms that optimize for engagement metrics regardless of quality, human curators use judgment, taste, and expertise to identify truly valuable content worth sharing.\n\nHow Content Curator Entrepreneurs Transform the Digital Landscape:\n\nReplace Algorithms with Human Discernment: Curators apply contextual understanding and quality assessment that no algorithm can match.\nControl the Information Firehose: A distributed network of independent curators guides discovery.\nDrive Quality Through Economic Incentives: Commissions reward sharing of valuable content.\nBuild Trust-Based Discovery Networks: Reputation replaces engagement metrics.\nDemocratize Distribution Power: Anyone with good judgment and a network can succeed.\n\nThis curator economy represents a fundamental shift in how information flows online—replacing centralized algorithmic control with a decentralized network of human experts whose economic interests align perfectly with both creators and audiences.`,
    },
    {
      title: "A Critical Inflection Point for Humanity",
      content: `Fanfares represents far more than a content monetization solution—it's a vital reclamation of human agency in our digital future.\n\nFulfilling Bitcoin's Original Promise: Fanfares makes Bitcoin useful for millions of small payments between individuals, fulfilling its destiny as sovereign digital cash.\n\nBreaking Free from Algorithmic Manipulation: Fanfares offers an alternative where human judgment, not platform optimization, determines what thrives.\n\nSecuring Human Agency Before It's Too Late: If platforms dominate immersive digital discovery (AR, VR, neural interfaces), human autonomy may be lost. Fanfares builds aligned incentives now, while we still can.`,
    },
    {
      title: "Join the Movement",
      content: `Fanfares isn't just an app—it's a movement toward true digital sovereignty for creators and audiences. The first content available will be an audiobook called \"Digital Sovereignty\" explaining the philosophy and technology behind this model.\n\nBy purchasing the audiobook, you’ll understand the vision—and earn 50% from anyone you recommend it to, instantly paid via Lightning.\n\nThe future of digital content isn’t more extractive platforms. It’s direct creator-audience relationships powered by Bitcoin.`,
    },
    {
      title: "Get Started",
      content: `Whether you're a creator looking to monetize content on your terms or a listener who wants to directly support quality work, Fanfares provides the infrastructure for true digital sovereignty.\n\nNo analytics. No algorithms. No intermediaries. Just quality content, fairly paid for.`,
    },
  ]

  return (
    <div className="relative flex flex-col items-center justify-center w-full mx-auto mt-16 px-4">
      <SectionTitle title="About FanFares" />
      {sections.map((section, index) => (
        <Box
          key={index}
          boxNumber={index}
          boxState={boxState}
          setBoxState={setBoxState}>
          <p className="whitespace-pre-line">{section.content}</p>
        </Box>
      ))}
    </div>
  )
}
