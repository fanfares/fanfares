import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import {
  GoogleActionType,
  reportGoogleEvent,
} from "../modules/app/GoogleAnalytics"
import { WalletStateModal } from "./WalletStateModal"

enum MintNftState {
  confirming = "confirming",
  minting = "minting",
  error = "error",
}

function MintNftModal() {
  // const {
  //   publicKey,
  //   balance,
  //   playerMediaAccount,
  //   playerHasMinted,
  //   playerHasDonated,
  //   playerContributorAccount,
  //   playerContributeAndMint: contributeAndMintCurrentMedia,
  //   playerMint: mintCurrentMedia,
  //   confettiPop,
  //   mediaModalClose,
  //   mediaModalState
  // } = useAppState();

  const [state, setState] = useState<MintNftState>(MintNftState.confirming)
  const [error, setError] = useState<string>("")

  // const isOpen = mediaModalState === MediaModalState.mint;
  // const donated = (playerContributorAccount?.lamportsTotal ?? 0) / LAMPORTS_PER_SOL;
  // const contractMinDonation = playerMediaAccount?.minimumDonation;
  // const minDonation = contractMinDonation;
  // const totalCost = minDonation + 0.003;
  // const isBroke = balance < totalCost;

  // useEffect(() => {
  //   setState(MintNftState.confirming);
  // }, [isOpen]);

  // const mintMedia = async () => {
  //   if (!playerHasMinted && playerHasDonated) {
  //     setState(MintNftState.minting);
  //     try {
  //       await mintCurrentMedia();

  //       // Google Anaylitics
  //       reportGoogleEvent({
  //         action: GoogleActionType.mintNft,
  //         params: {
  //           user_wallet: publicKey.toString(),
  //           sol_price: minDonation.toFixed(3),
  //           media_key: playerMediaAccount.key.toString()
  //         }
  //       });

  //       mediaModalClose();
  //       confettiPop();
  //       toast.success(`Minted!`);
  //     } catch (err) {
  //       setState(MintNftState.error);
  //       setError(`${err}`);
  //       toast.error('Minting Error: ', err);
  //     }
  //   }
  // };

  // const donateAndMintMedia = async () => {
  //   if (!playerHasMinted) {
  //     setState(MintNftState.minting);
  //     try {
  //       await contributeAndMintCurrentMedia();
  //       mediaModalClose();
  //       confettiPop();
  //       toast.success(`Donated and Minted!`);
  //     } catch (err) {
  //       setState(MintNftState.error);
  //       setError(`${err}`);
  //       toast.error('Minting Error: ', err);
  //     }
  //   }
  // };

  // const onConfirm = async () => {
  //   if (minDonation > donated) {
  //     await donateAndMintMedia();
  //   } else {
  //     await mintMedia();
  //   }
  // };

  // const renderConfirmButton = () => {
  //   if (playerHasMinted) return null;
  //   if (isBroke) return null;

  //   return (
  //     <button id={E2EID.mintModalConfirmButton} className="btn" onClick={onConfirm}>
  //       Confirm
  //     </button>
  //   );
  // };

  const renderConfirmation = () => {
    return (
      <div className="relative flex flex-col items-center w-5/6 max-w-3xl max-h-full px-6 py-4 mx-auto text-center h-fit min-h-fit rounded-xl bg-skin-fill md:px-0">
        <p className="mt-4 text-2xl font-bold">Mint Episode NFT</p>
        <ol className="mt-2 space-y-2 text-sm font-thin text-left list-disc md:mt-8 md:w-4/5 md:text-base">
          <li>
            <s>95%</s> 100% of the Sol that you pay goes to the people that
            brought this content to you.
          </li>
          <li>
            <s>5% goes into the Excalibur Community Wallet.</s>
          </li>
        </ol>
        <hr className="mt-4 w-[90%] border-buttonDisabled" />
        {/* {renderFromWalletState()} */}
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <div className="flex gap-4 mt-auto mb-4">
          <button className="btn" onClick={() => {}}>
            Cancel
          </button>
          {/* {renderConfirmButton()} */}
        </div>
      </div>
    )
  }

  const renderLoading = () => {
    return (
      <div className="flex items-center justify-center w-full h-screen md:h-full">
        <svg
          className="... mr-3 h-5 w-5 animate-spin"
          viewBox="0 0 24 24"></svg>
        <p className="animate-pulse">Minting...</p>
      </div>
    )
  }

  const renderError = () => {
    return (
      <div className="relative flex flex-col items-center justify-center w-full px-6 py-4 mx-auto text-center bg-skin-fill md:h-fit md:max-h-full md:min-h-fit md:max-w-3xl md:rounded-xl md:px-0">
        <p className="mt-4 text-2xl font-bold">Error Minting</p>
        <div className="mt-8">
          <p className="font-thin text-center md:w-4/5">
            There was an error minting: {error}
          </p>
        </div>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <div className="flex gap-4 mt-auto mb-4">
          <button className="btn" onClick={() => {}}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // const renderFromWalletState = () => {
  //   if (playerHasMinted) {
  //     return renderHasMinted();
  //   } else if (isBroke) {
  //     return renderIsBroke();
  //   } else if (minDonation > donated) {
  //     return renderNeedToDonateMore();
  //   } else {
  //     return renderMintInfo();
  //   }
  // };

  const renderHasMinted = () => {
    return (
      <div className="flex flex-col w-full px-4 mr-auto md:flex-row md:justify-around">
        <div className="flex flex-row items-center justify-between my-4 ">
          <p className="text-sm font-thin">
            <span className=" text-skin-muted">Already Minted!</span>
          </p>
        </div>
      </div>
    )
  }

  const renderNeedToDonateMore = () => {
    return (
      <div className="flex flex-col w-full px-4 mt-4 mr-auto md:flex-row md:justify-around">
        <div className="flex flex-row items-center justify-between my-4 ">
          <p className="text-sm font-thin">
            By pressing confirm you are donating{" "}
            <span className=" text-skin-muted">{"minDonation"} SOL</span>{" "}
            {/* <SolanaAproximatedPrice price={minDonation} /> */}
            and minting this media.
          </p>
        </div>
      </div>
    )
  }

  const renderIsBroke = () => {
    return (
      <div className="flex flex-col w-full px-4 mr-auto md:flex-row md:justify-around">
        <div className="flex flex-row items-center justify-between my-4 ">
          <p className="text-sm font-thin">
            You need at least{" "}
            <span className=" text-skin-muted">
              {"totalCost.toFixed(3)"} SOL
            </span>{" "}
            to mint this NFT ( You have
            <span className=" text-skin-muted"> {"balance"} SOL</span> )
          </p>
        </div>
      </div>
    )
  }

  const renderMintInfo = () => {
    return (
      <div className="flex flex-col w-full px-4 mr-auto md:flex-row md:justify-around">
        <div className="flex flex-row items-center justify-between my-4 ">
          <p className="text-sm font-thin">
            Minting will cost {"totalCost.toFixed(4)"} SOL
            {/* <SolanaAproximatedPrice price={totalCost} /> */}
          </p>
        </div>
      </div>
    )
  }

  const renderNoWalletsDetected = () => {
    return (
      <ol className="mt-2 space-y-2 text-sm font-thin text-left list-disc md:mt-8 md:w-4/5 md:text-base ">
        <li>
          In order to mint an Audio NFT you need a crypto wallet containing some
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
          {/* You need at least {minDonation} Solana{" "}
          <SolanaAproximatedPrice price={minDonation} /> */}
          in your wallet to Mint an Audio NFT.
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
    switch (state) {
      case MintNftState.confirming:
        return renderConfirmation()
      case MintNftState.minting:
        return renderLoading()
      case MintNftState.error:
        return renderError()
    }
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

export default MintNftModal
