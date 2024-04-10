"use client"
import Button from "./Button"
import {
  useFeedbackFormLoading,
  useFeedbackFormLud16,
  useFeedbackFormPublicKey,
  useFeedbackFormEmail,
  useFeedbackFormMessage,
  useFeedbackFormActions,
} from "../controllers/state/feedpack-form-slice"
import { AnimatedLabelTextInput } from "./AnimatedLabelInputText"
import { AnimatedLabelTextAreaInput } from "./AnimatedLabelInputTextArea"
import { useAccountProfile } from "../controllers/state/account-slice"
import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/pro-solid-svg-icons"

export function FeedbackForm() {
  const accountProfile = useAccountProfile()
  const isLoading = useFeedbackFormLoading()
  const lud16 = useFeedbackFormLud16()
  const publicKey = useFeedbackFormPublicKey()
  const email = useFeedbackFormEmail()
  const message = useFeedbackFormMessage()
  const { submit, setLud16, setPublicKey, setEmail, setMessage } =
    useFeedbackFormActions()

  useEffect(() => {
    if (accountProfile) {
      setPublicKey(accountProfile.pubkey)
      setLud16(accountProfile.lud16 ?? "")
    }
  }, [accountProfile])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit()
  }

  return (
    <div className="flex flex-col w-full max-w-sm mt-8 md:max-w-lg">
      <div className="p-4 rounded-lg">
        <h1
          id="e2e-whitepaper-heading"
          className="mt-4 text-xl font-bold leading-10 md:text-2xl xl:text-3xl"></h1>
        <>
          <p className="mt-4 font-thin text-sm">
            {" "}
            We aim to perfect FanFares to be an intuitive and easy to use
            application that gives access to Nostr for everyone no matter what
            their level of technical abilty.
          </p>
          <p className="mt-4 font-thin text-sm">
            For constructive feedback that genuinely adds value to the
            application we are willing to pay our customers 10,000 sats as a
            reward for identifying problems and making suggestions as to how the
            application can work better.
          </p>
        </>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start w-full gap-4 mt-8"
          action="">
          <AnimatedLabelTextInput
            label="Nostr Public Key*"
            htmlFor="publicKey"
            value={publicKey}
            onChange={setPublicKey}
          />
          <AnimatedLabelTextInput
            required={true}
            label="Lightning Address* (LUD16)"
            htmlFor="lud16"
            value={lud16}
            onChange={setLud16}
          />
          <AnimatedLabelTextInput
            required={true}
            label="E-Mail*"
            htmlFor="email"
            value={email}
            onChange={setEmail}
          />
          <AnimatedLabelTextAreaInput
            required={true}
            label="Message*"
            htmlFor="message"
            value={message}
            onChange={setMessage}
          />
          <Button
            type="submit"
            label={isLoading ? "Loading..." : "Submit"}
            icon={isLoading && <FontAwesomeIcon icon={faSpinner} />}
            className="flex flex-row-reverse items-center px-4 mt-8"
          />
        </form>
      </div>
    </div>
  )
}
