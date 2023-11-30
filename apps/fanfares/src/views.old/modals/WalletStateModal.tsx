import { ExcaliburWalletState } from 'src/controllers/state/create-app-state-slice';
import { useAppState } from 'src/controllers/state/use-app-state';
import Modal from './Modal';

export interface WalletStateModalProps {
  isOpen: boolean;
  hasEnoughSolana: boolean;
  hasEnoughSolanaOverride?: boolean;
  closeAfterConnect: boolean;
  closeModal: () => void;
  renderNoWalletsDetected: () => JSX.Element;
  renderNoWalletsConnected: () => JSX.Element;
  renderNotEnoughSolana: () => JSX.Element;
  renderReady: () => JSX.Element;
}

export function WalletStateModal(props: WalletStateModalProps) {
  const {
    isOpen,
    closeModal,
    renderNoWalletsDetected,
    renderNoWalletsConnected,
    hasEnoughSolana,
    hasEnoughSolanaOverride,
    renderNotEnoughSolana,
    renderReady,
    closeAfterConnect
  } = props;
  const { openConnectionPopup, walletState } = useAppState();

  const openConnectionPopupInternal = () => {
    openConnectionPopup();
    if (closeAfterConnect) closeModal();
  };

  const renderNoWalletsDetectedInternal = () => {
    return (
      <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center bg-skin-fill px-6 py-2 md:h-fit md:max-h-full md:min-h-fit md:max-w-3xl md:rounded-xl md:px-0 md:py-4">
        <p id="e2e-wallet-state-modal" className="hidden">
          {walletState}
        </p>
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">No Wallets Installed</p>
        {renderNoWalletsDetected()}
        <div className="btn my-4 px-4">
          <a href="https://glow.app/" target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://glow.app/landing/app-icons/purple.png" alt="" />
          </a>
        </div>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <div className="my-8 flex gap-4 md:mt-auto">
          <button id="e2e-wallet-state-modal-cancel" className="btn" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderNoWalletsConnectedInternal = () => {
    return (
      <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center bg-skin-fill px-6 py-2 md:h-fit md:max-h-full md:min-h-fit md:max-w-3xl md:rounded-xl md:px-0 md:py-4">
        <p id="e2e-wallet-state-modal" className="hidden">
          {walletState}
        </p>
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">No Wallet Connected</p>

        {renderNoWalletsConnected()}

        <hr className="my-4 w-[90%] border-buttonDisabled" />

        <div className="mb-8 flex gap-4 md:mt-auto">
          <button id="e2e-wallet-state-modal-connect" className="btn" onClick={openConnectionPopupInternal}>
            Connect Wallet
          </button>
          <button id="e2e-wallet-state-modal-cancel" className="btn w-24 px-0" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderNotEnoughSolanaInternal = () => {
    return (
      <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center bg-skin-fill px-6 py-2 md:h-fit md:max-h-full md:min-h-fit md:max-w-3xl md:rounded-xl md:px-0 md:py-4">
        <p id="e2e-wallet-state-modal" className="hidden">
          {walletState}
        </p>
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">Not Enough Solana</p>

        {renderNotEnoughSolana()}

        <hr className="my-8 w-[90%] border-buttonDisabled" />

        <div className="mb-8 flex gap-4 md:mt-auto">
          <button className="btn w-24 px-0" onClick={closeModal}>
            <a href="mailto:help@excalibur.fm">Contact Us</a>
          </button>
          <button id="e2e-wallet-state-modal-cancel" className="btn w-24 px-0" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderFromState = () => {
    switch (walletState) {
      case ExcaliburWalletState.noWallets:
        return renderNoWalletsDetectedInternal();
      case ExcaliburWalletState.notConnected:
        return renderNoWalletsConnectedInternal();
      case ExcaliburWalletState.poor:
        return renderNotEnoughSolanaInternal();
      case ExcaliburWalletState.operational:
        if (!hasEnoughSolana && !hasEnoughSolanaOverride) {
          return renderNotEnoughSolanaInternal();
        }
        return renderReady();
    }
  };

  return <Modal isOpen={isOpen}>{renderFromState()}</Modal>;
}
