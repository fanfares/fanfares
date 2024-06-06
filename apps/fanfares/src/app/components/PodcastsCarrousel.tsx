import React, { useRef } from "react"
import EpisodeCard from "./EpisodeCard"

interface PodcastsCarouselProps {
  episodes: {
    imgUrl: string
    description: string
    title: string
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
    <div className="flex items-center relative overflow-hidden h-64">
      <button
        className="absolute left-2 top-1/2 transform  -translate-y-1/2 bg-skin-button-accent/90 w-8 h-8 flex items-center text-center justify-center text-xs rounded-full z-10 hover:scale-105 hover:bg-skin-button-accent"
        onClick={handlePrev}>
        &lt;
      </button>
      <div
        ref={carouselRef}
        className="flex gap-2 overflow-hidden items-center h-64 transition-all ease-linear">
        {episodes.map((episode, index) => (
          <EpisodeCard
            key={index}
            imgUrl={episode.imgUrl}
            description={episode.description}
            title={episode.title}
          />
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
