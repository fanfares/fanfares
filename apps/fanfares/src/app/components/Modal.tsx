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
      className={`fixed left-0 top-0 z-50 flex h-full w-screen flex-col items-center justify-center overflow-hidden backdrop-blur-sm transition-all duration-300 ease-in-out",
    ${showModal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`}>
      <div
        className={`relative flex flex-col items-center justify-center h-screen px-6 py-4 mx-auto border border-buttonAccent bg-white/10 drop-shadow-xl md:h-fit md:max-h-full md:min-h-fit md:max-w-3xl md:rounded-xl md:px-6 md:py-8 transition-all duration-1000 backdrop-blur-3xl
       `}>
        {children}
      </div>
    </div>
  )
}
