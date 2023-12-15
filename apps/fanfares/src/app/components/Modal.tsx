import { ReactNode, useEffect, useState } from "react"

interface ModalProps {
  isOpen: boolean
  children?: ReactNode
}

export function Modal({ isOpen, children }: ModalProps) {
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
      className={`fixed left-0 top-0 z-50 flex h-full w-screen flex-col items-center justify-center overflow-hidden backdrop-blur-sm transition-all",
    `}>
      <div
        className={`relative flex flex-col w-full md:max-w-modal-tablet items-center justify-center h-screen px-6 py-4 mx-auto border border-buttonAccent bg-skin-fill/95 drop-shadow-xl md:h-fit md:max-h-full md:min-h-fit md:rounded md:px-4 md:py-5 transition-all duration-200 backdrop-blur-3xl ease-in-out
       ${showModal ? "translate-y-0" : "translate-y-[200%]"}`}>
        {children}
      </div>
    </div>
  )
}
