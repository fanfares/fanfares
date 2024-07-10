"use client"
import React, { useEffect, useState } from "react"
import { Modal } from "./Modal"
import Button from "./Button"

interface IosDetectionModalProps {}

function IosDetectionModal(props: IosDetectionModalProps) {
  const [showModal, setShowModal] = useState(false)
  const [showUpdateFirmware, setShowUpdateFirmware] = useState(false)
  const [showPWASteps, setShowPWASteps] = useState(false)

  function detectMobileFirmware() {
    function isMobileBrowser() {
      return /Mobi|Android/i.test(navigator.userAgent)
    }

    function isiOS() {
      return /iPhone|iPad|iPod/i.test(navigator.userAgent)
    }

    function getiOSVersion() {
      var match = navigator.userAgent.match(/OS (\d+)_\d+/)
      if (match) {
        return parseInt(match[1], 10)
      }
      return null
    }

    if (isMobileBrowser() && isiOS()) {
      setShowModal(true)
      var iosVersion = getiOSVersion()
      if (iosVersion !== null && iosVersion < 17) {
        setShowUpdateFirmware(true)
      } else if (iosVersion !== null && iosVersion >= 17) {
        setShowPWASteps(true)
      }
    }
  }
  useEffect(() => {
    detectMobileFirmware()
  }, [])

  const renderFirmwareUpdateInfo = () => {
    return (
      <>
        {" "}
        <p className="font-gloock ">Please Update your iOS!</p>
        <p className="font-gloock ">🚀 Welcome to FanFares App! 🚀</p>
        <p>
          To ensure the best experience, please update your iPhone to iOS
          version 17.0 or higher.
        </p>
        <ul>
          Follow these steps to continue enjoying our app:
          <li>1. Go to Settings</li>
          <li>2. Select General</li>
          <li>3. Tap on Software Update</li>
          <li>4. Download and install the latest iOS version</li>
        </ul>
      </>
    )
  }

  const renderPWASteps = () => {
    return <></>
  }

  return (
    <Modal isOpen={showModal}>
      <div className="flex flex-col items-center p-8 gap-y-8">
        {showUpdateFirmware && renderFirmwareUpdateInfo()}
        {showPWASteps && renderPWASteps()}
        <Button
          className="px-4"
          onClick={() => {
            setShowModal(false)
          }}
          label="Close"
        />
      </div>
    </Modal>
  )
}

export default IosDetectionModal
