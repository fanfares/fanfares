"use client"
import { faHomeAlt, faKey } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import React, { useState } from "react"
import Image from "next/image"
import Logo from "../assets/logo.svg"

import { useAccountProfile } from "../controllers/state/account-slice"

export interface MobileTopNavbarProps {
  isLoggedIn?: boolean
  pubkey?: string
  onClick?: () => void
}

function MobileTopNavbar(props: MobileTopNavbarProps) {
  const accountProfile = useAccountProfile()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    document.dispatchEvent(new CustomEvent("nlLaunch", { detail: "welcome" }))
  }

  if (typeof window !== "undefined") {
    document.addEventListener("nlAuth", (e: any) => {
      if (e.detail.type === "logout") {
        setIsLoggedIn(false)
      }
      if (e.detail.type === "login") {
        setIsLoggedIn(true)
      }
    })
  }
  return (
    <div className="grid-cols-3 grid  items-center justify-between md:hidden py-3 px-4 w-full drop-shadow-md border-b-2 border-buttonAccentHover backdrop-blur-md">
      <Link href="/" className="w-7">
        <FontAwesomeIcon icon={faHomeAlt} className="text-white" />
      </Link>
      <div className="mx-auto flex gap-2 items-center">
        <Image
          className=""
          width={40}
          height={40}
          src={Logo}
          alt="FanFares Logo"
        />
        <p className="text-3xl font-gloock ">FanFares</p>
      </div>
      {accountProfile && isLoggedIn ? (
        <Link className="ml-auto" href={`/p/${accountProfile.pubkey}`}>
          <Image
            className="rounded-full"
            width={40}
            height={40}
            src={accountProfile?.picture}
            alt="FanFares Logo"
          />{" "}
        </Link>
      ) : (
        <button onClick={handleLogin}>
          <FontAwesomeIcon
            icon={faKey}
            className="text-white w-6 h-6 ml-auto"
          />
        </button>
      )}
    </div>
  )
}

export default MobileTopNavbar
