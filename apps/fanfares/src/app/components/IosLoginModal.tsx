"use client"
import React, { useEffect, useState } from "react"
import { Modal } from "./Modal"
import Button from "./Button"
import Link from "next/link"
import { detectIOSFirmware } from "./MobileDetection"
import { IosInstructions } from "./IosInstructions"
import { FaExternalLinkAlt } from "react-icons/fa";


interface IosLoginModalProps {}

function IosLoginModal(props: IosLoginModalProps) {
  const [showModal, setShowModal] = useState(false)
  const [showUpdateFirmware, setShowUpdateFirmware] = useState(false)
  const [showPWASteps, setShowPWASteps] = useState(false)

  const ios = detectIOSFirmware()

  function triggerNostrLogin() {
    document.dispatchEvent(new CustomEvent("nlLaunch"))
  }

  function enableNsecbunker() {
    localStorage.setItem("nsecbunker", "true")
    window.location.reload()
  }

  // mount listener for nostr-login interceptor event
  useEffect(() => {
    function iosInterrupt() {
      const nsecbunkerDontShow = localStorage.getItem("nsecbunker-dontshow")
      if (ios && nsecbunkerDontShow !== "true") {
        setShowModal(true)
      } else {
        triggerNostrLogin()
      }
    }
    document.addEventListener("promptLogin", iosInterrupt)
    return () => {
      document.removeEventListener("promptLogin", iosInterrupt) 
    }
  }, [])

  // show remedial instructions for iOS regarding nsec.app installation as PWA
  useEffect(() => {
    if (ios) {
      // if (ios < 17) {
      //   setShowUpdateFirmware(true)
      // }
      // if (ios >= 17) {
        setShowPWASteps(true)
      // }
    }
  }, [])

  const renderPWASteps = () => {
    const nsecbunker = localStorage.getItem("nsecbunker")

    if (nsecbunker === "true") {
      // nsecbunker is enabled
      return (
        <IosInstructions/>
      )
    } else {
      // first time modal
      return (
        <>
          {/* PWA steps content */}
          <p>iOS has quirks that make <a className="text-blue-500" href="https://nsec.app" target="_blank" rel="noopener noreferrer">nsec.app <FaExternalLinkAlt className="inline"/></a> tricky to use, but it is a convenient option for mobile Safari users.</p>
          <IosInstructions/>
          <p>If you'd like to enable nsecbunker login options, click here.</p>
          <button className="px-1 flex items-center justify-center p-2 border-2 border-buttonAccentHover rounded-full bg-buttonAccent hover:bg-buttonAccentHover transition-all duration-300 ease-in-out transform text-sm hover:bg-skin-fill gap-2 font-gloock" onClick={enableNsecbunker}>Enable nsecbunker</button>
        </>
      )
    }
  }

  const renderFirmwareUpdateInfo = () => {
    return (
      <>
        {/* Firmware update info content */}
        <p>Please update to the latest version of iOS to access nsecbunker login options.</p>
      </>
    )
  }

  const dontShowAgain = () => {
    localStorage.setItem("nsecbunker-dontshow", "true")
    setShowModal(false)
    triggerNostrLogin()
  }

  const nsecbunker = localStorage.getItem("nsecbunker")
  const nsecbunkerDontShow = localStorage.getItem("nsecbunker-dontshow")

  return (
    <Modal isOpen={showModal}>
      <div className="flex flex-col p-4 gap-y-8 overflow-scroll">
        <h2 className="font-gloock text-3xl">Advanced Login {!nsecbunker ? "Options" : ""} for iOS</h2>
        {showUpdateFirmware && renderFirmwareUpdateInfo()}
        {showPWASteps && renderPWASteps()}
        <Button
          className="px-4"
          onClick={() => {
            setShowModal(false)
            triggerNostrLogin()
          }}
          label="Continue"
        />
        { nsecbunker === "true" ? <Button className="px-4 border-none text-red-500" onClick={dontShowAgain} label="Don't show again"/> : null }
      </div>
    </Modal>
  )
}

export default IosLoginModal
