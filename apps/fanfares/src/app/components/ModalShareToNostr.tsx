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
    <div className="w-screen md:w-full md:max-w-2xl px-2 py-1 text-center flex justify-center flex-col">
      <h1 className="font-gloock text-lg mb-4">Share this episode</h1>

      <div className="flex flex-col gap-4">
        <div
          id="shareModal"
          className="bg-transparent text-start border-2 border-buttonAccentHover p-2 rounded-md focus:outline-none transition duration-300 ease-in-out overflow-hidden h-40"
          contentEditable>
          This is a great podcast episode from{" "}
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
       transition duration-300 ease-in-out hover:bg-skin-button-default bg-skin-button-accent"
            id="share"></Button>
          <Button
            onClick={onCancel}
            type="button"
            label="Cancel"
            className="w-full h-10  text-white rounded-md cursor-pointer
      hover:bg-red-700 bg-skin-button-accent transition duration-300 ease-in-out"
            id="share"></Button>
        </div>
      </div>
    </div>
  )
}

export default ModalShareToNostr

//TODOS:
//[x] Link to the podcast
//[] Create the image preview of the episode
//[] #FanFares as T tag
//[] Hex pub to the P tag to reference the creator
//[] default quote "This is a great episode podcast and only cost xyz sats."
