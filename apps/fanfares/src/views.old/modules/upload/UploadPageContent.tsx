import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ExcaliburWalletState } from 'src/controllers/state/create-app-state-slice';
import { CreateARMediaState } from 'src/controllers/state/create-create-ar-media-slice';
import { useAppState } from 'src/controllers/state/use-app-state';
import { UploadPageForm } from './UploadPageForm';
import { UploadPageOverlay } from './UploadPageOverlay';
import { MediaUploadFormData } from './media-upload-validation';

const UploadPageContent = () => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const { createARMedia, createARMediaClear, walletState, balance, createARMediaState } = useAppState();
  const [solanaCost, setSolanaCost] = useState<number>(0);

  useEffect(() => {
    createARMediaClear();
    setShowOverlay(false);
  }, [createARMediaClear, setShowOverlay]);

  const onFormSubmit = async (data: MediaUploadFormData) => {
    setShowOverlay(true);

    if (createARMediaState !== CreateARMediaState.idle) {
      toast('Already uploading');
      return;
    }

    if (balance < solanaCost) {
      toast.error('Not enough solana');
      return;
    }

    const duration = Number.parseFloat(data.duration.replace('s', ''));

    if (!duration) {
      toast.error('Badly formatted audio file');
      return;
    }

    await createARMedia({
      mediaName: data.name,
      mediaDescription: data.description,
      duration,
      mediaFile: data.media,
      creators: data.creators,
      thumbnailFile: data.thumbnail,
      minDonation: data.mintPrice,
      btcWallet: data.btcWallet
    });
  };

  const open = () => {
    setShowOverlay(true);
  };
  const close = () => {
    setShowOverlay(false);
    if (createARMediaState === CreateARMediaState.done) {
      createARMediaClear();
    }
  };

  const renderUploadPageForm = () => {
    if (createARMediaState === CreateARMediaState.done) return null; //Rests the page

    return (
      <UploadPageForm
        onFormSubmit={onFormSubmit}
        setShowWalletStateModal={open}
        setSolanaCost={setSolanaCost}
        shouldOpenWalletStateModal={
          walletState === ExcaliburWalletState.noWallets || walletState === ExcaliburWalletState.notConnected
        }
      />
    );
  };

  return (
    <div className="">
      <h1
        id="excalibur-upload"
        className="font-font1 mt-12 text-center text-xl font-black uppercase text-gray-100 md:mt-4 md:text-start md:text-4xl">
        Excalibur Upload
      </h1>
      <UploadPageOverlay showing={showOverlay} close={close} solanaCost={solanaCost} />
      {renderUploadPageForm()}
    </div>
  );
};

export default UploadPageContent;
