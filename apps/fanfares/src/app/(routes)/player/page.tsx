"use client"
import { AudioPlayer } from "@/app/components/AudioPlayer"
import Button from "@/app/components/Button"
import { MediaThumbnailUploadField } from "@/app/components/MediaThumbnailUploadField"
import {
  faAlignLeft,
  faPlayCircle,
  faSocks,
} from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function PlayerPage() {
  const renderThumbnail = () => {
    // if (editModeOn) {
    return (
      <div className="flex flex-col ">
        <div
          className="relative flex h-[160px] w-[160px] flex-col items-center  rounded-xl bg-skin-fill/80
      text-center">
          <p className="mt-2 text-sm">Upload Cover Image</p>
          <p className="px-1 text-sm font-thin mt-">
            Please <p className=""> drag here or </p>
          </p>
          <label
            className={`btn absolute inset-0 top-1/2 -translate-y-1/2 h-10  z-20 mx-auto w-14   ${
              "fileURL" ? "opacity-80" : ""
            }`}>
            <input type="file" />

            {"fileURL" ? "Change" : "Browse"}
          </label>

          {"fileURL" ? (
            <div className="h-[160px] w-[160px]">
              {" "}
              <img
                src={"fileURL"}
                alt=""
                className="absolute inset-0 z-10 object-cover object-center border-2 aspect-square rounded-xl border-buttonDefault/20"
              />
            </div>
          ) : null}
          <div className="absolute z-20 text-center bottom-1 text-skin-muted right-4">
            <p className="z-50 w-40 text-xs text-center">
              text="JPG / PNG with 1:1 size ratio (min. 528x528 px) and 2 MB max
              file size
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderActionMenu = () => {
    return (
      <div className="flex gap-4">
        <button
          aria-label="Play"
          id={"E2EID.playerPlayButton"}
          onClick={() => {}}>
          <FontAwesomeIcon
            className="text-6xl md:text-5xl "
            icon={faPlayCircle}
          />
        </button>
        <div className="flex flex-row items-center justify-center gap-2 my-auto md:gap-2">
          <div className="flex items-center gap-2">
            <Button
              aria-label="Make a donation"
              id={"E2EID.playerDonateButton"}
              label={"Contribute ⚡️"}
              className="px-2 text-xs md:px-4 md:text-base"
              onClick={() => {}}
            />
            <Button
              aria-label="Share episode on Socials"
              id={"E2EID.playerShareButton"}
              className="px-2 text-xs md:px-4 md:text-base"
              onClick={() => {}}
              label="Share"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="flex w-full flex-col space-y-12">
      <h1 className="font-black text-center text-gray-100 uppercase text-xl/4 md:mt-4 md:text-start md:text-4xl">
        Player Page Title
      </h1>
      <div className="flex items-start w-full max-w-5xl gap-8">
        <div className="w-72 flex flex-col gap-2">
          <img
            src="https://arweave.net/YUi3QnPy72Zbu-k7LLYgMQG_rOxaHseY3O20Ki4Ok_0?w=1920"
            alt=""
            className="rounded-2xl"
          />
          <div className="flex justify-between">
            <p className="text-center">01 Jan, 23</p>
            <p>#0</p>
          </div>
        </div>
        <div className="flex flex-col items-start w-full">
          <div className="flex flex-col w-full mb-4 space-y-4 text-sm text-skin-muted">
            <p className="lg:text-2xl lg:font-bold">Podcast Title</p>
            <p className="lg:text-base lg:font-bold">Podcast Creator</p>

            <div
              className={`w-full max-w-lg items-start rounded-lg bg-skin-fill/80 p-2 space-y-2`}>
              <div className="flex">
                <button
                  aria-label="Expand description"
                  className="mr-2"
                  type="button">
                  <FontAwesomeIcon icon={faAlignLeft} />
                </button>
                <p className="">Description</p>
              </div>
              <p> Episode description box area</p>
              <button
                aria-label="Expand description"
                type="button"
                className={`text-xs font-thin block ml-auto`}>
                {"showMore" ? "Hide..." : "Show more..."}
              </button>
            </div>
          </div>

          {renderActionMenu()}
        </div>
      </div>
      <hr className="w-full mt-4 mb-4 border-buttonDisabled/40 " />
      <AudioPlayer />
      {/* {renderChat()} */}
    </section>
  )
}
