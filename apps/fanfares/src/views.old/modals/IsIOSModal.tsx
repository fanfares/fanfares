import { useEffect, useState } from "react"

import Modal from "./Modal"
import Button from "../components/Button"

const getMobileDetect = (userAgent: NavigatorID["userAgent"]) => {
  const isAndroid = () => Boolean(userAgent.match(/Android/i))
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i))
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i))
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i))
  const isSSR = () => Boolean(userAgent.match(/SSR/i))
  const isMobile = () =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows())
  const isDesktop = () => Boolean(!isMobile() && !isSSR())
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  }
}
const useMobileDetect = () => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent
  return getMobileDetect(userAgent)
}

function IsIOSModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  // const { walletState } = useAppState();
  const { isIos } = useMobileDetect()

  useEffect(() => {
    if (isIos()) {
      setIsOpen(true)
    }
    // eslint-disable-next-line
  }, [])

  const onClose = () => {
    setIsOpen(false)
  }

  const renderNote = () => {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen px-8 py-4 text-center bg-skin-fill md:h-fit md:max-w-md md:rounded-xl ">
        <h1 className="text-2xl font-bold uppercase">Limited IOS Features</h1>

        <p className="w-full mt-4 font-thin text-center">Hey there!</p>
        <p className="w-full mt-2 font-thin">
          You need a Wallet to fully enjoy our platform!
        </p>
        <p className="w-full mt-2 font-thin">
          We highly recommend Glow Wallet!
        </p>
        <Button
          className="flex-row mt-2"
          // text={'Install Glow wallet'
          child={
            <a
              className="flex items-center gap-2 w-fit "
              href="https://glow.app"
              target="_blank"
              rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="flex w-8 h-8 rounded"
                src="https://glow.app/landing/app-icons/purple.png"
                alt="Glow wallet icon"
              />
              <p>Install Glow </p>
            </a>
          }
        />

        <hr className="mt-8 w-[90%] border-buttonDisabled" />

        <div className="flex gap-4 mt-8">
          <button className="py-2 btn" onClick={onClose}>
            Gotcha!
          </button>
        </div>
      </div>
    )
  }

  return <Modal isOpen={isOpen}>{renderNote()}</Modal>
}

export default IsIOSModal
