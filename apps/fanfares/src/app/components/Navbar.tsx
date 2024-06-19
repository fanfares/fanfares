"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  IconDefinition,
  faQuestionCircle,
  faGlobe,
  faPodcast,
  faBolt,
} from "@fortawesome/pro-solid-svg-icons"
import Logo from "../assets/logo.svg"

import Image from "next/image"
import Link from "next/link"

import { ProfileBuble } from "./ProfileBubble"

import { ActionButtonsPost } from "./ActionButtonsPost"

export function Navbar() {
  const renderDesktopNavLink = (
    href: string,
    title: string,
    icon: IconDefinition,
    id?: string
  ) => {
    // const isCurrent = isCurrentLink(href)
    const isCurrent = false

    return (
      <Link
        className={`desktop-sidebar-item group mx-auto cursor-pointer rounded-lg p-2 py-3 hover:text-buttonMuted gap-2 group-hover:text-buttonMuted md:mx-auto lg:mx-0 active:scale-95 flex items-center ${
          isCurrent ? "text-buttonAccentHover" : "text-white"
        } `}
        href={href}
        id={id}>
        <FontAwesomeIcon
          icon={icon}
          className={`flex justify-center group-hover:text-buttonMuted w-4 max-w-[16px] ${
            isCurrent ? "text-buttonAccentHover" : "text-white"
          }`}
        />
        <p className="md:hidden lg:block">{title}</p>
      </Link>
    )
  }

  const renderDesktopNavbar = () => {
    return (
      <div
        className={`desktop-sidebar fixed z-40 hidden h-full flex-col px-4 transition-all duration-100 ease-linear md:flex md:mx-auto overflow-y-scroll`}>
        <Link href="/" className="flex flex-col items-center mb-4">
          <Image
            className="mt-4"
            width={96}
            height={96}
            src={Logo}
            alt="FanFares Logo"
          />
          <span className="text-2xl/4 relative font-gloock mt-4">FanFares</span>
          <span className="text-lg relative font-gloock">(Alpha)</span>
          {/* <Image
              // loader={contentfulLoader}
              className="cursor-pointer"
              src={"/assets/excalibur.png"}
              alt=""
              layout="intrinsic"
              width={100}
              height={100}
            /> */}
        </Link>

        <div className="flex flex-col mx-auto mt-5 mb-20 space-y-4 ">
          {renderDesktopNavLink("/discover", "Nostr Podcasts", faPodcast)}
          {renderDesktopNavLink("/feed", "Nostr Universe", faGlobe)}
          {renderDesktopNavLink("/support/", "Support", faQuestionCircle)}
          {renderDesktopNavLink("/feedback/", "Earn Sats", faBolt)}

          {/* {renderDesktopNavLink(
            "/upload",
            "Upload Audio",
            faCloudArrowUp,
            "click-to-upload"
          )} */}
          {/* {renderDesktopNavLink(
            "/test",
            "TEST",
            faCloudArrowUp,
            "click-to-upload"
          )} */}
          {/* {renderDesktopNavLink(
            `/player/${playerMediaKey?.toString() ?? "demo"}`,
            "Player",
            FAProSolid.faPodcast
          )}
          {publicKey !== null
            ? renderDesktopNavLink("/wallet", "Wallet", FAProSolid.faWallet)
            : null}
          {currentCreatorHasUserAccount
            ? renderDesktopNavLink(
                getCreatorPlug(),
                "Creator",
                FAProSolid.faUser
              )
            : null} */}
          {/* {renderDesktopNavLink("/wallet", "Wallet", faWallet)} */}
        </div>
        {/* <LoginLogoutButton /> */}
        <div className="mt-auto left-5">
          {/* <HexagonPFP /> */}
          <p className="flex flex-col mt-2 text-sm font-black">
            {/* <span id={E2EID.navbarBalance}> */}
            {/* <span >
              {balance === null ? "" : balance.toFixed(5)}
            </span>
            <span id="e2e-balance-status" className="font-thin text-skin-muted">
              {balance === null ? "No wallet connected" : "SOL"}
            </span> */}
          </p>
        </div>
        {/* <div className={`static left-5 h-10 ${publicKey ? "mt-3" : ""}`}> */}
        <ActionButtonsPost />

        <ProfileBuble />
        <div className={`mx-auto left-5 h-10 mb-8`}>
          <a
            id="e2e-balance-status"
            className="font-thin underline cursor-pointer text-skin-muted flex flex-col text-sm"
            href="mailto:support@fanfares.io">
            Need help?
          </a>
        </div>
      </div>
    )
  }

  return <>{renderDesktopNavbar()}</>
}
