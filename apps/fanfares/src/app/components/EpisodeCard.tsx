import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faPauseCircle,
  faPlayCircle,
} from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { useNostr } from "../controllers/state/nostr-slice"

interface EpisodeCardProps {
  imgUrl: string
  title: string
  description: string
  onClick?: () => void
  episodeUrl?: string
  audioUrl?: string
  creatorName?: string
  creatorProfilePicture?: string
}

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
        className="e2e-podcast-tile group md:w-64 lg:w-72  w-full cursor-pointer flex md:flex-col  md:items-start justify-start rounded-lg border border-buttonAccent p-2 transition duration-300 ease-linear md:hover:scale-105 md:hover:bg-black/[10%] md:h-64 gap-2">
        <div className="flex items-center w-20 rounded-lg md:transition md:duration-300 md:w-full group/playButton md:h-36 md:group-hover:brightness-110">
          {/* //should be IMAGE, this is just mocking */}

          <div className="w-full h-full md:w-40 flex items-center justify-center relative border rounded-md border-buttonAccent drop-shadow-2xl mx-auto">
            <Image
              src={props.imgUrl}
              alt={" thumbnail"}
              width={300}
              height={300}
              className=" w-full h-full rounded-md"
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
        </div>
        {/* <div className="mt-2 h-full flex w-full flex-col items-start border-white/[10%] justify-start truncate line-clamp-2"></div> */}
        <div className="flex-col flex-1 w-40 md:w-full mt-1 space-y-2 md:px-2 relative">
          <div className="flex items-center gap-2">

            <img
              src={props.creatorProfilePicture ?? props.imgUrl}
              className="rounded-full w-9 h-9 border-2 border-buttonAccentHover"
              alt="Creator profile image"
            />
            <div className="flex flex-col">
              {" "}
              <p className="e2e-podcast-title text-xs font-bold uppercase md:leading-[18px] md:text-sm md:w-full truncate mr-auto ">
                {/* {metadataNameSlicer()} */}
                {props.title}
              </p>
              <p className="text-xs font-thin md:text-xs/4 text-skin-inverted">
                {props.creatorName}
              </p>
            </div>
          </div>
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
