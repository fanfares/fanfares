import React, { useEffect, useState } from "react"

interface AnimatedLabelInputTextAreaProps {
  label: string
  value: string
  onChange: (input: string) => void
  htmlFor?: string
  required?: boolean
}

export function AnimatedLabelTextAreaInput(
  props: AnimatedLabelInputTextAreaProps
) {
  const { htmlFor, label, onChange, value, required } = props
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value !== ""

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    setIsFocused(false)
  }

  return (
    <div className="relative w-full mt-4">
      <>
        <textarea
          required={required}
          onChange={e => {
            onChange(e.target.value)
          }}
          value={value}
          id={htmlFor}
          autoComplete="off"
          className={`w-full break-all appearance-none border-b bg-transparent p-2 focus:outline-none ${
            hasValue && "invalid:border-b-red-500 dark:invalid:border-red-500"
          }
             ${
               isFocused || hasValue
                 ? "border-buttonAccentHover "
                 : "border-white"
             }`}
          onFocus={handleFocus}
          onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => handleBlur(e)}
        />
      </>

      <label
        htmlFor={htmlFor}
        className={`absolute left-0  w-full ${
          isFocused || hasValue
            ? "-top-2 text-xs text-buttonAccentHover"
            : "top-1/2 -translate-y-1/2 text-gray-500"
        } transition-all duration-300`}>
        {label}
      </label>
    </div>
  )
}
