import { faHomeAlt, faKey } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import React from "react"
import Image from "next/image"
import Logo from "../assets/logo.svg"
import router from "next/router"
import { FaKey } from "react-icons/fa"

export interface MobileTopNavbarProps {
  isLoggedIn?: boolean
  pubkey?: string
  onClick?: () => void
}

function MobileTopNavbar(props: MobileTopNavbarProps) {
  return (
    <div className="grid-cols-3 grid  items-center justify-between md:hidden py-3 px-4 w-full drop-shadow-md border-b-2 border-buttonAccentHover backdrop-blur-md">
      <Link href="/">
        <FontAwesomeIcon
          icon={faHomeAlt}
          className="text-white w-7 h-7 mr-auto"
        />
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
      {props.isLoggedIn ? (
        <Link className="ml-auto" href={`/p/${props.pubkey}`}>
          <Image
            className=""
            width={40}
            height={40}
            src={Logo}
            alt="FanFares Logo"
          />{" "}
        </Link>
      ) : (
        <button onClick={props.onClick}>
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
