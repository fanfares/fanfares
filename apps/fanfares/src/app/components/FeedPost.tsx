import Image from "next/image"
import Link from "next/link"
import { Event as NostrEvent } from "nostr-tools"
import Button from "./Button"
import { useState } from "react"
import { Modal } from "./Modal"
import { RenderContent } from "./RenderContent"
import ModalZap from "./ModalZap"
import ModalFutureFeature from "./ModalFutureFeature"

interface FeedPostProps {
  note: NostrEvent<1>
  user?: string
  userPfp?: string
  content?: string
  userProfile?: string
}

export function FeedPost(props: FeedPostProps) {
  const { user, userPfp, content, userProfile } = props
  // const [fanfaresButtonMessage, setFanfaresButtonMessage] = useState(false)
  // const [zapButtonMessage, setZapButtonMessage] = useState(false)
  const [futureFeatureModalOn, setFutureFeatureModalOn] = useState(false)

  return (
    <div
      id="e2e-feed-post-container"
      className="border-buttonAccent w-full max-w-lg lg:max-w-2xl rounded-md flex relative border pl-16 pr-4 py-3 flex-col mx-auto md:mx-0">
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
        <RenderContent rawContent={content ?? ""} />
        {/* <h3 className="break-words text-sm font-normal">{parseContent(content ?? '')}</h3> */}
        {/* <h3 className="break-words text-sm font-normal">{JSON.stringify(note)}</h3> */}
      </div>
      <ModalFutureFeature
        isOpen={futureFeatureModalOn}
        onClick={() => setFutureFeatureModalOn(!futureFeatureModalOn)}
      />
      {/* <ModalFanfare
        isOpen={fanfaresButtonMessage}
        onClick={() => setFanfaresButtonMessage(!fanfaresButtonMessage)}
      />

      <ModalZap
        isOpen={zapButtonMessage}
        onClick={() => setZapButtonMessage(false)}
      /> */}

      <div className="mt-5 mx-auto flex gap-4">
        <Button
          className="px-2 w-28"
          id="e2e-feed-post-fanfare-button"
          label={"Fanfare 🎪"}
          onClick={() => setFutureFeatureModalOn(!futureFeatureModalOn)}
        />
        <Button
          className="px-2 w-28"
          id="e2e-feed-post-zap-button"
          label={"Zap ⚡️"}
          onClick={() => setFutureFeatureModalOn(!futureFeatureModalOn)}

          // onClick={() => setZapModalOn(!zapModalOn)}
        />
      </div>
    </div>
  )
}
