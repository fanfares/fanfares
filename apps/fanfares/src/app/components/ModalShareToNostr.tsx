import Link from "next/link"
import React from "react"
import Button from "./Button"

interface ModalShareToNostrProps {
  setShareModalOn?: (value: boolean) => void
  onCancel?: () => void
  episodeValue?: string
  creator?: string
  creatorProfile?: string
  onShare?: () => void
}

function ModalShareToNostr({
  setShareModalOn,
  onCancel,
  episodeValue,
  creator,
  creatorProfile,
}: ModalShareToNostrProps) {
  return (
    <div className="w-screen md:w-full px-2 py-1 text-center flex justify-center flex-col">
      <h1 className="font-gloock text-lg">Share this episode</h1>
      <div className="flex justify-center items-center ">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
          target="_blank"
          rel="noreferrer"
          className="m-2">
          Facebook
        </a>
      </div>
      <div className="flex flex-col gap-4">
        <div
          id="shareModal"
          className="bg-transparent text-start border-2 border-buttonAccentHover p-2 rounded-md focus:outline-none transition duration-300 ease-in-out overflow-hidden h-40"
          contentEditable>
          This is a great episode podcast from{" "}
          <Link
            className="text-blue-500 cursor-pointer"
            href={`https://fanfares.io/p/${creatorProfile}`}>
            {creator}
          </Link>{" "}
          and only costs{" "}
          <span className="text-yellow-400">{episodeValue} sats </span>
          <Link
            href={window.location.href}
            className="text-blue-500 cursor-pointer">
            {window.location.href}
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            label="Share"
            type="button"
            className="w-full h-10 text-white rounded-md cursor-pointer
      hover:bg-skin-button-accent transition duration-300 ease-in-out"
            id="share"></Button>
          <button
            onClick={onCancel}
            type="button"
            className="w-full h-10 bg-red-500 text-white rounded-md cursor-pointer
      hover:bg-red-700 transition duration-300 ease-in-out"
            id="share">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalShareToNostr

//TODOS:
//[] Link to the podcast
//[] Create the image preview of the episode
//[] #FanFares as T tag
//[] Hex pub to the P tag to reference the creator
//[] default quote "This is a great episode podcast and only cost xyz sats."
