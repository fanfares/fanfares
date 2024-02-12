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
  useProfileEditorImageUrl,
  useProfileEditorImageFile,
} from "../controllers/state/profile-editor-slice"
import { useAccountActions, useAccountNostr, useAccountProfile } from "../controllers/state/account-slice"
import { useCallback, useEffect } from "react"
import { useNostr } from "../controllers/state/nostr-slice"

export interface ProfileEditorFormProps {
  onClose: () => void,
}

export function ProfileEditorForm(props: ProfileEditorFormProps) {
  //TODO : Loading icon on Submit
  const { onClose } = props;
  const { nostrPool, nostrRelays } = useNostr();
  const profile = useAccountProfile();
  const nostrAccount = useAccountNostr();
  const username = useProfileEditorUsername()
  const displayName = useProfileEditorDisplayName()
  const website = useProfileEditorWebsite()
  const aboutMe = useProfileEditorAboutMe()
  const lud16 = useProfileEditorLud16()
  const imageUrl = useProfileEditorImageUrl()
  const isLoading = useProfileEditorLoading()
  const { accountFetchProfile } = useAccountActions();

  const {
    clearToProfile,
    submit,
    setUsername,
    setDisplayName,
    setWebsite,
    setAboutMe,
    setLud16,
    handleImageFileChange,
  } = useProfileEditorActions()

  const refreshAccount = useCallback(()=>{ 
    if(nostrAccount && nostrAccount.accountPublicKey){
      accountFetchProfile(nostrAccount.accountPublicKey, nostrPool, nostrRelays);
    }
  }, [nostrAccount, nostrAccount?.accountPublicKey, nostrPool, nostrRelays])

  useEffect(() => {
    refreshAccount();
  }, [nostrAccount, nostrAccount?.accountPublicKey, nostrPool, nostrRelays])

  useEffect(() => {
    if (profile) {
      clearToProfile(profile)
    }
  }, [profile, clearToProfile])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(profile){
      submit(nostrPool, nostrRelays, profile).then(() => {
        refreshAccount();
      })
    }
  }

  const handleChangeImageClick = () => {
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
              src={imageUrl ?? 'https://placehold.co/500x500'}
              className="w-24 rounded-full object-center"
              alt=""
            />
            <input
              type="file"
              id="upload"
              className="hidden"
              onChange={handleImageFileChange}
            />
          </label>
          <Button
            type="button"
            disabled={isLoading}
            className="absolute text-xs right-0 top-16 px-2"
            onClick={handleChangeImageClick}
            label="Change avatar"
          />
          <AnimatedLabelTextInput
            label="Username*"
            htmlFor="username"
            value={username}
            onChange={setUsername}
          />
          <AnimatedLabelTextInput
            label="Display Name*"
            htmlFor="displayName"
            value={displayName}
            onChange={setDisplayName}
          />
          <AnimatedLabelTextInput
            label="Website"
            htmlFor="website"
            value={website}
            onChange={setWebsite}
          />
          <AnimatedLabelTextAreaInput
            label="About Me"
            htmlFor="aboutMe"
            value={aboutMe}
            onChange={setAboutMe}
          />
          <AnimatedLabelTextInput
            label="Lightning Address"
            htmlFor="lud16"
            value={lud16}
            onChange={setLud16}
          />
          <Button
            type="submit"
            label={isLoading ? "Loading..." : "Submit"}
            disabled={isLoading}
            icon={isLoading && <FontAwesomeIcon icon={faSpinner} />}
            className="flex flex-row-reverse items-center px-4 mt-8 ml-auto"
          />
          <Button
            type="button"
            label={"Cancel"}
            onClick={onClose}
            disabled={isLoading}
            className="flex flex-row-reverse items-center px-4 mt-8 ml-auto"
          />
        </form>
      </div>
    </div>
  )
}

export default ProfileEditorForm
