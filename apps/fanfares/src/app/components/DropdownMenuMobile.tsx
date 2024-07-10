"use client"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useRouter } from "next/navigation"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Logo from "../assets/logo.svg"

import {
  faQuestionCircle,
  faGlobe,
  faPodcast,
  faBolt,
  faBars,
  faHome,
  faPerson,
  faUser,
  faLock,
  faLockA,
  faLockOpen,
  faUserSlash,
} from "@fortawesome/pro-solid-svg-icons"
import { FaPodcast } from "react-icons/fa"
import { useAccountProfile } from "../controllers/state/account-slice"
import Image from "next/image"
import Link from "next/link"
import { usePlayerPageIsPlaying } from "../controllers/state/player-page-slice"

export default function DropdownMenuMobile() {
  const router = useRouter()
  const accountProfile = useAccountProfile()
  const isPlaying = usePlayerPageIsPlaying()

  const logoff = () => {
    document.dispatchEvent(new Event("nlLogout"))
  }
  const login = () => {
    document.dispatchEvent(new Event("nlLaunch"))
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-white bg-transparent shadow-[0_2px_10px] shadow-black outline-none hover:bg-skin-button-accent-hover focus:shadow-[0_0_0_2px] focus:shadow-transparent"
          aria-label="Customise options">
          {/* <HamburgerMenuIcon /> */}
          <FontAwesomeIcon icon={faBars} className="w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-black/90 backdrop-blur-sm rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}>
          <DropdownMenu.Item
            onClick={() => {
              router.push("/")
            }}
            className="group text-[13px] leading-none text-grey-100 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
            <FontAwesomeIcon icon={faHome} className="w-4" /> Home
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => {
              router.push("/discover")
            }}
            className="group text-[13px] leading-none text-grey-100 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
            <FontAwesomeIcon icon={faPodcast} className="w-4" /> Nostr Podcasts
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => {
              router.push("/feed")
            }}
            className="group text-[13px] leading-none text-grey-100 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
            <FontAwesomeIcon icon={faGlobe} className="w-4" /> Nostr Feed
          </DropdownMenu.Item>
          {isPlaying && (
            <DropdownMenu.Item
              onClick={() => {
                router.push("/player")
              }}
              className="group text-[13px] leading-none text-grey-100 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
              <FontAwesomeIcon icon={faQuestionCircle} className="w-4" /> Player
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item
            onClick={() => {
              router.push("/support")
            }}
            className="group text-[13px] leading-none text-grey-100 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
            <FontAwesomeIcon icon={faQuestionCircle} className="w-4" /> Support
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-[1px] bg-white m-[5px]" />

          {accountProfile ? (
            <>
              <DropdownMenu.Item
                onClick={() => {
                  router.push(`/p/${accountProfile.pubkey}`)
                }}
                className="group text-[13px] leading-none text-grey-100 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                <Image
                  className="rounded-full"
                  width={16}
                  height={16}
                  src={accountProfile?.picture}
                  alt="FanFares Logo"
                />{" "}
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={logoff}
                className="group text-[13px] leading-none text-grey-100 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                <FontAwesomeIcon icon={faUserSlash} className="w-4" />
                Logout
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-[1px] bg-white m-[5px]" />
            </>
          ) : (
            <>
              {" "}
              <DropdownMenu.Item
                onClick={login}
                className="group text-[13px] leading-none text-grey-100 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                <FontAwesomeIcon icon={faUser} className="w-4" />
                Login
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-[1px] bg-white m-[5px]" />
            </>
          )}
          <DropdownMenu.Item
            onClick={() =>
              router.push(
                "/p/d7d8109ee43657ce6056ada4653006bbb641f31e50e85243681c2724507811ec"
              )
            }
            className="group text-[13px] leading-none text-grey-100 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
            {/* nprofile1qqsd0kqsnmjrv47wvpt2mfr9xqrthdjp7v09p6zjgd5pcfey2puprmqpzamhxue69uhhyetvv9ujuurjd9kkzmpwdejhgtcpy3mhxue69uhhyetvv9uj6an9wf5kv6t9vshxgetnvd5x7mmvd9hxwtn4wvhsz9mhwden5te0dehhxarj9ehx7mmwv4ejucm0d5hsz9mhwden5te0wfjkccte9enxzmnxv9ex2uewd9hsxcz8m0 */}
            <Image
              className=""
              width={16}
              height={16}
              src={Logo}
              alt="FanFares Logo"
            />
            Follow us
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
