"use client"
import Button from "@/app/components/Button"
import LabelForm from "@/app/components/LabelForm"
import { useState } from "react"

interface InputState {
  id: number
  value: string
  label: string
  placeholder: string
}

function Settings() {
  const initialInputs: InputState[] = [
    { id: 1, value: "", label: "Username", placeholder: "@ Username" },
    { id: 2, value: "", label: "Display Name", placeholder: "Your name" },
    {
      id: 3,
      value: "",
      label: "Lightning Address",
      placeholder: "user@lightningaddress.com",
    },
    {
      id: 4,
      value: "",
      label: "Verified Nostr Id",
      placeholder: "user@nostrnip05.com",
    },
  ]
  const [inputs, setInputs] = useState<InputState[]>(initialInputs)
  const [textAreaInput, setTextAreaInput] = useState("")

  const handleInputChange = (id: number, value: string) => {
    const updatedInputs = inputs.map(input =>
      input.id === id ? { ...input, value } : input
    )
    setInputs(updatedInputs)
  }

  return (
    <div className="w-full flex flex-col gap-5 items-center ">
      <div>
        <img src="" alt="" />
      </div>
      <form action=" " className="space-y-5 w-full">
        {inputs.map(input => (
          <LabelForm className="relative gap-2 group" key={input.id}>
            <p
              className={`text-xs font-thin absolute transition-all duration-300 ease-in-out w-full group-focus-within:-top-4 group-focus-within:text-buttonAccentHover group-focus-within:-translate-y-0
            ${
              input.value == ""
                ? "top-1/2 -translate-y-1/2"
                : "-top-4 -translate-y-0"
            }`}>
              {input.label}
            </p>
            <input
              className={`bg-transparent focus:outline-none w-full group-focus-within:text-left group-focus-within:placeholder:text-left transition-all duration-300 ease-linear
            ${
              input.value.length !== 0
                ? "placeholder:text-left text-left"
                : "placeholder:text-right text-right"
            }`}
              type="text"
              value={input.value}
              placeholder={input.placeholder}
              onChange={e => handleInputChange(input.id, e.target.value)}
            />
          </LabelForm>
        ))}
        <LabelForm className="relative gap-2 group">
          <p
            className={`text-xs font-thin absolute transition-all duration-300 ease-in-out w-full group-focus-within:-top-4 group-focus-within:text-buttonAccentHover group-focus-within:-translate-y-0
          ${
            textAreaInput.trim() == ""
              ? "top-4 -translate-y-1/2"
              : "-top-4 -translate-y-0"
          }`}>
            About Me
          </p>
          <textarea
            rows={12}
            value={textAreaInput}
            onChange={e => setTextAreaInput(e.target.value)}
            className={`bg-transparent group-focus:outline-dashed focus:outline-none w-full placeholder:text-right resize-none`}
          />
        </LabelForm>

        <div className="flex gap-2">
          <Button label="Save" className="w-40" />
          <Button label="Cancel" className="w-40" />
        </div>
      </form>
    </div>
  )
}

export default Settings
