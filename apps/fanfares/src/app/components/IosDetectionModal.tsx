"use client"
import React, { useEffect, useState } from "react"
import { Modal } from "./Modal"
import Button from "./Button"
import Link from "next/link"
import { detectIOSFirmware } from "./MobileDetection"

interface IosDetectionModalProps {}

function IosDetectionModal(props: IosDetectionModalProps) {
  const [showModal, setShowModal] = useState(false)
  const [showUpdateFirmware, setShowUpdateFirmware] = useState(false)
  const [showPWASteps, setShowPWASteps] = useState(false)

  // show remedial instructions for iOS regarding nsec.app installation as PWA
  useEffect(() => {
    const ios = detectIOSFirmware()
    if (ios) {
      setShowModal(true)
      if (ios < 17) {
        setShowUpdateFirmware(true)
      }
      if (ios >= 17) {
        setShowPWASteps(true)
      }
    }
  }, [])

  const renderPWASteps = () => {
    return (
      <>
        <p>We use https://nsec.app to make the signing process easier on iOS</p>
        <p>Follow the steps below to start using FanFares</p>
        <ul>
          <li>
            1. Click here and navigate to{" "}
            <Link className="text-blue-500" href="https://nsec.app/ios.html">
              https://nsec.app/
            </Link>
            .
          </li>
          <li>
            2. Tap the <strong>Share</strong> icon at the bottom of the screen.
          </li>
          <li>
            3. Scroll down and select <strong>Add to Home Screen</strong>.
          </li>
          <li>
            4. Tap <strong>Add</strong> in the upper right corner.
          </li>
        </ul>
        <p>
          You will now see NSEC App on your home screen, just like a native app
          and you will be able to enjoy all FanFares features.
        </p>
        <p>For the best functionality, please enable the Push API:</p>
        <ul>
          <li>
            1. Go to iOS Settings &rarr; Safari &rarr; Advanced &rarr;
            Experimental Features.
          </li>
          <li>
            2. Enable <strong>Push API</strong>.
          </li>
        </ul>
      </>
    )
  }

  const renderFirmwareUpdateInfo = () => {
    return (
      <>
        <p className="font-gloock ">Please Update your iOS!</p>
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

  return (
    <Modal isOpen={showModal}>
      <div className="flex flex-col items-center p-8 gap-y-8 overflow-scroll">
        <p className="font-gloock ">🚀 Welcome to FanFares App! 🚀</p>

        {showUpdateFirmware && renderFirmwareUpdateInfo()}
        {showPWASteps && renderPWASteps()}
        <Button
          className="px-4"
          onClick={() => {
            setShowModal(false)
            setShowUpdateFirmware(false)
            setShowPWASteps(false)
          }}
          label="Close"
        />
      </div>
    </Modal>
  )
}

export default IosDetectionModal
