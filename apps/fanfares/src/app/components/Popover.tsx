// @flow strict
"use client"
import { useEffect, useRef, useState } from "react"

export interface PopoverProps {
  children: React.ReactNode
  content: React.ReactNode
  trigger?: "click" | "hover"
}

export function Popover(props: PopoverProps) {
  const { children, content, trigger = "hover" } = props
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)

  const handleMouseOver = () => {
    if (trigger === "hover") {
      setShow(true)
    }
  }

  const handleMouseLeft = () => {
    if (trigger === "hover") {
      setShow(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        wrapperRef.current &&
        !(wrapperRef.current as any).contains(event.target)
      ) {
        setShow(false)
      }
    }

    if (show) {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [show, wrapperRef])

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeft}
      className="w-fit h-fit relative flex justify-center items-center">
      <div onClick={() => setShow(!show)}>{children}</div>
      <div
        hidden={!show}
        className="min-w-fit w-[200px]  bg-skin-fill h-fit absolute bottom-[100%] z-50 border rounded border-buttonAccent transition-all drop-shadow-md mb-2">
        <div className="rounded px-2 py-1">{content}</div>
      </div>
    </div>
  )
}
