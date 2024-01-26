"use client"
import { useState } from "react"
import AnimatedLabelInput from "./AnimatedLabelInput"
import Button from "./Button"
import Link from "next/link"

interface ContactFormProps {
  feedback?: boolean
  callToAction?: string
  lud16?: string
}

const ContactForm = (props: ContactFormProps) => {
  const { feedback, callToAction, lud16 } = props
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert(
          `Thanks for contacting us! We'll get back to you as soon as possible.`
        )
        setFormData({ name: "", email: "", message: "" })
      } else {
        alert("Error sending email.")
      }
    } catch (error) {
      console.error(error)
      alert(`Error sending email: ${error}`)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-sm mt-8 md:max-w-lg">
      <div className="p-4 rounded-lg">
        <h1
          id="e2e-whitepaper-heading"
          className="mt-4 text-xl font-bold leading-10 md:text-2xl xl:text-3xl">
          Contact Us{" "}
        </h1>
        {feedback ? (
          <>
            <div className="mt-4">
              We appretiate your feedback and want to reward you with some sats!
              If you find any issue with this form you can send an email to
              <a className="underline" href="mailto:support@fanfares.io">
                <p className="underline">support@fanfares.io</p>
              </a>
            </div>
          </>
        ) : (
          <div className="mt-4">
            If you need any help, want to give any feedback, or want to upload
            your first audio, please reach out to us at:{" "}
            <a className="underline" href="mailto:support@fanfares.io">
              <p className="underline">support@fanfares.io</p>
            </a>
            {/* <p className="mt-2">
            Alternatively you can send us a message using the form below.
          </p>{" "} */}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start w-full gap-4 mt-8"
          action="">
          <AnimatedLabelInput
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            label={feedback ? "LUD16*" : "Name*"}
            htmlFor="name"
          />
          <AnimatedLabelInput
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            label="Email*"
            htmlFor="email"
            inputType={"email"}
          />
          <AnimatedLabelInput
            onChange={e =>
              setFormData({ ...formData, message: e.target.value })
            }
            label="Message*"
            htmlFor="message"
            messageField
          />
          <Button
            type="submit"
            label="Submit"
            className="flex items-center px-4 mt-8"
          />
        </form>
      </div>
    </div>
  )
}

export default ContactForm
