import React, { useRef } from "react"
import EpisodeCard from "./EpisodeCard"
import Link from "next/link"
import Image from "next/image"

interface PodcastsCarouselProps {
  episodes: {
    imgUrl: string
    description: string
    title: string
    episodeUrl?: string
  }[]
}

function PodcastsCarousel(props: PodcastsCarouselProps) {
  const { episodes } = props
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollDistance = 160
  const transitionDuration = 1000

  const handleNext = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current

      const isLastItemVisible = scrollLeft + clientWidth === scrollWidth

      if (isLastItemVisible) {
        scrollTo(0)
      } else {
        const newScrollLeft = scrollLeft + scrollDistance
        scrollTo(newScrollLeft)
      }
    }
  }

  const handlePrev = () => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current

      const isFirstItemVisible = scrollLeft === 0

      if (isFirstItemVisible) {
        const lastEpisodeScrollLeft =
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth
        scrollTo(lastEpisodeScrollLeft)
      } else {
        const newScrollLeft =
          (carouselRef.current.scrollLeft ?? 0) - scrollDistance
        scrollTo(newScrollLeft)
      }
    }
  }

  const scrollTo = (targetScrollLeft: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      })

      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = ""
        }
      }, transitionDuration)
    }
  }

  return (
    <div className="flex items-center relative overflow-hidden h-64 px-12">
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-skin-button-accent/90 w-8 h-8 flex items-center text-center justify-center text-xs rounded-full z-10 hover:bg-skin-button-accent"
        onClick={handlePrev}>
        &lt;
      </button>
      <div
        ref={carouselRef}
        className="flex gap-2 overflow-hidden items-center h-64 transition-all ease-linear">
        {episodes.map((episode, index) => (
          <Link
            key={index}
            href={`/player/${episode.episodeUrl!}`}
            className="e2e-podcast-tile items-center group cursor-pointer flex flex-col justify-center rounded-lg border border-buttonAccent p-2 transition duration-300 ease-linear md:hover:bg-black/[10%] gap-2 w-44">
            <div className="flex items-center rounded-lg md:transition md:duration-300  group/playButton md:h-36 md:group-hover:brightness-110">
              <div className="w-full h-full flex  items-center justify-center relative border rounded-md border-buttonAccent drop-shadow-2xl mx-auto">
                <Image
                  src={episode.imgUrl}
                  alt={" thumbnail"}
                  width={300}
                  height={300}
                  className=" w-full h-full rounded-md object-cover"
                />
              </div>
            </div>
            <div className="flex-col flex-1 w-40 md:w-full mt-1 space-y-2 md:px-2 relative">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  {" "}
                  <p className="e2e-podcast-title text-xs font-bold uppercase md:leading-[18px] md:text-sm md:w-full truncate mr-auto ">
                    {/* {metadataNameSlicer()} */}
                    {episode.title}
                  </p>
                </div>
              </div>
              <p className="tracking-tight text-xs/4 line-clamp-2 md:text-xs/4">
                {episode.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-skin-button-accent/90 w-8 h-8 flex items-center text-center justify-center text-xs rounded-full z-10 hover:scale-105 hover:bg-skin-button-accent"
        onClick={handleNext}>
        &gt;
      </button>
    </div>
  )
}

export default PodcastsCarousel
