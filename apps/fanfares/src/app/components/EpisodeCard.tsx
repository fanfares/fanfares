import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faPauseCircle,
  faPlayCircle,
} from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRef, useState } from "react"

interface EpisodeCardProps {
  imgUrl: string
  title: string
  description: string
  onClick?: () => void
  episodeUrl?: string
  audioUrl?: string
}

import Image from "next/image"

function EpisodeCard(props: EpisodeCardProps) {
  const { imgUrl, title, description, onClick, episodeUrl, audioUrl } = props
  const audioPlayer = useRef<HTMLAudioElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  function playerTogglePlaying() {
    if (!isPlaying) {
      audioPlayer.current?.play()
      setIsPlaying(!isPlaying)
    } else {
      audioPlayer.current?.pause()
      setIsPlaying(!isPlaying)
    }
  }

  //
  return (
    <section onClick={onClick} className="">
      <Link
        href={props.episodeUrl || "/player"}
        className="e2e-podcast-tile group md:w-40 h-28 w-full cursor-pointer flex md:flex-col  md:items-center justify-start rounded-lg border border-buttonAccent p-2 transition duration-300 ease-linear md:hover:scale-105 md:hover:bg-black/[10%] md:h-64 gap-2

        ">
        <div className="flex items-start md:items-center w-20 rounded-lg md:transition md:duration-300 md:w-full group/playButton md:h-36 md:group-hover:brightness-110 relative">
          {/* //should be IMAGE, this is just mocking */}

          <Image
            src={props.imgUrl}
            alt={" thumbnail"}
            width={300}
            height={300}
            className="border rounded-md border-buttonAccent drop-shadow-2xl"
          />
          {/* {props.audioUrl ? (
            <section>
              <div className="absolute inset-0 z-10 hover:bg-black/40 bg-skin-fill/40 flex items-center justify-center rounded-lg">
                <FontAwesomeIcon
                  aria-label="Play/Pause"
                  className="text- border-2 border-buttonAccentHover rounded-full w-8 md:w-10"
                  icon={isPlaying ? faPauseCircle : faPlayCircle}
                  onClick={playerTogglePlaying}
                />
              </div>
              <audio ref={audioPlayer} src={props.audioUrl} className="hidden"/>
            </section>
          ) : null} */}
        </div>
        {/* <div className="mt-2 h-full flex w-full flex-col items-start border-white/[10%] justify-start truncate line-clamp-2"></div> */}
        <div className="flex-col flex-1 w-40 md:mt-2 space-y-2 md:px-2 relative">
          <p className="e2e-podcast-title text-base font-semiboldbold md:font-bold uppercase md:leading-[18px] md:text-sm md:w-11/12 truncate mr-auto ">
            {/* {metadataNameSlicer()} */}
            {props.title}
          </p>
          <p className="tracking-tight text-xs/4 line-clamp-2 md:text-xs/4">
            {props.description}
          </p>
          {/* <p className="ml-auto text-xs font-thin text-right md:text-start absolute bottom-0">
            D 01/01/01 H 01:01:00
          </p>{" "} */}
          {/* {renderDateAndTime()} */}
        </div>
      </Link>
    </section>
  )
}

export default EpisodeCard
