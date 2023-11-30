import Button from '@components/Button';
import { MediaAccountMintingState } from '@excalibur/drm';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppState } from 'src/controllers/state/use-app-state';
import Modal from './Modal';

export interface EditFreezeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FreezeState = 'done' | 'confirming' | 'error' | 'working';

function EditFreezeStatusModal(props: EditFreezeStatusModalProps) {
  const { isOpen, onClose } = props;
  const [freezeState, setFreezeState] = useState<FreezeState>('confirming');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currencySliceGetCurrencyString } = useAppState();

  const { playerMediaAccount, playerSetMediaMintingState } = useAppState();

  useEffect(() => {
    if (isOpen) {
      setFreezeState('confirming');
    }
  }, [isOpen]);

  const isMintingFrozen = playerMediaAccount?.isMintingFrozen;
  const title = isMintingFrozen ? 'Thaw Minting 🔥' : 'Freeze Minting ❄️';
  const message = isMintingFrozen
    ? 'Confirm below to thaw the ability to mint. IE allow users to mint again.'
    : 'Confirm below to freeze the ability to mint.';

  const freezeUnfreezeMinting = async () => {
    try {
      setFreezeState('working');
      await playerSetMediaMintingState(
        isMintingFrozen ? MediaAccountMintingState.normal : MediaAccountMintingState.frozen
      );
      toast.success(`Minting is now ${isMintingFrozen ? 'Thawed 🔥' : 'Frozen ❄️'}`);
      setFreezeState('done');
    } catch (err) {
      console.log(err.message);
      const msg = `Error ${playerMediaAccount.isMintingFrozen ? 'thawing' : 'freezing'} minting`;
      setFreezeState('error');
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const renderConfirming = () => {
    return (
      <div className="relative flex flex-col items-center max-w-3xl max-h-full px-4 py-2 mx-auto h-fit min-h-fit rounded-xl bg-skin-fill md:py-0 md:px-0">
        <p className="flex mt-2 text-xl font-bold md:mt-8 md:text-2xl">{title}</p>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <p className="mt-2 text-sm font-thin text-center md:w-4/5 md:text-base">{message}</p>

        <p className="mt-4 text-sm font-thin text-center md:w-4/5 ">
          This transaction will cost a small transaction fee{' '}
          <span className=" text-skin-muted">{`0.001 SOL(~${currencySliceGetCurrencyString(0.001)})`}</span>
        </p>
        <hr className="mt-4 w-[90%] border-buttonDisabled" />

        <div className="flex gap-2 mt-2 mb-8 text-xl font-bold md:mt-8 md:text-2xl">
          <Button text="Cancel" onClick={onClose} />
          <Button text="Confirm" onClick={freezeUnfreezeMinting} />
        </div>
      </div>
    );
  };

  const renderDone = () => {
    return (
      <div className="relative flex flex-col items-center w-full max-w-3xl max-h-full px-6 py-2 mx-auto h-fit min-h-fit rounded-xl bg-skin-fill md:py-4 md:px-0">
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">Freeze Status Updated</p>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <p className="mt-2 text-sm font-thin text-center md:w-4/5 md:text-base">Your changes have been saved!</p>
        <hr className="mt-8 w-[90%] border-buttonDisabled" />

        <div className="flex gap-2 mt-2 mb-8 text-xl font-bold md:mt-8 md:text-2xl">
          <Button text="Done" onClick={onClose} />
        </div>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="relative flex flex-col items-center w-full max-w-3xl max-h-full px-6 py-2 mx-auto h-fit min-h-fit rounded-xl bg-skin-fill md:py-4 md:px-0">
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">{title}</p>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <p className="mt-2 text-sm font-thin text-center md:w-4/5 md:text-base">
          There was an error updating your media: {errorMessage}
        </p>
        <hr className="mt-8 w-[90%] border-buttonDisabled" />

        <div className="flex gap-2 mt-2 mb-8 text-xl font-bold md:mt-8 md:text-2xl">
          <Button text="Cancel" onClick={onClose} />
        </div>
      </div>
    );
  };

  const renderWorking = () => {
    return (
      <div className="relative flex flex-col items-center w-full max-w-3xl max-h-full px-6 py-2 mx-auto h-fit min-h-fit rounded-xl bg-skin-fill md:py-4 md:px-0">
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">{title}</p>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <svg className="... mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24"></svg>
        <p className="mt-2 text-sm font-thin text-center animate-pulse md:w-4/5 md:text-base">Working...</p>
        <br />
      </div>
    );
  };

  const renderFromState = () => {
    switch (freezeState) {
      case 'confirming':
        return renderConfirming();
      case 'done':
        return renderDone();
      case 'error':
        return renderError();
      case 'working':
        return renderWorking();
    }
  };

  return <Modal isOpen={isOpen}>{renderFromState()}</Modal>;
}

export default EditFreezeStatusModal;
