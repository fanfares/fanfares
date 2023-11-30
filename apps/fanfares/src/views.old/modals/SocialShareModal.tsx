import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import Modal from "./Modal"
import { CopyLink } from "../components/CopyLink"
import Button from "../components/Button"

export function SocialShareModal() {
  // const {
  //   publicKey,
  //   balance,
  //   currentCreatorHasUserAccount,
  //   playerMediaKey,
  //   playerAffiliateKey,
  //   playerCreateAffiliate,
  //   openConnectionPopup,
  //   walletState,
  //   currentCreatorCreateUserAccountFull,
  //   mediaModalState,
  //   confettiPop,
  //   mediaModalClose,
  // } = useAppState()

  // const [isLoading, setIsLoading] = useState<boolean>(false)

  // const isAffiliate = playerAffiliateKey !== null
  // const linkKey = playerAffiliateKey?.toString() ?? playerMediaKey.toString()

  // const quote = "I found this awesome podcast on excalibur.fm! Check it out!"
  // const shareUrl = getPlayerUrl(linkKey)
  // const shareOgUrl = getPlayerUrl(playerMediaKey.toString())
  // // const hashtag = '#excal #excalibur #web3audio';

  // const minAmountWithoutAccount = 0.021
  // const minAmountWithAccount = 0.0054
  // const minAmount = currentCreatorHasUserAccount
  //   ? minAmountWithAccount
  //   : minAmountWithoutAccount
  // const loggedIn = publicKey !== null
  // const isOpen = mediaModalState === MediaModalState.share

  // useEffect(() => {
  //   setIsLoading(false)
  // }, [isOpen])

  // useEffect(() => {
  //   setIsLoading(false)
  // }, [currentCreatorHasUserAccount])

  // const createCreatorAccount = async () => {
  //   setIsLoading(true)
  //   try {
  //     // await currentCreatorCreateUserAccount();
  //     await currentCreatorCreateUserAccountFull()
  //     toast.success(`Account Created!`)
  //   } catch (err) {
  //     console.log(err)
  //     toast.error("Creating Creator Error: ", err)
  //     setIsLoading(false)
  //   }
  // }

  // const createAffiliateAccount = async () => {
  //   setIsLoading(true)
  //   try {
  //     await playerCreateAffiliate()
  //     confettiPop()
  //     toast.success(`Affiliate Created!`)
  //   } catch (err) {
  //     console.log(err)
  //     toast.error("Creating Affiliate Error: ", err)
  //   }
  //   setIsLoading(false)
  // }

  // const renderFromInternalState = () => {
  //   if (!loggedIn) {
  //     return renderLogIn()
  //   }
  //   //  else if (isAffiliate) {
  //   //   return renderAlreadyAffiliate();
  //   // } else if (balance < minAmount) {
  //   //   return renderNoSolanaBalanceDetected();
  //   // } else if (!currentCreatorHasUserAccount) {
  //   //   return renderCreateAccountFirst();
  //   // } else {
  //   //   return renderCreateAffiliate();
  //   // }
  // }

  // const onConnect = () => {
  //   openConnectionPopup()
  //   mediaModalClose()
  // }

  const renderLogIn = () => {
    return (
      <>
        <p className="mt-8 text-sm text-center text-skin-muted">
          Connect Wallet to create Affiliate Link
        </p>
        <br></br>
        <button className="btn">Connect Wallet</button>
      </>
    )
  }

  const renderAlreadyAffiliate = () => {
    return null
  }

  // const renderBroke = () => {
  //   return (
  //     <div className="">
  //       <h2 className="mt-8 text-2xl font-bold text-center uppercase">Share & Earn</h2>
  //       {/* <p className="mt-8 text-sm text-center">
  //         Copy the link below or share it via social media and messaging platforms.
  //       </p> */}
  //       <p className="mt-4 text-sm font-thin text-center">
  //         You need to have at least {minAmount} SOL ( You have {balance.toFixed(4)} ) to create an affiliate link
  //       </p>
  //     </div>
  //   );
  // };

  // const renderCreateAccountFirst = () => {
  //   return (
  //     <>
  //       <p className="mt-8 text-2xl font-bold">Share & Earn</p>
  //       <p className="mt-8 text-sm text-center">
  //         Create an Ambassador account to be able to share this affiliate link and you will earn 50% of the revenue that
  //         you generate.
  //       </p>
  //       <p className="mt-8 text-sm text-center text-skin-muted">( Step 1/2 )</p>
  //       <label className="mt-4" htmlFor="TermsAndConditionCheckbox">
  //         <input required id="TermsAndConditionCheckbox" className="mr-2" type="checkbox" />I agree to the{' '}
  //         <Link href="https://docs.excalibur.fm/docs/Terms">
  //           <a className="underline text-buttonMuted hover:text-buttonAccentHover">Terms and Conditions</a>
  //         </Link>
  //       </label>
  //       <button
  //         id={E2EID.shareModalCreateCreatorButton}
  //         disabled={isLoading}
  //         className="mt-2 btn bg-buttonAccent"
  //         onClick={createCreatorAccount}>
  //         {isLoading ? 'Creating...' : 'Create Ambassador Account'}
  //       </button>
  //       <p className="mt-1 text-base text-skin-muted/80">
  //         {' '}
  //         This will cost 0.01432 SOL{' '}
  //         {/* <span className="text-skin-muted"> (~{currencySliceGetCurrencyString(0.01432)})</span>{' '} */}
  //         <SolanaAproximatedPrice price={0.01432} />
  //       </p>{' '}
  //       <hr className="w-full mt-8 border-buttonMuted/20" />
  //     </>
  //   );
  // };

  // const renderCreateAffiliate = () => {
  //   return (
  //     <div className="relative flex flex-col items-center w-full max-h-full px-6 py-4 mx-auto text-center h-fit min-h-fit rounded-xl bg-skin-fill md:px-0">
  //       <h2 className="mt-4 text-2xl font-bold uppercase">Share & Earn</h2>
  //       <ol className="mt-2 space-y-2 text-sm font-thin text-left md:mt-8 md:w-4/5 md:text-base">
  //         <li>Share the content with your network and earn rewards.</li>
  //         <li>Click on the button below to generate an affiliate link.</li>
  //         <li className=" text-skin-muted">
  //           This creates a smart contract where you will earn 50% of the revenue generated.
  //         </li>
  //       </ol>

  //       <Button
  //         buttonType="default"
  //         id={E2EID.shareModalCreateAffiliateButton}
  //         disabled={isLoading}
  //         className="mt-4 text-center"
  //         onClick={createAffiliateAccount}
  //         text={isLoading ? 'Creating...' : 'Create Affiliate Link'}
  //       />

  //       <p className="mt-1 text-base text-skin-muted/80">
  //         {' '}
  //         This will cost 0.00454 SOL <SolanaAproximatedPrice price={0.00454} />
  //       </p>

  //       <hr className="w-full mt-4 border-buttonMuted/20" />
  //     </div>
  //   );
  // };

  const renderFreeCopyLink = () => {
    // if (isAffiliate) return null
    return (
      <div className="mx-auto flex w-fit flex-col rounded-lg border border-white/[5%] bg-black/10 p-2 drop-shadow-2xl">
        {" "}
        <h3 className="mt-4 text-center uppercase">Share for Free</h3>
        <>
          <CopyLink shareUrl={""} quote={"quote"} />
          <p className="w-full text-sm text-center text-skin-muted">For free</p>
        </>
      </div>
    )
  }

  const renderShareAffiliateLinkCard = () => {
    return (
      <div className="flex w-full flex-col rounded-lg border border-white/[5%] bg-black/10 p-2 drop-shadow-2xl">
        <h2 className="mx-auto mt-4 font-bold uppercase text-start">
          Free Share
        </h2>

        <CopyLink shareUrl={"shareOgUrl"} quote={""} />
        <p className="w-full mt-2 text-sm text-center">
          This is the original episode link, use this one if you want to share
          without earning affiliate income.
        </p>
      </div>
    )
  }

  // const renderFreeLinkCard = () => {
  //   return (
  //     <div className="flex w-full flex-col rounded-lg border border-white/[5%] bg-black/10 p-2 drop-shadow-2xl">
  //       <h2 className="mx-auto mt-4 font-bold text-center uppercase">Revenue Share</h2>

  //       <CopyLink textID={E2EID.shareModalAffiliateLink} shareUrl={shareUrl} quote={quote} />
  //       <p className="w-full mt-2 text-sm text-center">Share and earn 50% of the revenue generated!</p>
  //     </div>
  //   );
  // };

  const renderAffiliateCopyLink = () => {
    // if (!isAffiliate) return null

    return (
      <div className="flex flex-col">
        <h2 className="mx-auto mt-4 mb-4 text-xl font-bold uppercase">
          Share with your friends
        </h2>
        <div className="mx-auto space-y-4 justify-items-center gap-x-8 md:grid md:space-y-0">
          {renderShareAffiliateLinkCard()}
          {/* {renderFreeLinkCard()} */}
        </div>
      </div>
    )
  }

  const copyLink = () => {
    return (
      <div className="w-full grid-cols-2 py-2 ">
        {renderAffiliateCopyLink()}
        {renderFreeCopyLink()}
      </div>
    )
  }

  const renderNoWalletsDetected = () => {
    return (
      <>
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">
          Share & Earn
        </p>

        <ol className="mt-2 space-y-2 text-sm font-thin text-left list-disc md:mt-8 md:w-4/5 md:text-base ">
          <li>
            If you want to generate an affiliate link you need a crypto wallet
            containing some Solana.
          </li>
          <li>
            You need to get a Solana Wallet wallet to become an affiliate, we
            recommend the Glow wallet.
          </li>
          <li>
            Click the button below to go to the Glow website where you can
            install a wallet as a browser extension.
          </li>
        </ol>

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

        <hr className="my-4 w-[90%] border-buttonDisabled" />
      </>
    )
  }

  const renderNoSolanaBalanceDetected = () => {
    return (
      <>
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">
          Share & Earn
        </p>

        <ol className="mt-2 space-y-2 text-sm font-thin text-left list-disc md:mt-8 md:w-4/5 md:text-base ">
          <li>
            If you want to generate an affiliate link you need some Solana in
            your wallet.
          </li>
          <li>You can get Solana from an exchange, we recommend kraken.com.</li>
          <li>
            Alternatively, you can contact us. We would like to hear from you
            and give you some Solana to get you started.
          </li>
        </ol>

        <button className="w-24 px-0 mt-3 btn">
          <a href="mailto:help@excalibur.fm">Contact Us</a>
        </button>

        <hr className="my-4 w-[90%] border-buttonDisabled" />
      </>
    )
  }

  const renderNoWalletsConnected = () => {
    return (
      <>
        <h2 className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">
          Share and Earn
        </h2>
        <ol className="mt-2 space-y-2 text-sm font-thin text-center md:mt-8 md:w-4/5 md:text-base ">
          <li>
            If you want to generate an affiliate link you&apos;ll need to
            connect your wallet first.
          </li>
        </ol>
        {/* <button className="mt-3 btn" onClick={openConnectionPopup}>
          Connect Wallet
        </button> */}
        <hr className="my-4 w-[90%] border-buttonDisabled" />
      </>
    )
  }

  // const renderWalletAndBalanceDetected = () => {
  //   return renderFromInternalState()
  // }

  // const renderFromState = () => {
  //   switch (walletState) {
  //     case ExcaliburWalletState.noWallets:
  //       return renderNoWalletsDetected()
  //     case ExcaliburWalletState.notConnected:
  //       return renderNoWalletsConnected()
  //     case ExcaliburWalletState.poor:
  //       return renderNoSolanaBalanceDetected()
  //     case ExcaliburWalletState.operational:
  //       return renderWalletAndBalanceDetected()
  //   }
  // }

  return (
    <Modal isOpen={false}>
      <div className="flex flex-col items-center justify-center mx-auto ">
        {/* {renderFromState()} */}
        {copyLink()}
        <hr className="w-full mt-4 border-buttonMuted/20" />
        <Button
          text="Close"
          className="my-4 btn bg-buttonAccent"
          // onClick={mediaModalClose}
        />
      </div>
    </Modal>
  )
}
