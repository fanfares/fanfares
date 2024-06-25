import Image from "next/image"
import { FaRegComment, FaRegHeart, FaRetweet } from "react-icons/fa"
import { BsLightningCharge } from "react-icons/bs"
import Link from "next/link"
import { EventTemplate, Event as NostrEvent, nip57 } from "nostr-tools"
import Button from "./Button"
import { useState } from "react"
import { Modal } from "./Modal"
import { RenderContent } from "./RenderContent"
import ModalZap from "./ModalZap"
import ModalFutureFeature from "./ModalFutureFeature"
import { useRouter } from "next/navigation"
import { NIP07, NostrProfile, getInvoice, getLud16Url } from "utils"
import { NostrPostStats } from "../controllers/primal/primalHelpers"
import { bech32 } from "bech32"
import {
  useAccountNostr,
  useAccountWebln,
} from "../controllers/state/account-slice"

// This declaration allows us to access window.nostr without TS errors.
// https://stackoverflow.com/a/47130953
declare global {
  interface Window {
    nostr: NIP07
  }
}

interface FeedPostProps {
  note: NostrEvent<1>
  profile: NostrProfile
  stats?: NostrPostStats
}

export function FeedPost(props: FeedPostProps) {
  const { note, profile, stats } = props
  const router = useRouter()
  const nostrAccount = useAccountNostr()
  const webln = useAccountWebln()

  const goToProfilePage = () => {
    router.push(`/p/${note.pubkey}`)
  }

  const goToNotePage = () => {
    router.push(`/e/${note.id}`)
  }

  const zap = async () => {
    // examining note's props/tags
    console.log("zap: note", note)
    // HOW TO ZAP
    // check for our account
    if (!nostrAccount) {
      console.warn("nostr account not loaded")
      return // no account loaded
    }
    // check for zap tag
    // if no zap tag, use lud16
    if (!profile.lud16) {
      console.warn("zap target has no lud16")
      return
    }

    if (!webln) {
      console.warn("webln not loaded")
      return
    }

    const zapTag = note.tags.find(tag => tag[0] === "zap")
    const lud16 =
      zapTag && typeof zapTag === "object" && zapTag.length >= 2
        ? zapTag[1]
        : profile.lud16
    let lud16Url = null

    try {
      lud16Url = getLud16Url(lud16)
    } catch (e) {
      console.warn(e)
    }

    if (!lud16Url) {
      return
    }

    // send GET to lud16Url
    const response = await fetch(lud16Url, {
      method: "GET",
    })

    if (!response.ok) {
      console.error("zap: error", await response.json())
      return
    }

    const sendDetails = await response.json()
    console.log("zap: response", sendDetails)

    // check allowsNostr key for true
    if (!sendDetails.allowsNostr) {
      console.log("nostr not allowed", sendDetails.allowsNostr, response)
      return
    }
    // check that nostrPubkey exists and is a valid BIP 340 pubkey in hex
    if (
      !sendDetails.nostrPubkey ||
      !/^[0-9a-fA-F]{64}$/.test(sendDetails.nostrPubkey)
    ) {
      console.log("response pubkey invalid")
      return
    }

    // create 9734 zap requset event (step 3 https://github.com/nostr-protocol/nips/blob/master/57.md#protocol-flow)
    const data = lud16
    const buffer = Buffer.from(data, "utf8")
    const words = bech32.toWords(buffer)
    console.log("words", data, words, words.length)
    const encoded = bech32.encode("lnurl", words)

    const zapRequest = {
      kind: 9734,
      content: "",
      pubkey: nostrAccount.accountPublicKey,
      created_at: Math.floor(+new Date() / 1000),
      tags: [
        [
          "relays",
          /* TODO grab relays from zustand */ "wss://relay.primal.net",
        ],
        ["amount", /* TODO create user-controlled amount */ "55000"],
        ["lnurl", encoded],
        ["p", sendDetails.nostrPubkey],
        ["e", note.id],
      ],
    } as EventTemplate<9734>

    // sign event
    const signed = await window.nostr.signEvent(zapRequest)
    const encodedEvent = encodeURIComponent(JSON.stringify(signed))

    // send signed event via GET to callback URL
    const { pr: invoice } = await (
      await fetch(
        `${
          sendDetails.callback
        }?amount=${55000}&nostr=${encodedEvent}&lnurl=${encoded}`
      )
    ).json()

    console.log("zap: invoice", invoice)

    webln.sendPayment(invoice)
  }

  return (
    <div
      id="e2e-feed-post-container"
      className="border-buttonAccent mb-4 w-full rounded-md flex relative border pl-4 pr-4 py-3 flex-col mx-auto md:mx-0 mr-4">
      <div className="flex w-full h-12 left-2 top-2 group  gap-x-2">
        <img
          onClick={goToProfilePage}
          src={profile?.picture ?? "http://placebeard.it/640/480.jpg"}
          className="border-2 border-buttonAccent object-cover rounded-full group-hover:border-buttonAccentHover cursor-pointer mr-2 w-10 h-10"
          alt="Profile Image"
        />
        <div className="flex flex-col">
          <p onClick={goToProfilePage} className="text-sm font-bold">
            {profile?.display_name}
          </p>
          <Link
            href="#"
            className="text-white/50 text-sm font-thin hover:text-buttonAccentHover">
            {" " + profile.nip05}
          </Link>
        </div>
      </div>
      <div className="flex-grow overflow-hidden space-y-1 mt-2">
        <div className="cursor-pointer" onClick={goToNotePage}>
          <RenderContent rawContent={note.content ?? ""} />
        </div>
      </div>

      {stats ? (
        <div className="mt-5 flex gap-4 justify-evenly">
          <span
            onClick={zap}
            className="text-sm rounded-full px-4 py-2 cursor-pointer transition-all duration-300 hover:bg-skin-fill flex items-center">
            <BsLightningCharge className="font-bold inline zap-color" />
            &nbsp;
            {stats.satszapped}
          </span>
          <span className="text-sm rounded-full px-4 py-2 cursor-pointer transition-all duration-300 hover:bg-skin-fill flex items-center">
            <FaRetweet className="font-bold inline retweet-color" />
            &nbsp;
            {stats.reposts}
          </span>
          <span className="text-sm rounded-full px-4 py-2 cursor-pointer transition-all duration-300 hover:bg-skin-fill flex items-center">
            <FaRegComment className="font-bold inline comment-color" />
            &nbsp;
            {stats.replies}
          </span>
          <span className="text-sm rounded-full px-4 py-2 cursor-pointer transition-all duration-300 hover:bg-skin-fill flex items-center">
            <FaRegHeart className="font-bold inline like-color" />
            &nbsp;
            {stats.likes}
          </span>
        </div>
      ) : null}
    </div>
  )
}
