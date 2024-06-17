"use client"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import {
  faCloudArrowUp,
  faGlobe,
  faPlay,
  faPodcast,
} from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import {
  usePlayerPageIsPlaying,
  usePlayerPagePodcast,
} from "../controllers/state/player-page-slice"

const MobileBottomNavbar = () => {
  const nav = useRef<HTMLDivElement>(null)

  const renderMobileLink = (
    href: string,
    icon: IconDefinition,
    text: string,
    className?: string
  ) => {
    // const isCurrent = isCurrentLink(href)
    const isCurrent = false

    return (
      <Link
        passHref
        href={href}
        arial-label={text}
        className={`group flex cursor-pointer  flex-col items-center justify-start active:scale-95 active:text-skin-inverted gap-2${
          isCurrent ? "text-buttonAccentHover  " : "text-white"
        } `}>
        <FontAwesomeIcon
          icon={icon}
          className={`flex w-8 h-8 justify-center text-xl group-hover:text-skin-muted  ${
            isCurrent ? "text-buttonAccentHover" : "text-white"
          } `}
        />

        <p className="mt-1 text-xs font-semibold"> {text}</p>
      </Link>
    )
  }

  const isPlaying = usePlayerPageIsPlaying()
  const podcast = usePlayerPagePodcast()

  // useLayoutEffect(() => {
  //   const el = document.getElementById("main-content-container-element")
  //   if (el) {
  //     if (nav && nav.current) {
  //       el.classList.remove("h-screen")
  //       el.style.height = `calc(${nav.current.offsetTop - el.offsetTop}px)`
  //     }
  //   }
  // })

  return (
    <div
      ref={nav}
      id="#e2e-navbar-mobile-container"
      className={`fixed bottom-0 right-0 left-0 z-40 grid  items-center justify-evenly w-screen h-16 space-x-4 overflow-hidden bg-black border-t-2 border-buttonAccentHover md:hidden 
      ${isPlaying ? "grid-cols-4" : "grid-cols-3"}`}>
      {renderMobileLink("/discover", faPodcast, "Podcasts")}
      {renderMobileLink("/feed", faGlobe, "Nostr Feed")}
      {renderMobileLink("/upload", faCloudArrowUp, "Upload")}
      {isPlaying
        ? renderMobileLink(`/player/${podcast?.gate.note.id}`, faPlay, "Player")
        : null}
    </div>
  )
}

export default MobileBottomNavbar
