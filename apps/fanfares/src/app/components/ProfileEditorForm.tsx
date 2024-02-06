"use client"

import Button from "./Button"

import { AnimatedLabelTextInput } from "./AnimatedLabelInputText"
import { AnimatedLabelTextAreaInput } from "./AnimatedLabelInputTextArea"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/pro-solid-svg-icons"
import {
  useProfileEditorUsername,
  useProfileEditorDisplayName,
  useProfileEditorWebsite,
  useProfileEditorAboutMe,
  useProfileEditorLud16,
  useProfileEditorActions,
  useProfileEditorLoading,
} from "../controllers/state/profile-editor-slice"
import { useAccountProfile } from "../controllers/state/account-slice"

const ProfileEditorForm = () => {
  //TODO : Loading icon on Submit
  const username = useProfileEditorUsername()
  const displayName = useProfileEditorDisplayName()
  const website = useProfileEditorWebsite()
  const aboutMe = useProfileEditorAboutMe()
  const lud16 = useProfileEditorLud16()
  const isLoading = useProfileEditorLoading()
  const {
    submit,
    setUsername,
    setDisplayName,
    setWebsite,
    setAboutMe,
    setLud16,
  } = useProfileEditorActions()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit()
  }

  const profile = useAccountProfile()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // need to finish the logic to upload the image to the profile
    const file = event.target.files?.[0]
    if (file) {
    }
  }

  const handleButtonClick = () => {
    const uploadInput = document.getElementById(
      "upload"
    ) as HTMLInputElement | null
    if (uploadInput) {
      uploadInput.click()
    }
  }

  return (
    <div className="flex flex-col w-full max-w-sm md:max-w-lg">
      <div className="p-4 rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start w-full gap-4 relative"
          action="">
          <label
            htmlFor="upload"
            className="relative w-full pointer-events-none">
            <img
              src={profile ? profile.picture : ""}
              className="w-24 rounded-full object-center"
              alt=""
            />
            <input
              type="file"
              id="upload"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <Button
            type="button"
            className="absolute text-xs right-0 top-16 px-2"
            onClick={handleButtonClick}
            label="Change avatar"
          />

          <AnimatedLabelTextInput
            required={true}
            label="Username*"
            htmlFor="username"
            value={username}
            onChange={setUsername}
          />
          <AnimatedLabelTextInput
            required={true}
            label="Display Name*"
            htmlFor="displayName"
            value={displayName}
            onChange={setDisplayName}
          />
          <AnimatedLabelTextInput
            required={true}
            label="Website"
            htmlFor="website"
            value={website}
            onChange={setWebsite}
          />
          <AnimatedLabelTextAreaInput
            required={true}
            label="About Me"
            htmlFor="aboutMe"
            value={aboutMe}
            onChange={setAboutMe}
          />
          <AnimatedLabelTextInput
            required={true}
            label="Lighning Address"
            htmlFor="lud16"
            value={lud16}
            onChange={setLud16}
          />
          <Button
            type="submit"
            label={isLoading ? "Loading..." : "Submit"}
            icon={isLoading && <FontAwesomeIcon icon={faSpinner} />}
            className="flex flex-row-reverse items-center px-4 mt-8 ml-auto"
          />
        </form>
      </div>
    </div>
  )
}

export default ProfileEditorForm
