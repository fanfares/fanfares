"use client"
import clsx from "clsx"
import Image from "next/image"
import { useEffect, useRef } from "react"
import "../style/style.module.css"
const AboutExcaliburSection = () => {
  const ref1 = useRef<HTMLDivElement | null>(null)
  const ref2 = useRef<HTMLDivElement | null>(null)
  const ref3 = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("showAnimation")
          } else {
            entry.target.classList.remove("showAnimation")
          }
        })
      })

      const node1 = ref1.current
      const node2 = ref2.current
      const node3 = ref3.current

      if (node1) observer.observe(node1)
      if (node2) observer.observe(node2)
      if (node3) observer.observe(node3)

      return () => {
        if (node1) observer.unobserve(node1)
        if (node2) observer.unobserve(node2)
        if (node3) observer.unobserve(node3)
      }
    }
  }, [])

  return (
    <div className="relative z-50 flex flex-col max-w-4xl gap-20 px-4 mx-auto mt-20 text-sm text-justify md:px-8">
      <div className="absolute -left-60  h-[400px] w-[400px] bg-[url('/assets/featureSection1.svg')] bg-[length:400px_400px] bg-center bg-no-repeat md:-left-1/2 md:translate-x-1/2" />
      <div
        ref={ref1}
        className={clsx(
          "featureSectionAnimated relative flex flex-col items-center gap-8 transition-all duration-1000 md:flex-row"
        )}>
        <div id="podcasts-image" className="relative h-[200px] w-[200px]">
          <Image
            className="rounded drop-shadow-md"
            src={"/assets/podcast.webp"}
            alt=""
            layout="fill"
          />
        </div>
        <div className="">
          <h2 className="text-xl text-center md:text-start md:text-2xl">
            DECENTRALISED MEDIA
          </h2>
          <p className="max-w-sm mt-8 text-sm md:max-w-lg md:text-base">
            Creators can post their Podcasts on Excalibur. There is the option
            to gate the content so that the listener is required to make a
            bitcoin lightning payment before they listen. Some content may be
            given away for free and the listener has the option to give a tip
            using the Bitcoin wallet that they have connected.
          </p>
        </div>
      </div>
      <div
        ref={ref2}
        className={clsx(
          "featureSectionAnimated flex flex-col-reverse items-center gap-8 transition-all duration-1000 md:flex-row"
        )}>
        {" "}
        <div>
          <h2 className="flex text-xl text-center md:text-start md:text-2xl">
            AUDIOBOOKS
          </h2>
          <p className="max-w-sm mt-8 text-sm md:max-w-lg md:text-base">
            Share your Audiobook on Excalibur and your network can recommend it
            to their friends. The first chapter could be made free to access
            while the rest of the book requires the Bitcoin payment to gain
            access.
          </p>
        </div>
        <div className="relative h-[200px] w-[200px]">
          <Image
            className="rounded drop-shadow-md"
            src={"/assets/audiobook.webp"}
            alt=""
            layout="fill"
          />
        </div>
      </div>{" "}
      <div
        ref={ref3}
        className={clsx(
          "featureSectionAnimated relative flex flex-col items-center gap-8 transition-all duration-1000 md:flex-row"
        )}>
        <div className="relative h-[200px] w-[200px]">
          <Image
            className="rounded drop-shadow-md"
            src={"/assets/dao.webp"}
            alt=""
            layout="fill"
          />
        </div>
        <div>
          <h2 className="text-xl text-center uppercase md:text-start md:text-2xl">
            BUILD A COMMUNITY AROUND YOUR CONTENT{" "}
          </h2>
          <p className="max-w-sm mt-8 text-sm sm:mx-auto md:mx-0 md:max-w-lg md:text-base">
            Your customers can make comments when they share work. Discussions
            that follow can be valuable feedback for your creative efforts. You
            can reward your customers with sats when they share your content and
            help build your community of listeners.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutExcaliburSection
