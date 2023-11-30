import Button from '@components/Button';
import Link from 'next/link';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { toast } from 'react-toastify';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from 'src/controllers/utils/nft-metadata';
import { MediaAudioUploadField } from 'src/views/components/MediaAudioUploadField';
import { MediaDescriptionField } from 'src/views/components/MediaDescriptionField';
import { MediaNameField } from 'src/views/components/MediaNameField';
import { MediaThumbnailUploadField } from 'src/views/components/MediaThumbnailUploadField';
import { Text } from 'src/views/components/Text';
import { MediaCreatorForm } from './MediaCreatorForm';
import { MediaParameterForm } from './MediaParameterForm';
import { UploadCosts } from './UploadCosts';
import { MediaUploadFormData, MediaUploadValidation, validateMediaUploadFormData } from './media-upload-validation';

export interface UploadPageFormProps {
  onFormSubmit: (formData: MediaUploadFormData) => void;
  setShowWalletStateModal: () => void;
  setSolanaCost: (cost: number) => void;
  shouldOpenWalletStateModal: boolean;
}

const UPLOAD_STEPS = [
  // A little jank, but it will do for now.
  {
    content: 'This will not show',
    target: '#bad-id',
    placement: 'left'
  },
  {
    content: 'How to upload your episode.',
    target: '#excalibur-upload',
    placement: 'left'
  },

  { content: 'First connect your Wallet.', target: '#login-logout-btn', placement: 'right' },

  {
    content: 'Drag an image or click Browse, this will be your episode cover image.',
    target: '#upload-artwork-input',
    placement: 'right'
  },
  { content: 'Type the episode Tittle.', target: '#upload-title-input', placement: 'right' },
  { content: 'Type the episode Description.', target: '#upload-description-input', placement: 'right' },
  { content: 'Drag an audio or click Browse.', target: '#upload-audio-input', placement: 'right' },
  { content: 'You can add a new creator here or skip this ', target: '#upload-creator-add-btn', placement: 'right' },

  { content: 'Set Creator Name', target: '#upload-creator-name-0', placement: 'right' },
  { content: 'Confirm the Wallet Address.', target: '#upload-creator-wallet-0', placement: 'right' },
  {
    content: 'If more than one creator, select the revenue share for each one.',
    target: '#upload-creator-split-0',
    placement: 'right'
  },
  { content: 'Accept the Terms and Conditions.', target: '#upload-terms-checkbox', placement: 'right' },

  { content: 'Press publish.', target: '#upload-publish-btn', placement: 'right' }
] as Step[];

export function UploadPageForm(props: UploadPageFormProps) {
  const { onFormSubmit, shouldOpenWalletStateModal, setShowWalletStateModal, setSolanaCost } = props;
  const [validationError, setValidationError] = useState<MediaUploadValidation | null>(null);
  const [joyrideRunning, setJoyrideRunning] = useState<boolean>(false);

  const methods = useForm<MediaUploadFormData>({
    mode: 'onSubmit',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUseNativeValidation: false
  });

  const { handleSubmit } = methods;

  const interceptSetSolanaCost = (solanaCost: number) => {
    setSolanaCost(solanaCost);
  };

  const onSubmitValid = (data: MediaUploadFormData) => {
    const error = validateMediaUploadFormData(data);
    if (error) {
      setValidationError(error);
      toast.error(error.error);
    } else {
      setValidationError(null);
      onFormSubmit(data);
    }
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setJoyrideRunning(false);
    }
  };

  const renderJoyride = () => {
    if (joyrideRunning) {
      return (
        <Joyride
          callback={handleJoyrideCallback}
          run={joyrideRunning}
          continuous
          disableScrolling
          showProgress
          showSkipButton
          steps={UPLOAD_STEPS}
          styles={{
            options: {
              arrowColor: '#fff',
              backgroundColor: '#393B4D',
              beaconSize: 36,
              overlayColor: 'rgba(0, 0, 0, 0.5)',
              primaryColor: '#5F70FF',
              spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
              textColor: '#fff',
              width: 250,
              zIndex: 100
            }
          }}
        />
      );
    } else {
      return (
        <Button
          buttonType="default"
          ariaLabel="Start quick guide"
          text="Quick Guide"
          onClick={() => {
            setJoyrideRunning(true);
          }}
          type="button"
          className={`absolute right-4 top-12 hidden h-10 rounded-lg px-5 py-2 text-center text-sm uppercase md:right-4  md:top-4 md:flex`}
        />
      );
    }
  };

  return (
    <>
      {renderJoyride()}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <div className="relative flex flex-col items-center justify-center w-full h-full pb-40 mt-8 ">
            <div className="flex flex-col w-full gap-4 md:flex-row">
              <div className="flex mx-auto">
                <MediaThumbnailUploadField />
              </div>
              <div className="w-full gap-4 mx-auto space-y-4">
                <MediaNameField maxLength={MAX_TITLE_LENGTH} />
                <MediaDescriptionField maxLength={MAX_DESCRIPTION_LENGTH} />
              </div>
            </div>
            <MediaAudioUploadField />

            <div className="flex flex-col w-full">
              <MediaParameterForm />
              <MediaCreatorForm
                shouldOpenConnectDialog={shouldOpenWalletStateModal}
                onConnectDialog={setShowWalletStateModal}
              />
            </div>

            <Text className="mt-8 text-red-600" id={E2EID.uploadErrorMessage}>
              {validationError?.error ?? ''}
            </Text>
            <Text className="hidden" id={E2EID.uploadErrorType}>
              {validationError?.type ?? ''}
            </Text>

            <UploadCosts costChangeCallback={interceptSetSolanaCost} />

            <div className="flex flex-col gap-2 mt-8">
              <label htmlFor="TermsAndConditionCheckbox">
                <input required id={E2EID.uploadTermsCheckbox} className="mr-2" type="checkbox" />I agree to the{' '}
                <Link href="https://docs.excalibur.fm/docs/Terms">
                  <a className="underline text-buttonMuted hover:text-buttonAccentHover">Terms and Conditions</a>
                </Link>
              </label>
              <Button
                text="Publish"
                buttonType="default"
                id={E2EID.uploadPublishButton}
                className="w-full px-5 mx-auto"
                type="submit"
              />
            </div>
            {/* <div className="mb-[]" /> */}
          </div>
        </form>
      </FormProvider>
    </>
  );
}
