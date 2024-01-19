import React, { useState } from "react"

interface AnimatedLabelInputProps {
  label: string
  htmlFor?: string
  children?: React.ReactNode
  inputType?: string
  messageField?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailValidation?: (isValid: boolean) => void
}

const AnimatedLabelInput = (props: AnimatedLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    setIsFocused(false)
    setHasValue(e.target.value !== "")
  }

  return (
    <div className="relative w-full mt-4">
      {props.messageField ? (
        <>
          <textarea
            required
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              props.onChange
            }
            id={props.htmlFor}
            autoComplete="off"
            className={`w-full break-all appearance-none border-b-2 bg-transparent p-2 focus:outline-none ${
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
      ) : (
        <>
          {" "}
          <input
            required={props.inputType === "email" ? true : false}
            onChange={props.onChange}
            type={props.inputType || "text"}
            id={props.htmlFor}
            autoComplete="off"
            className={`w-full break-all appearance-none border-b-2 bg-transparent p-2 focus:outline-none ${
              hasValue && "invalid:border-b-red-500 dark:invalid:border-red-500"
            }

        ${
          isFocused || hasValue ? "border-buttonAccentHover " : "border-white"
        }`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />{" "}
        </>
      )}

      <label
        htmlFor={props.htmlFor}
        className={`absolute left-0  w-full ${
          isFocused || hasValue
            ? "-top-2 text-xs text-buttonAccentHover"
            : "top-1/2 -translate-y-1/2 text-gray-500"
        } transition-all duration-300`}>
        {props.label}
      </label>
    </div>
  )
}

export default AnimatedLabelInput
