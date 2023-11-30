import Button from '@components/Button';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppState } from 'src/controllers/state/use-app-state';
import { Text } from 'src/views/components/Text';
import Modal from './Modal';

export enum BurningMediaState {
  idle = 'Idle',
  burning = 'Burning...',
  error = 'Error',
  done = 'Done'
}

export interface BurnMediaModalProps {
  episodeNumber: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  callback: (wasSuccess: boolean) => void;
}

function BurnMediaModal(props: BurnMediaModalProps) {
  const { episodeNumber, isOpen, setIsOpen, callback } = props;
  const { creatorChannelBurnMedia } = useAppState();
  const { currencySliceGetCurrencyString } = useAppState();

  const [state, setState] = useState<BurningMediaState>(BurningMediaState.idle);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setState(BurningMediaState.idle);
  }, [isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  const burnMediaFunction = async () => {
    let wasSuccess = true;
    setState(BurningMediaState.burning);
    try {
      await creatorChannelBurnMedia(episodeNumber);
      setState(BurningMediaState.done);

      toast.success(`Burned!`);
    } catch (err) {
      setState(BurningMediaState.error);
      setError(`${err}`);
      toast.error('Burning Error: ', err);
      wasSuccess = false;
    }

    callback(wasSuccess);
    setIsOpen(false);
  };

  const renderFromInternalState = () => {
    switch (state) {
      case BurningMediaState.idle:
        return renderIdle();
      case BurningMediaState.burning:
        return renderLoading();
      case BurningMediaState.error:
        return renderError();
    }

    return null;
  };

  const renderIdle = () => {
    return (
      <div className="relative flex flex-col items-center px-6 py-4 mx-auto text-center rounded-xl bg-skin-fill ">
        <Text className="mt-4 text-2xl font-bold">Delete Media #{episodeNumber.toString().padStart(3, '0')}?</Text>
        <div className="mt-8 w-80">
          {' '}
          <Text className="font-thin text-center ">
            By deleteing this media you will be erasing it from the chain and will be refunded{' '}
            <span className="font-bold text-skin-muted">0.0122</span> solana{' '}
            <span className="text-skin-muted"> (~{currencySliceGetCurrencyString(0.0122)})</span>.{' '}
            <span className="block my-2 font-bold text-red-500 uppercase">This action is not recoverable.</span> This
            action can only happen if there have been 0 donations to the media.
          </Text>
        </div>
        <hr className="mt-4 w-[90%] border-buttonDisabled" />
        <div className="my-2" />
        <div className="flex gap-4 mt-auto mb-4">
          <Button onClick={onClose} buttonType="default" text="Cancel" />

          <Button buttonType="default" id="burn-nft-confirm-button" onClick={burnMediaFunction} text="Confirm" />
        </div>
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <svg className="... mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24"></svg>
        <p className="animate-pulse">Burning...</p>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="relative flex flex-col items-center px-6 py-4 mx-auto text-center rounded-xl bg-skin-fill md:px-0">
        <Text className="mt-4 text-2xl font-bold">Error Burning</Text>
        <div className="mt-8">
          <Text className="font-thin text-center md:w-4/5">There was an error burning: {error}</Text>
        </div>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <div className="my-2" />
        <div className="flex gap-4 my-4 mt-auto">
          <Button text="Cancel" className="btn" onClick={onClose} />
        </div>
      </div>
    );
  };

  return <Modal isOpen={isOpen}>{renderFromInternalState()}</Modal>;
}

export default BurnMediaModal;
