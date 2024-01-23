import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faPauseCircle,
  faPlayCircle,
} from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Truculenta } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"

export interface AudioPlayerProps {
  audioUrl?: string
}

export function AudioPlayer(props: AudioPlayerProps) {
  const { audioUrl } = props;


  // const router = useRouter()
  // const playThreshold = getConfig().playedThreshold

  // const {
  //   playerUpdateSizeAndDuration,
  //   playerMediaKey,
  //   playerMediaAccount,
  //   playerHasMinted,
  //   playerCreatorAccount,
  //   playerAudioUrl,
  //   playerThumbnailUrl,
  //   playerIsPlaying,
  //   playerTogglePlaying,
  //   playerIsGlobalPlayerShowing,
  //   playerShowGlobalPlayer,
  //   playerHideGlobalPlayer,
  //   playerIsLoading,
  //   playerGetIcon,
  //   mediaModalOpenDonate,
  //   mediaModalOpenMint,
  //   mediaModalOpenShare,
  // } = useAppState()

  //--------------- STATES ------------------
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [volume, setVolume] = useState<number>(80)
  const [playerIsGlobalPlayerShowing, setPlayerIsGlobalPlayerShowing] =
    useState<boolean>(false)

  // --------------- REFERENCES---------------
  const audioPlayer = useRef<HTMLAudioElement>(null)
  const audioBar = useRef<HTMLInputElement>()
  const progressBar = useRef<HTMLInputElement>()
  const animationRef = useRef<number>()
  const previousTime = useRef<number>(0)
  const listenedDuration = useRef<number>(0)
  const playCountTicked = useRef<boolean>(false)

  //--------------- UTILS ---------------

  // const title =
  //   playerMediaAccount?.name ??
  //   getTruncatedPublicKey(playerMediaAccount.key ?? PublicKey.default)
  // const creatorName =
  //   playerCreatorAccount?.name ??
  //   getTruncatedPublicKey(playerCreatorAccount.key ?? PublicKey.default)
  // const isMintingFrozen = playerMediaAccount.isMintingFrozen

  // const backToPlayer = async () => {
  //   await router.push(`/player/${playerMediaKey.toString()}`)
  // }

  const toggleShowing = () => {
    setPlayerIsGlobalPlayerShowing(!playerIsGlobalPlayerShowing)
    // if (playerIsGlobalPlayerShowing) {
    //   playerHideGlobalPlayer()
    // } else {
    //   playerShowGlobalPlayer()
    // }
  }

  //--------------- FUNCTIONS ---------------

  const onLoad = useCallback(async () => {
    let rawDuration = audioPlayer.current?.duration
    //   if (isNaN(rawDuration)) rawDuration = 0
    //   const seconds = Math.floor(rawDuration)

    //   playerUpdateSizeAndDuration(rawDuration)
    //   setDuration(seconds)

    //   if (progressBar.current) {
    //     progressBar.current.max = seconds.toString()
    //   }

    //   if (playerIsPlaying) play()
    //   // eslint-disable-next-line
    //
  }, ["playerAudioUrl"])

  // const tickMediaPlayed = useCallback(() => {
  //   if (playCountTicked.current) return

  //   const deltaTime = audioPlayer.current.currentTime - previousTime.current
  //   previousTime.current = audioPlayer.current.currentTime

  //   if (deltaTime < 1) {
  //     listenedDuration.current = listenedDuration.current + deltaTime
  //   }

  //   if (listenedDuration.current >= duration * playThreshold) {
  //     tickFirebaseMediaPlaysUnsafe(playerMediaKey)
  //     playCountTicked.current = true
  //   }
  // }, [
  //   audioPlayer,
  //   previousTime,
  //   playCountTicked,
  //   duration,
  //   // playerMediaKey,
  //   // tickFirebaseMediaPlaysUnsafe,
  // ])

  const changePlayerCurrentTime = useCallback(() => {
    if (progressBar.current) {
      progressBar.current.style.setProperty(
        "--seek-before-width",
        `${(Number(progressBar.current.value) / duration) * 100}%`
      )
      setCurrentTime(Number.parseInt(progressBar.current.value))
    }
    // eslint-disable-next-line
  }, [duration, setCurrentTime])

  // const whilePlaying = useCallback(() => {
  //   if (audioPlayer.current) {
  //     if (progressBar.current) {
  //       // Set listened duration

  //       tickMediaPlayed()

  //       // Set progress bar
  //       progressBar.current.value = audioPlayer.current.currentTime.toString()
  //     }
  //     changePlayerCurrentTime()
  //     animationRef.current = requestAnimationFrame(whilePlaying)
  //   } else {
  //     cancelAnimationFrame(animationRef.current)
  //   }
  //   // eslint-disable-next-line
  // }, [changePlayerCurrentTime])

  // const play = useCallback(async () => {
  //   await audioPlayer.current.play()
  //   animationRef.current = requestAnimationFrame(whilePlaying)
  //   // eslint-disable-next-line
  // }, [audioPlayer, animationRef, whilePlaying])

  // const pause = useCallback(() => {
  //   if (audioPlayer.current) {
  //     audioPlayer.current.pause()
  //     cancelAnimationFrame(animationRef.current)
  //   }
  //   // eslint-disable-next-line
  // }, [audioPlayer, animationRef])

  // useEffect(() => {
  //   // Corss Origin is needed for Arweave to resolve
  //   // setListenedDuration(0);
  //   previousTime.current = 0
  //   listenedDuration.current = 0
  //   playCountTicked.current = false
  //   audioPlayer.current.crossOrigin = "anonymous"
  //   audioPlayer.current.onloadeddata = onLoad
  // }, [
  //   audioPlayer,
  //   playerAudioUrl,
  //   listenedDuration,
  //   playCountTicked,
  //   previousTime,
  // ])

  // useEffect(() => {
  //   if (!playerIsLoading && playerIsPlaying) {
  //     play()
  //   } else {
  //     pause()
  //   }
  // }, [pause, play, playerIsPlaying, playerIsLoading])

  //--------------- CONTROLS ---------------

  // const changeVolume = e => {
  //   audioPlayer.current.volume = Number.parseInt(audioBar.current.value) / 100
  //   setVolume(Number(e.target.value))
  // }

  // const changeRange = () => {
  //   audioPlayer.current.currentTime = Number.parseInt(progressBar.current.value)
  //   changePlayerCurrentTime()
  // }

  // const back15 = () => {
  //   progressBar.current.value = Math.max(
  //     Number(progressBar.current.value) - 15,
  //     0
  //   ).toString()
  //   changeRange()
  // }

  // const forward15 = () => {
  //   progressBar.current.value = Math.min(
  //     Number(progressBar.current.value) + 15,
  //     duration
  //   ).toString()
  //   changeRange()
  // }

  //--------------- RENDERERS ---------------

  const renderPodcastInfo = () => {
    return (
      <>
        <div className="absolute left-16 top-4 max-w-[268px] md:top-3 md:max-w-md">
          <p className="text-sm font-bold truncate text-skin-base md:w-full md:text-base">
            {/* {title} */}
          </p>

          <Link
            className="mt-1 flex w-40 truncate text-[0.7rem] text-skin-muted hover:underline md:w-64 md:text-[1rem] md:text-xs"
            href={"/creator/" + "owner"}>
            Creator
          </Link>
        </div>
      </>
    )
  }

  const renderPodcastPFP = () => {
    return (
      <>
        <div className="absolute left-2 top-6 ">
          <Image
            // loader={contentfulLoader}
            src={""}
            alt=""
            width={50}
            height={50}
            className="rounded-full"
            layout={"intrinsic"}
          />
        </div>
      </>
    )
  }

  const renderProgressBar = () => {
    return (
      <>
        <div className="absolute bottom-2 left-2 flex w-[90%] items-center justify-center gap-x-2">
          <p className="text-xs text-skin-muted">
            {/* {printPlayerTime(currentTime)} */}
          </p>
          <input
            aria-label="Player progress bar"
            type="range"
            className="progressBar w-full "
            defaultValue="0"
            // ref={progressBar}
            onChange={() => {}}
          />
          <p className="text-xs text-skin-muted">
            {/* {printPlayerTime(duration)} */}
          </p>
        </div>
      </>
    )
  }

  // const renderBackToPlayerMenuItem = () => {
  //   if (!backToPlayer) return null
  //   return (
  //     <Menu.Item>
  //       {() => (
  //         <>
  //           <button
  //             onClick={backToPlayer}
  //             className="flex rounded-t-lg bg-black px-4 py-3 text-sm text-white hover:bg-skin-button-accent-hover active:bg-violet-300 active:text-black">
  //             Back to Player
  //           </button>
  //           <hr className="mx-auto mt-[-1px] w-[80%] border-buttonDisabled"></hr>
  //         </>
  //       )}
  //     </Menu.Item>
  //   )
  // }

  // const renderDonateMenuItem = () => {
  //   return (
  //     <Menu.Item>
  //       {() => (
  //         <>
  //           <button
  //             aria-label="Make a donation"
  //             onClick={mediaModalOpenDonate}
  //             className={`flex bg-black px-4 py-3 text-sm text-white hover:bg-skin-button-accent-hover active:bg-violet-300 active:text-black ${
  //               !backToPlayer ? " rounded-t-lg" : ""
  //             }`}>
  //             Contribute
  //           </button>
  //           <hr className="mx-auto mt-[-1px] w-[80%] border-buttonDisabled"></hr>
  //         </>
  //       )}
  //     </Menu.Item>
  //   )
  // }

  // const renderMintMenuItem = () => {
  //   const disabled = isMintingFrozen || playerHasMinted
  //   return (
  //     <Menu.Item>
  //       {() => (
  //         <>
  //           <button
  //             aria-label="Mint Audio NFT"
  //             disabled={disabled}
  //             onClick={mediaModalOpenMint}
  //             className={`flex bg-black px-4 py-3 text-sm text-white hover:bg-skin-button-accent-hover active:bg-violet-300 active:text-black ${
  //               isMintingFrozen && !playerHasMinted ? "line-through" : ""
  //             } ${disabled ? "opacity-50" : ""}`}>
  //             {isMintingFrozen ? "❄️ " : ""}
  //             {playerHasMinted ? "Already Minted ⭐️" : "Mint Audio NFT"}
  //             {isMintingFrozen ? " ❄️" : ""}
  //           </button>
  //           <hr className="mx-auto mt-[-1px] w-[80%] border-buttonDisabled"></hr>
  //         </>
  //       )}
  //     </Menu.Item>
  //   )
  // }

  // const renderShareMenuItem = () => {
  //   return (
  //     <Menu.Item>
  //       {() => (
  //         <button
  //           aria-label="Share episode on Socials"
  //           onClick={mediaModalOpenShare}
  //           className="flex rounded-b-lg bg-black px-4 py-3 text-sm text-white hover:bg-skin-button-accent-hover active:bg-violet-300 active:text-black">
  //           Share
  //         </button>
  //       )}
  //     </Menu.Item>
  //   )
  // }

  // const renderActionMenu = () => {
  //   return (
  //     <Menu>
  //       <Menu.Button aria-label="Open Menu">
  //         <FontAwesomeIcon
  //           className="h-4 w-4 rounded bg-skin-button-accent p-1 hover:bg-skin-button-accent-hover hover:text-buttonAccent"
  //           icon={faEllipsisH}
  //         />
  //       </Menu.Button>
  //       <Menu.Items
  //         aria-label="Select one option"
  //         className="absolute bottom-20 right-0 z-50 flex w-36 flex-col font-bold">
  //         {renderBackToPlayerMenuItem()}
  //         {renderDonateMenuItem()}
  //         {renderMintMenuItem()}
  //         {renderShareMenuItem()}
  //       </Menu.Items>
  //     </Menu>
  //   )
  // }

  // const renderVolumeMenu = () => {
  //   return (
  //     <Menu>
  //       <Menu.Button aria-label="Adjust volume">
  //         <FontAwesomeIcon
  //           className="h-4 w-4 rounded bg-skin-button-accent p-1 hover:bg-skin-button-accent-hover hover:text-buttonAccent"
  //           icon={faVolume}
  //         />
  //       </Menu.Button>
  //       <Menu.Items className="absolute bottom-[90px] left-[-59px] flex h-10 w-36 rotate-[270deg] flex-col items-center justify-center rounded-l-md bg-black py-2 font-bold">
  //         <Menu.Item aria-label="Volume bar">
  //           {() => (
  //             <>
  //               <input
  //                 className="volumeControlBar"
  //                 type="range"
  //                 min="0"
  //                 max="100"
  //                 value={volume}
  //                 ref={audioBar}
  //                 onChange={e => changeVolume(e)}
  //               />
  //               <p className="0 absolute -right-8 -z-40 w-10 rotate-90 rounded-t-md bg-black py-3 text-center text-xs text-skin-muted">
  //                 {volume}%
  //               </p>
  //             </>
  //           )}
  //         </Menu.Item>
  //       </Menu.Items>
  //     </Menu>
  //   )
  // }

  const renderRightMenuButtons = () => {
    return (
      <>
        <div className="absolute right-4 top-5 flex flex-col gap-2">
          {/* {renderActionMenu()} */}
          {/* {renderVolumeMenu()} */}
        </div>
      </>
    )
  }

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

  const renderPlayerControlButtons = () => {
    return (
      <>
        {/* CONTROL BUTTONS */}
        <div className="absolute inset-y-0 bottom-0 right-4 flex w-40 items-center justify-center gap-x-2 md:bottom-0">
          <FontAwesomeIcon
            aria-label="Back 15 seconds"
            className="hover:text-buttonAccentHover w-4 md:w-6"
            icon={faArrowRotateLeft}
            onClick={() => {}}
          />

          <FontAwesomeIcon
            aria-label="Play/Pause"
            className="hover:text-buttonAccentHover w-8 md:w-10"
            icon={isPlaying ? faPauseCircle : faPlayCircle}
            onClick={playerTogglePlaying}
          />
          {/* <FontAwesomeIcon
            aria-label="Play/Pause"
            className="text-2xl hover:text-buttonAccentHover md:text-4xl"
            icon={faPauseCircle}
            onClick={() => {
              audioPlayer.current?.pause()
            }}
          /> */}
          <FontAwesomeIcon
            aria-label="Forward 15 seconds"
            className="text-xl hover:text-buttonAccentHover w-4 md:w-6"
            icon={faArrowRotateRight}
            onClick={() => {}}
          />
        </div>
      </>
    )
  }

  const renderAudioPlayerBigScreen = () => {
    return (
      <div className="fixed left-0 z-50 justify-center w-full h-10 -bottom-1 ">
        <audio
          ref={audioPlayer}
          src={audioUrl}
          preload="metadata"></audio>
        <div
          className={`absolute bottom-3 w-full max-w-7xl rounded-2xl border-t-2 border-buttonAccentHover transition-transform duration-300 ease-linear md:bottom-5 md:left-60 md:w-[70%] 
          ${
            playerIsGlobalPlayerShowing
              ? " md:translate-y-2"
              : "translate-y-[6.5rem] transform md:translate-y-[7rem]"
          }
          ${isPlaying ? "translate-y-0" : null}
         `}>
          <div className="relative grid items-center float-left w-full p-4 rounded-lg bg-fill/50 h-28 gap-x-2 drop-shadow-md backdrop-blur-md ">
            {renderPodcastPFP()}
            {renderPodcastInfo()}
            {renderProgressBar()}
          </div>
          {renderPlayerControlButtons()}
          {renderRightMenuButtons()}
          <button
            aria-label="Hide/Show player"
            onClick={toggleShowing}
            className="absolute block w-32 p-1 text-xs border-2 border-b-0 outline-none 2xl -top-7 left-5 rounded-t-2xl border-buttonAccentHover text-skin-muted backdrop-blur-md">
            {playerIsGlobalPlayerShowing ? "Hide " : "Show "}
            Player
          </button>
        </div>
      </div>
    )
  }

  // const renderAudioPlayerMobile = () => {
  //   return (
  //     <div className="fixed left-0 z-40 flex flex-row items-center w-full h-12 bottom-16 bg-skin-fill ">
  //       <audio
  //         ref={audioPlayer}
  //         src={playerAudioUrl}
  //         preload="metadata"></audio>
  //       <div className="absolute flex items-center justify-center w-full -top-1 gap-x-2">
  //         <input
  //           aria-label="Player progress bar"
  //           type="range"
  //           className="w-full rounded-none progressBar "
  //           defaultValue="0"
  //           ref={progressBar}
  //           onChange={changeRange}
  //         />
  //       </div>
  //       <div className="mx-2 mt-2">
  //         <Image
  //           loader={contentfulLoader}
  //           src={playerThumbnailUrl}
  //           alt=""
  //           width={40}
  //           height={40}
  //           className=""
  //           layout={"intrinsic"}
  //         />
  //       </div>
  //       <div>
  //         <p className="font-bold truncate text-skin-base">{title}</p>
  //         <Link
  //           className=""
  //           href={
  //             "/creator/" + playerCreatorAccount.creatorKey.toString() ??
  //             "owner"
  //           }>
  //           <a className="mt-1 flex w-40 truncate text-sm text-skin-muted hover:underline md:w-64 md:text-[1rem] md:text-xs">
  //             {creatorName}
  //           </a>
  //         </Link>
  //       </div>{" "}
  //       <FontAwesomeIcon
  //         aria-label="Play/Pause"
  //         className="ml-auto mr-8 text-3xl"
  //         icon={playerGetIcon()}
  //         onClick={playerTogglePlaying}
  //       />{" "}
  //     </div>
  //   )
  // }

  return (
    // <Media
    //   queries={{
    //     mobile: "(max-width: 768px)",
    //     bigScreen: "(min-width: 769px)",
    //   }}>
    //   {matches => (
    //     <Fragment>
    //       {matches.mobile && renderAudioPlayerMobile()}
    //       {matches.bigScreen && renderAudioPlayerBigScreen()}
    //     </Fragment>
    //   )}
    // </Media>
    <>{renderAudioPlayerBigScreen()}</>
  )
}
