import { ReactNode, useEffect, useState } from "react"
import Button from "./Button"

export interface ModalPostingProps {
  isOpen: boolean
  children?: ReactNode
}

export function ModalPosting(props: ModalPostingProps) {
  const { isOpen, children } = props
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Delay the showing of the modal slightly to allow transition
      setTimeout(() => {
        setShowModal(true)
      }, 100)
    } else {
      setShowModal(false)
    }
  }, [isOpen])

  return !isOpen ? null : (
    <div
      className={`fixed left-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center overflow-hidden backdrop-blur-sm transition-all",
    `}>
      <div
        className={`relative flex flex-col w-fit items-center justify-center border border-buttonAccent bg-skin-fill/95 drop-shadow-xl rounded transition-all duration-200 backdrop-blur-3xl ease-in-out
       ${showModal ? "translate-y-0" : "translate-y-[1000%]"}`}>
        {children}
      </div>
    </div>
  )
}
