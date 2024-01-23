import Image from "next/image"
import Link from "next/link"
import { Event as NostrEvent } from "nostr-tools"
import Button from "./Button"
import { useState } from "react"
import { Modal } from "./Modal"

interface FeedPostProps {
  note: NostrEvent<1>
  user?: string
  userPfp?: string
  content?: string
  userProfile?: string
}

export function FeedPost(props: FeedPostProps) {
  const { user, userPfp, content, userProfile } = props
  const [fanfaresButtonMessage, setFanfaresButtonMessage] = useState(false)
  const [zapButtonMessage, setZapButtonMessage] = useState(false)

  return (
    <div
      id="e2e-feed-post-container"
      className="border-buttonAccent w-full rounded-md flex relative border pl-16 pr-4 py-3 flex-col">
      <div className="w-12 h-12 absolute left-2 top-2 group">
        <img
          src={userPfp ?? "http://placebeard.it/640/480.jpg"}
          className="w-full h-full border-2 border-buttonAccent object-cover rounded-full group-hover:border-buttonAccentHover"
          alt="Profile Image"
        />
      </div>
      <div className="flex-grow overflow-hidden space-y-1">
        <p className="text-sm font-bold">
          {user}{" "}
          <Link
            href="#"
            className="text-white/50 font-medium hover:text-buttonAccentHover">
            {userProfile ? userProfile : null}
          </Link>
        </p>
        <h3 className="break-words text-sm font-normal">{content}</h3>
        {/* <h3 className="break-words text-sm font-normal">{JSON.stringify(note)}</h3> */}
      </div>
      <Modal isOpen={fanfaresButtonMessage}>
        <div className="w-80 flex flex-col gap-4 p-2 ">
          <div className="w-full flex justify-between items-center">
            <p>Coming Soon</p>
            <button
              onClick={() => setFanfaresButtonMessage(!fanfaresButtonMessage)}>
              X
            </button>
          </div>
          <p className="text-sm text-center">
            Thanks for showing interest in our platform, this feature is not
            working yet, but it's coming soon!
          </p>
        </div>
      </Modal>
      <Modal isOpen={zapButtonMessage}>
        <div className="flex flex-col px-2 py-1 w-96 gap-y-5">
          <p className="font-bold text-lg"> Select Sats</p>
          <div className="flex w-full">
            <p>
              Zap{" "}
              <span className="font-thin text-buttonMuted text-sm">
                %UserNamePlaceholder%
              </span>
            </p>
            <button
              onClick={() => {
                setZapButtonMessage(!zapButtonMessage)
              }}
              className="ml-auto">
              Ⅹ
            </button>
          </div>{" "}
          <div className="flex-wrap justify-between flex gap-4">
            <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
              <p className="font-bold">10</p>
              <span className="text-xs font-thin">sats</span>
            </button>
            <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
              {" "}
              <p className="font-bold">100</p>
              <span className="text-xs font-thin">sats</span>
            </button>
            <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
              {" "}
              <p className="font-bold">1000</p>
              <span className="text-xs font-thin">sats</span>
            </button>
            <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
              {" "}
              <p className="font-bold">10K</p>
              <span className="text-xs font-thin">sats</span>
            </button>
            <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
              {" "}
              <p className="font-bold">100K</p>
              <span className="text-xs font-thin">sats</span>
            </button>
            <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
              {" "}
              <p className="font-bold">1M</p>
              <span className="text-xs font-thin">sats</span>
            </button>
          </div>
          <div className="w-full border-b-2 border-buttonAccent" />
          <Button label="Confirm" className="mb-4" />
        </div>
      </Modal>

      <div className="mt-5 mx-auto flex gap-4">
        <Button
          className="px-2 w-28"
          id="e2e-feed-post-fanfare-button"
          label={"Fanfare 🎪"}
          onClick={() => setFanfaresButtonMessage(!fanfaresButtonMessage)}
        />
        <Button
          className="px-2 w-28"
          id="e2e-feed-post-zap-button"
          label={"Zap ⚡️"}
          onClick={() => setFanfaresButtonMessage(!fanfaresButtonMessage)}

          // onClick={() => setZapModalOn(!zapModalOn)}
        />
      </div>
    </div>
  )
}
