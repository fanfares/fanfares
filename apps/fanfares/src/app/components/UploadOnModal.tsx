"use client"
import Button from "@/app/components/Button"
import { MediaAudioUploadField } from "@/app/components/MediaAudioUploadField"
import { MediaCreatorForm } from "@/app/components/MediaCreatorForm"
import { MediaThumbnailUploadField } from "@/app/components/MediaThumbnailUploadField"
import { FormLabelCreators } from "@/app/components/LabelForm"
import { Modal } from "@/app/components/Modal"
import { usePostPodcast } from "@/app/controllers/state/post-podcast-slice"
import { useAppState } from "@/app/controllers/state/old/use-app-state"
import Link from "next/link"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import {
  useAccountNostr,
  useAccountProfile,
} from "../controllers/state/account-slice"
import { useNostr } from "../controllers/state/nostr-slice"
import { Popover } from "./Popover"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

interface UploadOnModalProps {
  onCancel?: () => void
}

export default function UploadOnModal(props: UploadOnModalProps) {
  const { onCancel } = props
  const [publishModal, setPublishModal] = useState<boolean>(false)
  const [isCheckedAudio, setIsCheckedAudio] = useState<boolean>(true)
  const { nostrPool, nostrRelays } = useNostr()
  const accountProfile = useAccountProfile()
  const accountNostr = useAccountNostr()

  const router = useRouter()

  const handleCheckboxChangeAudio = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setIsCheckedAudio(checked)
  }

  const formRef = useRef<HTMLFormElement>(null)
  const {
    postPodcastCheckMeta,
    postPodcastCheckTC,
    postPodcastClear,
    postPodcastState,
    postPodcastSubmit,
    postPodcastHandleSeriesTitleChange,
    postPodcastHandleSeriesImageChange,
    postPodcastHandleSeriesDescriptionChange,
    postPodcastSeriesTitle,
    postPodcastSeriesDescription,
    postPodcastSeriesImageFile,
    postPodcastHandleTitleChange,
    postPodcastTitle,
    postPodcastDescription,
    postPodcastLud16,
    postPodcastUnlockCost,
    postPodcastHandleCheckMetaChange,
    postPodcastHandleCheckTCChange,
    postPodcastHandleUnlockCostChange,
    postPodcastHandleAudioChange,
    postPodcastHandleImageChange,
    postPodcastImageFile,
    postPodcastAudioFile,
    postPodcastHandleLud16Change,
    postPodcastHandleDescriptionChange,
    postPodcastSetLud16,
  } = usePostPodcast()

  useEffect(() => {
    if (accountProfile && accountProfile.lud16) {
      if (accountProfile.lud16.includes("getalby.com")) {
        postPodcastSetLud16(accountProfile.lud16)
      }
    }
  }, [accountProfile])

  useEffect(() => {
    postPodcastClear()
  }, [postPodcastClear])

  const handlePostSubmit = (event: any) => {
    if (!accountNostr?.accountNIP07) {
      toast.warn("Please connect your Nostr account")
      return
    }

    // event.preventDefault();
    setPublishModal(true)
    postPodcastSubmit(nostrPool, nostrRelays, accountNostr?.accountNIP07, {
      onSuccess(ids) {
        const id = ids.ids.gateNote
        toast.success(`Note posted with id ${id}`)
        router.push(`${window.location.origin}/player/${id}`)
        setPublishModal(false)
        if (onCancel) onCancel()
      },
      onError(error) {
        toast.error(`Error posting note: ${error}`)
        setPublishModal(false)
      },
      onClear() {
        formRef.current?.reset()
        setPublishModal(false)
      },
    })
  }

  const charsLeft = (text: string) => {
    return text.length
  }

  return (
    <section className="relative w-full">
      {publishModal && (
        <div className="absolute flex flex-col w-full h-full items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="inline-block h-12 w-12 relative animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          />
          <p className="mt-2">Your podcast is being uploaded...</p>
          <p className="mt-2 font-thin text-sm">Status: {postPodcastState}</p>
        </div>
      )}
      <form className="w-full" onSubmit={handlePostSubmit} ref={formRef}>

      <div className="flex flex-row gap-2 mb-2 w-full">
        {postPodcastCheckMeta && (
        <div className="relative flex flex-col w-full px-2 py-1">

          <div className="w-full mx-auto space-y-4 pt-2">
            {/* <MediaSeriesNameField maxLength={MAX_TITLE_LENGTH} /> */}
            <div className="relative">
              <label>
                <input
                  id={"E2EID.podcastSeriesTitleInput"}
                  autoComplete="false"
                  placeholder="Podcast Title"
                  className="w-full border-b-2 border-buttonAccent bg-transparent outline-none font-thin text-sm placeholder:text-lg placeholder:font-thin placeholder:text-skin-muted"
                  // requiredMessage="Please enter the Podcast name"
                  maxLength={20}
                  name="name"
                  onChange={postPodcastHandleSeriesTitleChange}
                  value={postPodcastSeriesTitle}
                />
                <p
                  className={`absolute right-0 top-8 text-xs ${
                    20 - charsLeft(postPodcastSeriesTitle) < 8
                      ? "text-red-500"
                      : "text-skin-inverted"
                  }`}>
                  {" "}
                  {20 - charsLeft(postPodcastSeriesTitle)}
                </p>
              </label>
            </div>

            {/* <MediaSeriesDescriptionField maxLength={MAX_DESCRIPTION_LENGTH} /> */}
            <div className="relative">
              <textarea
                id={"E2EID.uploadSeriesDescriptionInput"}
                placeholder="Description"
                className="w-full h-32 min-h-[40px] max-h-[200px] bg-transparent border-b-2 outline-none resize-none notes active border-buttonAccent placeholder:text-lg placeholder:font-thin placeholder:text-skin-muted overflow-y-auto text-sm"
                maxLength={1000}
                name="seriesDescription"
                onChange={postPodcastHandleSeriesDescriptionChange}
                value={postPodcastSeriesDescription}
              />
              <p
                className={`absolute -bottom-4 right-0 text-xs ${
                  1000 - charsLeft(postPodcastSeriesDescription) < 8
                    ? "text-red-500"
                    : "text-skin-inverted"
                }`}>
                {1000 - charsLeft(postPodcastSeriesDescription)}
              </p>
            </div>

            <div className="flex mx-auto">
              <div className="flex flex-col border border-buttonAccent px-2 py-1 rounded items-center justify-around w-48 h-48 space-y-4 relative">
                {postPodcastSeriesImageFile ? (
                  <img
                    className="absolute object-cover object-center w-full h-full rounded"
                    src={URL.createObjectURL(postPodcastSeriesImageFile)}></img>
                ) : null}
                <p className="mt-2">Podcast Cover</p>
                <label
                  htmlFor="seriesThumbnailUpload"
                  className={`mx-auto bg-buttonDefault hover:bg-buttonAccentHover px-3 py-1 rounded-full text-sm cursor-pointer ${
                    postPodcastSeriesImageFile ? "opacity-80" : ""
                  }`}>
                  <input
                    className="hidden"
                    type="file"
                    id="seriesThumbnailUpload"
                    accept="image/*"
                    aria-label="Thumbnail Upload"
                    onChange={postPodcastHandleSeriesImageChange}
                  />
                  {postPodcastSeriesImageFile ? "Change" : "Browse"}
                </label>

                <div className="text-center">
                  {/* MAKE THIS AS TOOLTIP */}
                  <div className=" w-40 text-xs text-center  text-skin-muted">
                    JPG / PNG with 1:1 size ratio (min. 528x528 px) and 2 MB max
                    file size
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
        )}

        <div className="relative flex flex-col w-full px-2 py-1">
          <div className="flex flex-row gap-2 mb-2 w-full">
            <label htmlFor="showMeta">
              <input
                required
                id={"showMeta"}
                className="mr-2"
                type="checkbox"
                checked={postPodcastCheckMeta}
                onChange={postPodcastHandleCheckMetaChange}
              />
              Podcast:
            </label>

            <select
              className="flex-grow bg-transparent"
              onChange={() => {}}
              defaultValue={"new"}
            >
              <option style={{ backgroundColor: '#494B5D' }} value="new">New Podcast</option>
              <option style={{ backgroundColor: '#494B5D' }} value="1">My Existing Podcast #1</option>
              <option style={{ backgroundColor: '#494B5D' }} value="2">My Existing Podcast #2</option>
              {/* {props.categories.map((category,key) => 
                <Application key={key} item={category} />
              )} */}
            </select>

          </div>
          <div className="upperSectionForm flex flex-col w-full gap-4 md:flex-row">
            <div className="flex mx-auto">
              <div className="flex flex-col border border-buttonAccent px-2 py-1 rounded items-center justify-around w-48 h-48 space-y-4 relative">
                {postPodcastImageFile ? (
                  <img
                    className="absolute object-cover object-center w-full h-full rounded"
                    src={URL.createObjectURL(postPodcastImageFile)}></img>
                ) : null}
                <p className="mt-2">Episode Cover</p>
                <label
                  htmlFor="thumbnailUpload"
                  className={`mx-auto bg-buttonDefault hover:bg-buttonAccentHover px-3 py-1 rounded-full text-sm cursor-pointer ${
                    postPodcastImageFile ? "opacity-80" : ""
                  }`}>
                  <input
                    className="hidden"
                    type="file"
                    id="thumbnailUpload"
                    accept="image/*"
                    aria-label="Thumbnail Upload"
                    onChange={postPodcastHandleImageChange}
                  />
                  {postPodcastImageFile ? "Change" : "Browse"}
                </label>

                <div className="text-center">
                  {/* MAKE THIS AS TOOLTIP */}
                  <div className=" w-40 text-xs text-center  text-skin-muted">
                    JPG / PNG with 1:1 size ratio (min. 528x528 px) and 2 MB max
                    file size
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mx-auto space-y-4 pt-2">
              {/* <MediaNameField maxLength={MAX_TITLE_LENGTH} /> */}
              <div className="relative">
                <label>
                  <input
                    id={"E2EID.uploadTitleInput"}
                    autoComplete="false"
                    placeholder="Episode Title"
                    className="w-full border-b-2 border-buttonAccent bg-transparent outline-none font-thin text-sm placeholder:text-lg placeholder:font-thin placeholder:text-skin-muted"
                    // requiredMessage="Please enter the Episode name"
                    maxLength={20}
                    name="name"
                    onChange={postPodcastHandleTitleChange}
                    value={postPodcastTitle}
                  />
                  <p
                    className={`absolute right-0 top-8 text-xs ${
                      20 - charsLeft(postPodcastTitle) < 8
                        ? "text-red-500"
                        : "text-skin-inverted"
                    }`}>
                    {" "}
                    {20 - charsLeft(postPodcastTitle)}
                  </p>
                </label>
              </div>

              {/* <MediaDescriptionField maxLength={MAX_DESCRIPTION_LENGTH} /> */}
              <div className="relative">
                <textarea
                  id={"E2EID.uploadDescriptionInput"}
                  placeholder="Description"
                  className="w-full h-32 min-h-[40px] max-h-[200px] bg-transparent border-b-2 outline-none resize-none notes active border-buttonAccent placeholder:text-lg placeholder:font-thin placeholder:text-skin-muted overflow-y-auto text-sm"
                  maxLength={1000}
                  name="description"
                  onChange={postPodcastHandleDescriptionChange}
                  value={postPodcastDescription}
                />
                <p
                  className={`absolute -bottom-4 right-0 text-xs ${
                    1000 - charsLeft(postPodcastDescription) < 8
                      ? "text-red-500"
                      : "text-skin-inverted"
                  }`}>
                  {1000 - charsLeft(postPodcastDescription)}
                </p>
              </div>
            </div>
          </div>
          <div
            id={"E2EID.uploadAudioInput"}
            className="relative grid grid-cols-3 items-center w-full mt-8 border border-buttonAccent px-2 py-3 rounded justify-between">
            <p className="w-36 truncate">
              {postPodcastAudioFile
                ? postPodcastAudioFile.name
                : "Upload Audio File"}
            </p>
            <label
              htmlFor="audioUpload"
              className="mx-auto py-1 rounded-full cursor-pointer px-3 bg-buttonDefault hover:bg-buttonAccentHover text-sm">
              <input
                type="file"
                id="audioUpload"
                className="hidden"
                accept="audio/mp3, audio/mp4, .m4a , audio/aac"
                onChange={postPodcastHandleAudioChange}
              />
              {postPodcastAudioFile ? "Change" : "Browse"}
            </label>
            <p className="text-xs w-24 ml-auto  text-skin-muted">
              Formats allowed: AAC / M4A / MP3
            </p>
          </div>
          {isCheckedAudio ? (
            <>
              {" "}
              <div className="flex-col w-full ">
                {/* <MediaParameterForm /> */}
                <div className="relative flex flex-col w-full mt-4">
                  <div className="flex justify-between w-full">
                    <p className="text-2xl">Parameters</p>
                    <button
                      disabled={false}
                      id={"E2EID.uploadCreatorAddButton"}
                      type="button"
                      className="hidden items-center md:px-4 mt-auto text-xs bg-buttonDefault rounded-md px-2 py-1"
                      onClick={() => {}}>
                      Add Creator
                    </button>
                  </div>
                  <div className="w-full">
                    {" "}
                    <div
                      key={"field.id"}
                      className="flex flex-col w-full md:gap-4 md:flex-row md:items-center md:justify-center mt-4 space-y-4 md:space-y-0">
                      <FormLabelCreators>
                        {" "}
                        <p className="flex gap-1">
                          Alby Address
                          <Popover
                            content={
                              <div className="text-xs font-thin text-center">
                                <p>
                                  Currently we only work with{" "}
                                  <span
                                    className="text-blue-500 hover:underline cursor-pointer"
                                    onClick={() => {
                                      window.open("https://getalby.com/")
                                    }}>
                                    @getalby.com
                                  </span>{" "}
                                  addresses
                                </p>
                                <img
                                  className="p-2"
                                  src="/assets/alby-how-to.png"
                                />
                              </div>
                            }>
                            <span>&#x24D8;</span>
                          </Popover>{" "}
                          {/* THIS SHOULD BE A POPOVER */}
                          <span className="text-skin-muted hidden">() </span>
                        </p>{" "}
                        <input
                          id={"`${E2EID.uploadCreatorWalletInputX}${index}`"}
                          autoComplete="off"
                          className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
                          placeholder="username@getalby.com"
                          name={"`creators.${index}.wallet`"}
                          maxLength={48} // 44 seems to be the max
                          value={postPodcastLud16}
                          onChange={postPodcastHandleLud16Change}
                        />
                      </FormLabelCreators>
                      <FormLabelCreators>
                        {" "}
                        <p>
                          Unlock cost {/* THIS SHOULD BE A POPOVER */}
                          <span className="text-skin-muted">( in Sats )</span>
                        </p>{" "}
                        <input
                          type="number"
                          id={"`${E2EID.uploadCreatorWalletInputX}${index}`"}
                          autoComplete="off"
                          min={1}
                          max={100000000}
                          className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
                          placeholder="Unlock cost"
                          name={"`creators.${index}.wallet`"}
                          maxLength={48} // 44 seems to be the max
                          value={postPodcastUnlockCost}
                          onChange={postPodcastHandleUnlockCostChange}
                        />
                      </FormLabelCreators>

                      {/* <FormLabelCreators className="hidden">
                    Revenue Share %
                    <input
                      id={"`${E2EID.uploadCreatorSplitInputX}${index}`"}
                      defaultValue={100}
                      max={100}
                      min={1}
                      type="number"
                      className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
                    ></input>
                  </FormLabelCreators> */}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <div className="flex items-center w-full mt-4">
            {/* <Modal isOpen={isCheckedAudio}>
            {<Upload onClick={() => setIsCheckedAudio(!isCheckedAudio)} />}
          </Modal> */}

            {/* ----- Toggle Paid Content Main Feed Page ----- */}

            {/* <label
              htmlFor="setAsGatedPodcast"
              className="relative inline-flex items-center px-2 py-1 border rounded-full cursor-pointer border-buttonAccent">
              <input
                checked={isCheckedAudio}
                onChange={handleCheckboxChangeAudio}
                type="checkbox"
                value=""
                name="setAsGatedPodcast"
                id="setAsGatedPodcast"
                className="sr-only peer"
              />
              <div className="w-10 h-6 peer-focus:outline-none bg-black/40 peer-focus:ring-2 peer-focus:ring-red-300  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-2 after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-buttonAccentHover"></div>
              <span className="ml-3 text-xs font-medium text-white">
                Paid Podcast?
              </span>
            </label> */}
          </div>
          {/* Debugging / User Validation */}
          <p
            className="mt-8 text-red-600 hidden"
            id={"E2EID.uploadErrorMessage"}>
            {/* {validationError?.error ?? ""} */}
          </p>
          <p className="hidden" id={"E2EID.uploadErrorType"}>
            {/* {validationError?.type ?? ""} */}
          </p>

          <div className="flex flex-col gap-2 mt-8 w-full items-center">
            <label htmlFor="E2EID.uploadTermsCheckbox">
              <input
                required
                id={"E2EID.uploadTermsCheckbox"}
                className="mr-2"
                type="checkbox"
                onChange={postPodcastHandleCheckTCChange}
                checked={postPodcastCheckTC}
              />
              I agree to the{" "}
              <Link
                href=""
                className="underline text-buttonMuted hover:text-buttonAccentHover">
                Terms and Conditions
              </Link>
            </label>
            <div className="flex w-full gap-4 justify-center mt-4 my-2">
              {" "}
              <Button
                onClick={onCancel}
                type="button"
                label="Cancel"
                id={"E2EID.uploadPublishButton"}
                className="px-5 text-xs"
              />
              <Button
                onClick={() => handlePostSubmit(null)}
                type="button"
                label="Submit"
                id={"E2EID.uploadPublishButton"}
                className="px-5 text-xs"
              />
            </div>
          </div>
        </div>

      </div>

      </form>
    </section>
  )
}
