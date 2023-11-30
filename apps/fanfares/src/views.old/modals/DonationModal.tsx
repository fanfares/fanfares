import { ChangeEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"

import {
  GoogleActionType,
  reportGoogleEvent,
} from "../modules/app/GoogleAnalytics"
import Modal from "./Modal"
import Button from "../components/Button"
import { WalletStateModal } from "./WalletStateModal"

function DonationModal() {
  // const {
  //   balance,
  //   publicKey,
  //   playerMediaAccount,
  //   playerContributorAccount,
  //   playerContribute,
  //   playerCreatorAccount,
  //   confettiPop,
  //   mediaModalClose,
  //   mediaModalState,
  // } = useAppState()

  const presetList = [0.01, 0.1, 0.5, 1, 5]

  // const max = (balance ?? 0) - 0.01
  const min = 0.01
  // const donated =
  //   (playerContributorAccount?.lamportsTotal ?? 0) / LAMPORTS_PER_SOL
  // const isOpen = mediaModalState === MediaModalState.donate

  const [solToDonate, setSolToDonate] = useState<number | undefined>(min)
  const [isLoading, setIsLoading] = useState(false)

  // useEffect(() => {
  //   setSolToDonate(min)
  // }, [balance, setSolToDonate])

  // useEffect(() => {
  //   setIsLoading(false)
  // }, [isOpen])

  // const { currencySliceGetCurrencyString } = useAppState()

  const parseNumberEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(event.target.value)
    if (isNaN(newAmount)) {
      setSolToDonate(undefined)
    } else {
      setSolToDonate(Math.min(newAmount))
    }
  }
  // const addDonation = () =>
  //   solToDonate + 0.01 < max
  //     ? setSolToDonate(solToDonate + 0.01)
  //     : setSolToDonate(max)
  // const minusDonation = () =>
  //   solToDonate > min + 0.01
  //     ? setSolToDonate(solToDonate - 0.01)
  //     : setSolToDonate(min)

  // const donateToMedia = async () => {
  //   if (min >= max) {
  //     toast.error(
  //       `You don't have enough to cover the minimum donation of ${min} SOL`
  //     )
  //     return
  //   } else if (!solToDonate) {
  //     toast.error("Please enter an amount to donate")
  //     return
  //   }

  //   try {
  //     setIsLoading(true)
  //     await playerContribute(solToDonate)

  //     // Google Anaylitics
  //     reportGoogleEvent({
  //       action: GoogleActionType.donate,
  //       params: {
  //         user_wallet: publicKey.toString(),
  //         sol_price: solToDonate.toFixed(3),
  //         media_key: playerMediaAccount.key.toString(),
  //       },
  //     })

  //     confettiPop()
  //     toast.success(`Donated ${solToDonate} Sol!`)
  //   } catch (err) {
  //     toast.error("Donation Error: ")
  //   }
  //   mediaModalClose()
  // }

  const renderLoading = () => {
    return (
      <div className="flex items-center justify-center w-full h-full ">
        <svg
          className="... mr-3 h-5 w-5 animate-spin"
          viewBox="0 0 24 24"></svg>
        <p className="animate-pulse">
          Donating {"`${solToDonate.toFixed(2)} SOL`"}...
        </p>
      </div>
    )
  }

  // const [btcWallet] = useState('34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo');

  const copyToClipboard = async (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    })
  }

  const renderBTCDonation = () => {
    // const btcWallet = playerCreatorAccount.btcAddress
    // if (!btcWallet) return null
    return (
      <div className="flex flex-col items-center justify-center w-full py-2 mx-auto text-center">
        <p className="text-sm font-thin text-center md:w-4/5 md:text-base">
          This creator also has Bitcoin wallet where you can donate:
        </p>
        <div className="flex items-center justify-center h-10 gap-2 pl-2 mx-auto text-xs text-center rounded w-fit bg-skin-button-accent">
          <p
            id="ml-2  e2e-share-link-input"
            className="bg-transparent outline-none text-skin-muted">
            {" "}
            {"btcWallet"}
          </p>
          <Button
            buttonType="reset"
            icon={"<FontAwesomeIcon icon={FAProSolid.faCopy} />"}
            onClick={() => {
              copyToClipboard("btcWallet")
            }}
            className="ml-auto bg-skin-button-default"
          />
        </div>
      </div>
    )
  }

  const renderDonationForm = () => {
    return (
      <>
        {/* {donated ? (
          <p className="mt-2 text-sm font-thin text-center md:mt-8 md:w-4/5 md:text-base">
            You have contributed{" "}
            <span className="text-skin-muted">{donated.toFixed(2)}</span> SOL
          </p>
        ) : null} */}
        {renderBTCDonation()}
        <hr className="mt-4 w-[90%] border-buttonDisabled" />
        <p className="mt-4 ">
          The contribution amount{" "}
          {/* <span className="text-skin-muted">
            (~{currencySliceGetCurrencyString(solToDonate)})
          </span> */}
        </p>
        <div className="flex flex-col w-full px-4 mr-auto md:flex-row md:justify-around">
          <div className="flex flex-row items-center justify-between mt-2 md:my-4 ">
            <div className="relative">
              <input
                value={""}
                onChange={parseNumberEvent}
                min={min}
                // max={max}
                type="number"
                step={0.01}
                id={""}
                className="w-20 h-10 pl-2 rounded outline-none bg-skin-button-accent text-skin-muted drop-shadow-lg placeholder:pl-1 placeholder:text-skin-muted md:w-20"
              />

              <label className="absolute right-2 top-2.5 text-sm text-skin-muted/20">
                SOL
              </label>
            </div>
            <Button
              text="-"
              buttonType="default"
              className="h-10 ml-auto md:ml-2 "
              onClick={() => {}}
            />

            <Button
              text="+"
              buttonType="default"
              className="h-10 ml-2"
              onClick={() => {}}
            />
          </div>
          <input
            className="w-full bg-transparent donationBar focus:shadow-none focus:outline-none focus:ring-0 md:w-2/4"
            type="range"
            min={min}
            // max={max}
            step={0.01}
            value={solToDonate ?? min}
            onChange={parseNumberEvent}
          />
        </div>
        {commonDonationValues()}
      </>
    )
  }

  const renderDonationTile = (amount: number) => {
    const hasEnough = amount
    //  <= max

    return (
      <div key={amount.toString() + "DonationTile"}>
        <Button
          buttonType="default"
          disabled={!hasEnough}
          onClick={() => {
            setSolToDonate(amount)
          }}
          className={`e2e-donate-button border-buttonMuted/20x mx-auto w-28 rounded-full  border px-1 py-2  text-sm drop-shadow-lg active:scale-95 ${
            hasEnough ? "opacity-100" : "opacity-50"
          }`}
          child={
            <>
              {" "}
              {amount.toFixed(2)}
              <span className="ml-2">SOL</span>
            </>
          }
        />
      </div>
    )
  }

  const commonDonationValues = () => {
    return (
      <div className="relative items-center justify-center w-full gap-2 mx-auto mt-12 space-y-2 text-center columns-2 md:mt-4 md:flex md:space-y-0 md:px-4">
        {presetList.map(amount => renderDonationTile(amount))}
        <Button
          buttonType="default"
          child={
            <>
              Max<span className="ml-2">SOL</span>
            </>
          }
          onClick={() => {
            setSolToDonate(1)
          }}
          className="py-2 mx-auto text-sm border rounded-full w-28 border-buttonMuted/20 drop-shadow-lg active:scale-95"
        />
      </div>
    )
  }

  // if (isLoading) {
  //   return <Modal isOpen={isOpen}>{renderLoading()}</Modal>
  // }

  const renderNoWalletsDetected = () => {
    return (
      <ol className="mt-2 space-y-2 text-sm font-thin text-left list-disc md:mt-8 md:w-4/5 md:text-base ">
        <li>
          You can contribute to the creators and their network of promoters.
        </li>
        <li>
          In order to contribute you need a crypto wallet containing some
          Solana.
        </li>
        <li>
          You need to get a Solana Wallet to contribute, we recommend the Glow
          wallet.
        </li>
        <li>
          Click the button below to go to the Glow website where you can install
          a wallet as a browser extension.
        </li>
      </ol>
    )
  }

  const renderNoWalletsConnected = () => {
    return (
      <ol className="mt-2 space-y-2 text-sm font-thin text-left list-disc md:mt-8 md:w-4/5 md:text-base ">
        <li>
          You can contribute to the creators and their network of promoters.
        </li>
        <li>In order to contribute you&apos;ll need to connect your wallet.</li>
      </ol>
    )
  }

  const renderNotEnoughSolana = () => {
    return (
      <ol className="mt-2 space-y-2 text-sm font-thin text-left list-disc md:mt-8 md:w-4/5 md:text-base">
        <li>
          You need at least {min} Solana in your wallet to contribute to the
          creators.
        </li>
        <li>You can get Solana from an exchange, we recommend kraken.com.</li>
        <li>
          Alternatively, you can contact us. We would like to hear from you and
          give you some Solana to get you started.
        </li>
      </ol>
    )
  }

  const renderReady = () => {
    return (
      <>
        {" "}
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">Contribute</p>
        {/* <ol className="mt-2 space-y-1 text-xs font-thin text-left list-outside md:mt-8 md:w-4/5 md:text-base">
          <li className="">Contribute to the Creators and their network of promoters here!</li>
          <li>95% of the contribution goes to the people that brought this content to you</li>
          <li>5% goes into the Excalibur Community Wallet</li>
          <li>Choose your contribution amount below:</li>
        </ol> */}
        {renderDonationForm()}
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <div className="flex gap-4 mb-8 md:mt-auto">
          <Button
            buttonType="default"
            text="Cancel"
            className="btn"
            onClick={() => {}}
          />

          <Button
            buttonType="default"
            text="Confirm"
            className="btn"
            onClick={() => {}}
          />
        </div>
      </>
    )
  }

  return (
    <WalletStateModal
      isOpen={false}
      closeAfterConnect={false}
      hasEnoughSolana={false}
      closeModal={() => {}}
      renderNoWalletsDetected={renderNoWalletsDetected}
      renderNoWalletsConnected={renderNoWalletsConnected}
      renderNotEnoughSolana={renderNotEnoughSolana}
      renderReady={renderReady}
    />
  )
}

export default DonationModal
