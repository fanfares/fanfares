"use client"
import { useState } from "react"
import AnimatedLabelInput from "./AnimatedLabelInput"
import Button from "./Button"

import {
  useSupportFormName,
  useSupportFormEmail,
  useSupportFormMessage,
  useSupportFormLoading,
  useSupportFormActions,
} from "../controllers/state/support-form-slice"
import { AnimatedLabelTextInput } from "./AnimatedLabelInputText"
import { AnimatedLabelTextAreaInput } from "./AnimatedLabelInputTextArea"

const ContactForm = () => {
  //TODO : Loading icon on Submit
  // TODO: Support form and Feedback form
  const name = useSupportFormName()
  const email = useSupportFormEmail()
  const message = useSupportFormMessage()
  const isLoading = useSupportFormLoading()
  const { submit, setName, setEmail, setMessage } = useSupportFormActions()

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

        <p className="mt-4 font-thin text-sm">
          We apologise if you are experiencing issues with FanFares. Please
          write a description of your problem in the form below and we will get
          back to you as soon as possible in order to help fix the problem.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start w-full gap-4 mt-8"
          action="">
          <AnimatedLabelTextInput
            required={true}
            label="Name*"
            htmlFor="name"
            value={name}
            onChange={setName}
          />
          <AnimatedLabelTextInput
            required={true}
            label="Email*"
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
            className="flex items-center px-4 mt-8"
          />
        </form>
      </div>
    </div>
  )
}

export default ContactForm
