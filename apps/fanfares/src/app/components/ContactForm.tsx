"use client"
import { useState } from "react"
import AnimatedLabelInput from "./AnimatedLabelInput"
import Button from "./Button"
import Link from "next/link"
import sgMail from "@sendgrid/mail"

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/sendgrid", {
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
        <section className="mt-4">
          If you need any help, want to give any feedback, or want to upload
          your first audio, please reach out to us at:{" "}
          <a className="underline" href="mailto:support@fanfares.io">
            <p className="underline">support@fanfares.io</p>
          </a>
        </section>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start w-full mt-8 gap-4"
          action="">
          <AnimatedLabelInput
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            label="Name*"
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
            className="flex items-center mt-8 px-4"
          />
        </form>
      </div>
    </div>
  )
}

export default ContactForm
