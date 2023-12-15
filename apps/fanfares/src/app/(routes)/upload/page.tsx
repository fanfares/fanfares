"use client"
import Button from "@/app/components/Button"
import { MediaAudioUploadField } from "@/app/components/MediaAudioUploadField"
import { MediaCreatorForm } from "@/app/components/MediaCreatorForm"
import { MediaThumbnailUploadField } from "@/app/components/MediaThumbnailUploadField"
import Link from "next/link"
import { useState } from "react"

interface UploadProps {
  onClick: () => void
}

export default function Upload({ onClick }: UploadProps) {
  const [text, setText] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  return (
    <section className="w-full">
      <form onSubmit={() => {}}>
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          <div className="upperSectionForm flex flex-col w-full gap-4 md:flex-row">
            <div className="flex mx-auto">
              <MediaThumbnailUploadField />
            </div>
            <div className="w-full mx-auto space-y-4 pt-2">
              {/* <MediaNameField maxLength={MAX_TITLE_LENGTH} /> */}
              <div className="relative">
                <label>
                  <input
                    id={"E2EID.uploadTitleInput"}
                    placeholder="Title"
                    className="w-full border-b-2 border-buttonAccent bg-transparent outline-none font-thin text-xl placeholder:text-xl placeholder:font-thin placeholder:text-skin-muted"
                    // requiredMessage="Please enter the Episode name"
                    maxLength={100}
                    name="name"
                  />
                  <p
                    className={`absolute right-0 top-8 text-xs ${
                      "charsLeft < 8" ? "text-red-500" : "text-skin-inverted"
                    }`}>
                    {" "}
                    {"100"}
                  </p>
                </label>
              </div>

              {/* <MediaDescriptionField maxLength={MAX_DESCRIPTION_LENGTH} /> */}
              <div className="relative">
                <textarea
                  id={"E2EID.uploadDescriptionInput"}
                  placeholder="Description"
                  className="w-full h-40 min-h-[40px] max-h-[200px] bg-transparent border-b-2 outline-none resize-none notes active border-buttonAccent placeholder:text-xl placeholder:font-thin placeholder:text-skin-muted overflow-y-auto"
                  maxLength={9999}
                  name="description"
                  value={text}
                  onChange={handleChange}
                />
                <p
                  className={`absolute -bottom-4 right-0 text-xs ${
                    "charsLeft < 8" ? "text-red-500" : "text-skin-inverted"
                  }`}>
                  {"100"}
                </p>
              </div>
            </div>
          </div>
          <MediaAudioUploadField />
          <div className="flex-col w-full hidden">
            {/* <MediaParameterForm /> */}
            <MediaCreatorForm
            // shouldOpenConnectDialog={shouldOpenWalletStateModal}
            // onConnectDialog={setShowWalletStateModal}
            />
          </div>
          <p className="mt-8 text-red-600" id={"E2EID.uploadErrorMessage"}>
            {/* {validationError?.error ?? ""} */}
          </p>
          <p className="hidden" id={"E2EID.uploadErrorType"}>
            {/* {validationError?.type ?? ""} */}
          </p>
          {/* <UploadCosts costChangeCallback={interceptSetSolanaCost} /> */}
          <div className="flex flex-col gap-2 mt-8">
            <label htmlFor="TermsAndConditionCheckbox">
              <input
                required
                id={"E2EID.uploadTermsCheckbox"}
                className="mr-2"
                type="checkbox"
              />
              I agree to the{" "}
              <Link
                href="https://docs.excalibur.fm/docs/Terms"
                className="underline text-buttonMuted hover:text-buttonAccentHover">
                Terms and Conditions
              </Link>
            </label>
            <Button
              label="Publish"
              id={"E2EID.uploadPublishButton"}
              className="w-full px-5 mx-auto"
            />
            <Button
              onClick={onClick}
              label="Cancel"
              id={"E2EID.uploadPublishButton"}
              className="w-full px-5 mx-auto"
            />{" "}
          </div>
          {/* <div className="mb-[]" /> */}
        </div>
      </form>
    </section>
  )
}
