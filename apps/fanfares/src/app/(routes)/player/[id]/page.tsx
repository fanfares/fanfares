"use client"

import Button from "@/app/components/Button"
import {
  faAlignLeft,
  faPauseCircle,
  faPlayCircle,
} from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { config } from "@fortawesome/fontawesome-svg-core"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  usePlayerPageActions,
  usePlayerPageError,
  usePlayerPageGateId,
  usePlayerPageIsLoading,
  usePlayerPageIsPlaying,
  usePlayerPagePodcast,
  usePlayerPagePodcastCreator,
} from "@/app/controllers/state/player-page-slice"
import { useNostr } from "@/app/controllers/state/nostr-slice"
import {
  useAccountNostr,
  useAccountWebln,
} from "@/app/controllers/state/account-slice"
import Image from "next/image"
import { formatDate, getIdFromUrl } from "@/app/controllers/utils/formatting"
import { toast } from "react-toastify"
import { launchPaymentModal } from "@getalby/bitcoin-connect"

config.autoAddCss = false /* eslint-disable import/first */

export default function PlayerPage() {
  const creator = usePlayerPagePodcastCreator()
  const gateId = usePlayerPageGateId()
  const accountNostr = useAccountNostr()
  const webln = useAccountWebln()
  const { nostrPool, nostrRelays } = useNostr()
  const {
    playerPageSetGateId,
    playerPageBuyPodcast,
    playerPageUnlockPodcast,
    playerPageSetPlaying,
  } = usePlayerPageActions()
  const playerPageIsLoading = usePlayerPageIsLoading()
  const podcast = usePlayerPagePodcast()
  const playerPageError = usePlayerPageError()
  const playerPageIsPlaying = usePlayerPageIsPlaying()

  // ------------ USE STATE ------------

  const [copied, setCopied] = useState(false)

  // ------------ CONSTS ------------

  const pathname = getIdFromUrl(usePathname())

  // ------------ USE EFFECTS ------------

  useEffect(() => {
    if (gateId !== pathname)
      playerPageSetGateId(nostrRelays, nostrPool, pathname)
  }, [pathname, gateId, nostrRelays, nostrPool])

  useEffect(() => {
    if (
      accountNostr &&
      podcast &&
      !podcast.audioFilepath &&
      accountNostr.accountNIP04 &&
      accountNostr.accountPublicKey
    ) {
      playerPageUnlockPodcast(
        nostrRelays,
        nostrPool,
        podcast,
        accountNostr.accountNIP04,
        accountNostr.accountPublicKey
      )
    }
  }, [nostrRelays, nostrPool, accountNostr, podcast])

  // ------------ FUNCTIONS ------------

  const buyPodcast = () => {
    if (!podcast) {
      toast.error("Podcast not found")
      return
    }

    if (
      !accountNostr ||
      !accountNostr.accountNIP04 ||
      !accountNostr.accountNIP07 ||
      !accountNostr.accountPublicKey
    ) {
      toast.error("You need to login first")
      return
    }

    playerPageBuyPodcast(
      nostrRelays,
      nostrPool,
      podcast,
      accountNostr.accountNIP04,
      accountNostr.accountNIP07,
      accountNostr.accountPublicKey,
      (finishPaymentAttempt: () => Promise<void>, invoice: string) =>
        launchPaymentModal({
          invoice,
          onPaid: response => {
            console.log("Received payment! " + response.preimage)
            finishPaymentAttempt()
          },
          onCancelled: () => {
            console.log("Payment cancelled")
            finishPaymentAttempt()
          },
        })
    )
  }

  const copyToClipboard = async (text: string) => {
    setCopied(true)

    setTimeout(() => setCopied(false), 1000)

    navigator.clipboard.writeText(text)
  }

  // ------------ RENDERERS ------------

  const renderBuy = () => {
    if (!podcast) return null

    return (
      <div className="flex flex-col items-center justify-center  h-full">
        <Button
          aria-label="Buy"
          id={"E2EID.playerBuyButton"}
          label={
            <div className="flex flex-col">
              <p className="relative">Buy this Episode</p>
              <span className="text-xs font-thin text-center text-white absolute -bottom-5 inset-x-0">
                {" "}
                It costs {Math.round(
                  podcast.gate.cost / 1000
                ).toLocaleString()}{" "}
                sats
              </span>
            </div>
          }
          className="px-2 text-xs md:px-4 md:text-base relative"
          onClick={buyPodcast}
        />
        <p className=" "></p>
      </div>
    )
  }

  const renderActionMenu = () => {
    if (!podcast) return null

    return (
      <div className="flex gap-4 items-center h-20 mx-auto md:mx-0 w-full justify-evenly md:justify-normal">
        {podcast.audioFilepath ? (
          <>
            <button
              aria-label="Play"
              id={"E2EID.playerPlayButton"}
              onClick={() => {
                if (playerPageIsPlaying) {
                  playerPageSetPlaying(false)
                } else {
                  playerPageSetPlaying(true)
                }
              }}>
              <FontAwesomeIcon
                className="w-10 md:w-14"
                icon={playerPageIsPlaying ? faPauseCircle : faPlayCircle}
              />
            </button>
          </>
        ) : (
          renderBuy()
        )}
        <Button
          aria-label="Share episode on Socials"
          id={"E2EID.playerShareButton"}
          className="px-2 text-xs md:px-4 md:text-base"
          onClick={() => copyToClipboard(window.location.href)}
          label={copied ? "Copied" : "Copy Link"}
        />
      </div>
    )
  }

  const renderError = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-3xl font-bold text-center text-white">
          Error loading podcast...
        </p>
        <p className="text-3xl font-bold text-center text-white">
          {playerPageError}
        </p>
      </div>
    )
  }

  const renderLoading = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-3xl font-bold text-center text-white">
          Loading podcast...
        </p>
      </div>
    )
  }

  const renderPodcastNotFound = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-3xl font-bold text-center text-white">
          Podcast not found...
        </p>
      </div>
    )
  }

  const renderContent = () => {
    if (playerPageError) return renderError()
    if (playerPageIsLoading) return renderLoading()
    if (!podcast) return renderPodcastNotFound()

    return (
      <>
        <div className="flex md:flex-row flex-col md:items-start md:w-full md:max-w-5xl md:gap-8">
          <div className="flex flex-col gap-2 mx-auto">
            <div className="relative w-full h-full mx-auto md:mx-0">
              <Image
                alt="episode thumbnail"
                src={podcast.imageFilepath}
                width={200}
                height={200}
                className="rounded border border-buttonDisabled "
                priority
                layout="cover"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <div className="flex justify-between ">
              <p className="text-center ml-auto text-xs md:text-sm">
                {formatDate(
                  new Date(podcast.announcement.note.created_at * 1000)
                )}
              </p>
            </div>
            {/* <img
              src={podcast.imageFilepath}
              alt=""
              className="rounded-2xl object-cover border"
            /> */}
          </div>
          <div className="flex flex-col items-start w-full">
            <div className="flex flex-col w-full mb-4 space-y-4 text-sm text-skin-muted">
              <p className="lg:text-2xl lg:font-bold text-base font-semibold">
                {podcast.title}
              </p>
              <p className="lg:text-base lg:font-bold truncate w-80">
                {creator ? creator.name : podcast.announcement.note.pubkey}
              </p>

              <div
                className={`w-full max-w-lg items-start rounded-lg bg-skin-fill/80 p-2 space-y-2`}>
                <div className="flex">
                  <button
                    aria-label="Expand description"
                    className="mr-2"
                    type="button">
                    <FontAwesomeIcon icon={faAlignLeft} className="w-4" />
                  </button>
                  <p className="">Description</p>
                </div>
                <p>{podcast.description}</p>
                {/* <button
                  aria-label="Expand description"
                  type="button"
                  className={`text-xs font-thin block ml-auto`}>
                  {"showMore" ? "Hide..." : "Show more..."}
                </button> */}
              </div>
            </div>
            {renderActionMenu()}
          </div>
        </div>
        <hr className="w-full mt-4 mb-4 border-buttonDisabled/40 " />
      </>
    )
  }

  return (
    <section className="flex w-full flex-col space-y-12">
      {renderContent()}
    </section>
  )
}
