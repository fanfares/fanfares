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
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
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
          className="mt-4 text-xl font-bold leading-10 md:text-2xl xl:text-3xl"></h1>
        {feedback ? (
          <>
            <p className="mt-4 font-thin text-sm">
              {" "}
              We aim to perfect FanFares to be an intuitive and easy to use
              application that gives access to Nostr for everyone no matter what
              their level of technical abilty.
            </p>
            <p className="mt-4 font-thin text-sm">
              For constructive feedback that genuinely adds value to the
              application we are willing to pay our customers 10000 sats as a
              reward for identifying problems and making suggestions as to how
              the application can work better.
            </p>
          </>
        ) : (
          <p className="mt-4 font-thin text-sm">
            We apologise if you are experiencing issues with FanFares. Please
            write a description of your problem in the form below and we will
            get back to you as soon as possible in order to help fix the
            problem.
            {/* If you need any help, want to give any feedback, or want to upload
            your first audio, please reach out to us at:{" "}
            <a className="underline" href="mailto:support@fanfares.io">
              <p className="underline">support@fanfares.io</p>
            </a> */}
            {/* <p className="mt-2">
            Alternatively you can send us a message using the form below.
          </p>{" "} */}
          </p>
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
