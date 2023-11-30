import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  CreateARMediaState,
  getProgressOfCreateARMediaState
} from 'src/controllers/state/create-create-ar-media-slice';
import { useAppState } from 'src/controllers/state/use-app-state';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { CopyLink } from 'src/views/components/CopyLink';
import { WalletStateModal } from 'src/views/modals/WalletStateModal';

export interface UploadPageOverlayProps {
  showing: boolean;
  solanaCost: number;
  close: () => void;
}

export function UploadPageOverlay({ showing, close, solanaCost }: UploadPageOverlayProps) {
  const {
    createARMediaClear,
    createARMediaRetry,
    createARMediaStateDescription,
    createARMediaState,
    createARMediaArtworkTotalBytes,
    createARMediaArtworkUploadedBytes,
    createARMediaMediaTotalBytes,
    createARMediaMediaUploadedBytes,
    createARMediaMetadataTotalBytes,
    createARMediaMetadataUploadedBytes,
    createARMediaPlayerUrl,
    createARMediaStateProgress,
    balance,
    confettiPop
  } = useAppState();
  const router = useRouter();

  const [playerUrl, setPlayerUrl] = useState('');

  useEffect(() => {
    createARMediaClear();
  }, [createARMediaClear]);

  useEffect(() => {
    if (createARMediaState === CreateARMediaState.done) {
      confettiPop();
    }
  }, [createARMediaState, confettiPop]);

  useEffect(() => {
    if (createARMediaPlayerUrl) {
      setPlayerUrl(createARMediaPlayerUrl);
    }
  }, [createARMediaPlayerUrl]);

  const gotoPodcast = async () => {
    close();
    await router.push(createARMediaPlayerUrl);
  };

  const renderHeader = (title: string) => {
    return <p className="text-md text-center font-bold md:text-xl">{title}</p>;
  };

  const renderShare = () => {
    return (
      <>
        <CopyLink
          title="Share your Creation!"
          shareUrl={playerUrl}
          // hashtag="#excal #excalibur #web3audio"
          quote="I found this awesome podcast on excalibur.fm! Check it out!"
          textID={E2EID.uploadOverlayShareUrl}
          copyButtonID={E2EID.uploadOverlayShareUrlCopyButton}
        />
        <div className="flex justify-center gap-x-4">
          <button id={E2EID.uploadOverlayCloseButton} onClick={close} className="btn mt-8 w-32 px-2">
            Close
          </button>
          <button id={E2EID.uploadOverlayGoToAudioButton} onClick={gotoPodcast} className="btn mt-8 w-32 px-2">
            Go to Audio
          </button>
        </div>
      </>
    );
  };

  const renderNoWalletsDetected = () => {
    return (
      <ol className="mt-2 list-disc space-y-2 text-left text-sm font-thin md:mt-8 md:w-4/5 md:text-base ">
        <li>You need to get a Solana Wallet to be able to upload, we recommend the Glow wallet.</li>
        <li>Click the button below to go to the Glow website where you can install a wallet as a browser extension.</li>
      </ol>
    );
  };

  const renderNoWalletsConnected = () => {
    return (
      <ol className="mt-2 list-disc space-y-2 text-left text-sm font-thin md:mt-8 md:w-4/5 md:text-base ">
        <li>You will need to connect your wallet to upload your audio</li>
      </ol>
    );
  };

  const renderNotEnoughSolana = () => {
    return (
      <div>
        <p className="py-1 text-sm font-thin">You need some Solana in your wallet in order to upload.</p>
        <p className="py-1 text-sm font-thin">
          The total max cost of creating your account and uploading will be {solanaCost} SOL.
        </p>
        <p className="py-1 text-sm font-thin">
          If you&apos;ve already created an account you will need 0.016 SOL for each successive upload
        </p>
        <p className="py-1 text-sm font-thin">
          You can transfer some Solana to your wallet or buy some on an exchange, we suggest Kraken.
        </p>
        <p className="py-1 text-sm font-thin">
          ( Never leave your tokens on an exchnage - Not your keys, not your ponzi scheme )
        </p>
      </div>
    );
  };

  const renderSpinner = () => {
    return (
      <svg
        aria-hidden="true"
        className="mr-2 inline h-4 w-4 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    );
  };

  const renderLine = (state: CreateARMediaState) => {
    const isDone = createARMediaStateProgress > getProgressOfCreateARMediaState(state);

    let icon = isDone ? '✅' : renderSpinner();

    if (createARMediaState === state) {
      if (state === CreateARMediaState.uploadingArtwork) {
        if (createARMediaArtworkUploadedBytes) {
          icon = `${((createARMediaArtworkUploadedBytes / createARMediaArtworkTotalBytes) * 100).toFixed(0)}%`;
        } else {
          icon = 'Starting...';
        }
      }
      if (state === CreateARMediaState.uploadingMedia) {
        if (createARMediaMediaUploadedBytes) {
          icon = `${((createARMediaMediaUploadedBytes / createARMediaMediaTotalBytes) * 100).toFixed(0)}%`;
        } else {
          icon = 'Starting...';
        }
      }
      if (state === CreateARMediaState.uploadingMetadata) {
        if (createARMediaMetadataUploadedBytes) {
          icon = `${((createARMediaMetadataUploadedBytes / createARMediaMetadataTotalBytes) * 100).toFixed(0)}%`;
        } else {
          icon = 'Starting...';
        }
      }
    }

    return (
      <>
        <div className={`col-span-10 text-slate-300 ${createARMediaState === state ? 'animate-pulse' : ''}`}>
          {state}
        </div>
        <div className={`col-span-2 text-slate-300 ${createARMediaState === state ? 'animate-pulse' : ''}`}>{icon}</div>
      </>
    );
  };

  const renderStartButton = () => {
    if (createARMediaState !== CreateARMediaState.idle) return null;
    return (
      <button id={E2EID.uploadOverlayStartButton} onClick={createARMediaRetry} className="btn w-30 ml-4 mt-10">
        Upload
      </button>
    );
  };

  const renderCancelButton = () => {
    return (
      <button id={E2EID.uploadOverlayCancelButton} onClick={close} className="btn w-30 ml-4 mt-10">
        Cancel
      </button>
    );
  };

  const renderErrorButton = () => {
    if (createARMediaState !== CreateARMediaState.error) return null;
    return (
      <div>
        {/* <p>{createARMediaState}</p> */}
        <button id={E2EID.uploadOverlayRetryButton} onClick={createARMediaRetry} className="btn w-30 ml-4 mt-10">
          Retry
        </button>
      </div>
    );
  };

  const renderStateDescriptionHeader = () => {
    return (
      <p id={E2EID.uploadOverlayState} className="md:text-md text-sm font-bold uppercase">
        {createARMediaState}
      </p>
    );
  };
  const renderStateDescription = () => {
    return (
      <p id={E2EID.uploadOverlayStateDescription} className="md:text-md mb-5 text-sm">
        {createARMediaStateDescription}
      </p>
    );
  };

  const renderUploading = () => {
    return (
      <div className="">
        {renderHeader('Creating NFT of your Media')}
        <div>
          <p className="mt-4 text-center text-xs font-bold uppercase md:text-sm">
            {' '}
            Do not leave this page while uploading...{' '}
          </p>
          <p className="mt-2 text-center text-xs font-bold md:text-sm ">
            If the process appears to be stalled - look for your wallet and press approve.
          </p>
        </div>
        <hr className="my-4 border-buttonAccent" />
        <p className="md:text-md mb-3 text-center text-sm">Progress {createARMediaStateProgress}%</p>
        {renderStateDescriptionHeader()}
        {renderStateDescription()}
        <div className="grid grid-cols-12 gap-1 text-xs md:text-sm">
          {renderLine(CreateARMediaState.checkingInputs)}
          {renderLine(CreateARMediaState.checkingAccounts)}
          {renderLine(CreateARMediaState.fundingBundlr)}
          {renderLine(CreateARMediaState.uploadingCreatorMetadata)}
          {renderLine(CreateARMediaState.creatingCreatorAccount)}
          {renderLine(CreateARMediaState.editingCreatorAccount)}
          {renderLine(CreateARMediaState.uploadingArtwork)}
          {renderLine(CreateARMediaState.uploadingMedia)}
          {renderLine(CreateARMediaState.uploadingMetadata)}
          {renderLine(CreateARMediaState.createMediaAccount)}
          {renderLine(CreateARMediaState.settingMediaParameters)}
        </div>
        <div className="flex items-center justify-center">
          {renderStartButton()}
          {renderCancelButton()}
          {renderErrorButton()}
        </div>
      </div>
    );
  };

  const renderUploadState = () => {
    switch (createARMediaState) {
      case CreateARMediaState.done:
        return renderShare();
      default:
        return renderUploading();
    }
  };

  const renderReady = () => {
    return <div className="h-fit max-w-xl rounded-xl bg-skin-fill px-8 py-8 text-left ">{renderUploadState()}</div>;
  };

  return (
    <WalletStateModal
      isOpen={showing}
      closeAfterConnect={true}
      hasEnoughSolana={balance >= solanaCost}
      hasEnoughSolanaOverride={createARMediaState !== CreateARMediaState.idle}
      closeModal={close}
      renderNoWalletsDetected={renderNoWalletsDetected}
      renderNoWalletsConnected={renderNoWalletsConnected}
      renderNotEnoughSolana={renderNotEnoughSolana}
      renderReady={renderReady}
    />
  );
}
