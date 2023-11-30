import Button from '@components/Button';
import { EditableDescriptionField } from '@components/EditableDescriptionField';
import Popover from '@components/ToolTip';
import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { PublicKey } from '@solana/web3.js';
import { getConfig } from '@utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { EditARCreatorState } from 'src/controllers/state/create-edit-ar-creator-slice';
import { SolanaAccountFetchState } from 'src/controllers/state/solana-state';
import { useAppState } from 'src/controllers/state/use-app-state';
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from 'src/controllers/utils/nft-metadata';
import { EditableNameField } from 'src/views/components/EditableNameField';
import LoginLogoutButton from 'src/views/components/LoginLogoutButton';
import { MediaThumbnailUploadField } from 'src/views/components/MediaThumbnailUploadField';
import { Text } from 'src/views/components/Text';
import EditChannelModal from 'src/views/modals/EditChannelModal';
import { contentfulLoader } from '../../../controllers/utils/image-loader';
import LazyLoad from '../../components/LazyLoad';
import { MediaListItem } from './MediaListItem';
import MediaLoading from './MediaLoading';

export interface EditCreatorFormData {
  name: string;
  description: string;
  thumbnail: File | null;
}

interface CreatorPageContentProps {
  creatorKeyString: string;
}

function CreatorChannelPageContent(props: CreatorPageContentProps) {
  const { creatorKeyString } = props;
  const defaultCreatorThumbnailUrl = getConfig().defaultCreatorThumbnailUrl;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editModeOn, setEditModeOn] = useState(false);
  const [artworkUrl, setArtowrkUrl] = useState<string>(defaultCreatorThumbnailUrl);

  const {
    publicKey,
    editARCreator,
    editARCreatorState,
    editARCreatorClear,
    creatorChannelErrorMessage,
    creatorChannelKey,
    creatorChannelAccount,
    creatorChannelLoadingState,
    creatorChannelGetEpisodeIndexes,
    creatorChannelForceUpdate,
    creatorChannelSetCreator
  } = useAppState();

  const isOwner = publicKey?.toString() === creatorChannelKey?.toString();

  useEffect(() => {
    creatorChannelSetCreator(creatorKeyString);
  }, [creatorKeyString, creatorChannelSetCreator]);

  useEffect(() => {
    if (creatorChannelAccount && creatorChannelAccount.thumbnailUri) {
      setArtowrkUrl(creatorChannelAccount.thumbnailUri + '?t=' + Date.now().toString());
    }
    // eslint-disable-next-line
  }, [creatorChannelAccount]);

  useEffect(() => {
    if (editARCreatorState === EditARCreatorState.done) {
      setArtowrkUrl(creatorChannelAccount.thumbnailUri + '?t=' + Date.now().toString());
      setEditModeOn(false);
    }
    // eslint-disable-next-line
  }, [setEditModeOn, editARCreatorState]);

  useEffect(() => {
    if (!showEditModal) {
      editARCreatorClear();
    }
  }, [editARCreatorClear, showEditModal]);

  // -------------- FORM VALIDATION -------------------

  const onEditEnd = (completed: boolean) => {
    if (completed) {
      creatorChannelForceUpdate();
      setTimeout(creatorChannelForceUpdate, 3000);
      setEditModeOn(false);
    }
    setShowEditModal(false);
  };

  const onSubmitValid = () => {
    setShowEditModal(true);
  };

  const onSubmitInvalid = (errors: FieldErrors<EditCreatorFormData>) => {
    console.log(errors);
  };

  const editCreator = async () => {
    const { name, description, thumbnail } = getValues();
    await editARCreator({
      userAccount: creatorChannelAccount,
      editCreatorName: name,
      editCreatorDescription: description,
      newArtworkFile: thumbnail
    });
  };

  const methods = useForm<EditCreatorFormData>({
    mode: 'onSubmit',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUseNativeValidation: true
  });
  const { handleSubmit, setValue, getValues } = methods;

  useEffect(() => {
    if (creatorChannelAccount) {
      setValue('name', creatorChannelAccount.name);
      setValue('description', creatorChannelAccount.description);
    }
  }, [setValue, creatorChannelAccount, editModeOn]);

  // -------------- RENDERERS -------------------
  const renderFromState = () => {
    switch (creatorChannelLoadingState) {
      case SolanaAccountFetchState.noKey:
        return renderNoKey();
      case SolanaAccountFetchState.fetching:
        return renderFetching();
      case SolanaAccountFetchState.fetched:
        return renderFetched();
      case SolanaAccountFetchState.dne:
        return renderDne();
      case SolanaAccountFetchState.error:
        return renderError();
    }
  };

  const renderFetching = () => {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <svg className="... mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24"></svg>
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  };

  const renderNoKey = () => {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <LoginLogoutButton />
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p>{creatorChannelErrorMessage}</p>
      </div>
    );
  };

  const renderDne = () => {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p>Upload some audio to create an account!</p>
      </div>
    );
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`https://excalibur.fm/rss/${creatorChannelKey}`);
    toast.success('Copied to clipboard!', {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  };

  const renderFetched = () => {
    return (
      <div className="mt-8 ">
        {renderTopContent()}
        <div className="mt-4 overflow-y-auto md:mt-auto">
          <div className="flex items-center justify-between w-full">
            <p className="font-bold text-skin-inverted md:my-8">Creations</p>
            <Button
              buttonType="default"
              className="flex items-center"
              text="RSS"
              onClick={copyToClipboard}
              icon={<FontAwesomeIcon icon={FAProSolid.faRss} className="mb-1 text-base text-skin-muted" />}
            />
          </div>
          <hr className="mx-auto mt-2 w-[95%] border-buttonDisabled" />

          {renderAllMedia()}
        </div>
      </div>
    );
  };

  const turnEditModeOn = () => {
    setEditModeOn(true);
  };

  const turnEditModeOff = () => {
    setEditModeOn(false);
  };

  const renderEditComponents = () => {
    if (editModeOn) {
      return (
        <div className="absolute right-0 flex gap-2">
          <Button
            buttonType="default"
            id="e2e-submit-creator-edit"
            icon={<FontAwesomeIcon icon={FAProSolid.faCheck} />}
            type="submit"
            className="w-4 h-8 rounded text-skin-muted "
          />

          <Button
            buttonType="cancel"
            type="button"
            icon={<FontAwesomeIcon icon={FAProSolid.faClose} />}
            onClick={turnEditModeOff}
            className="w-4 h-8 text-red-500 rounded hover:text-red-900"
          />
        </div>
      );
    }

    if (isOwner) {
      return (
        <Button
          icon={<FontAwesomeIcon icon={FAProSolid.faPen} />}
          type="button"
          id="e2e-edit-creator-metadata-button"
          className="absolute right-0 w-4 h-8 "
          onClick={turnEditModeOn}
        />
      );
    }

    return null;
  };

  const renderThumbnail = () => {
    if (editModeOn) {
      return <MediaThumbnailUploadField />;
    }

    return (
      <div className="h-[264px] w-[264px]">
        <Image
          loader={contentfulLoader}
          src={artworkUrl}
          alt={creatorChannelAccount.name}
          layout="fill"
          className="rounded-2xl"
          objectFit={'cover'}
        />
      </div>
    );
  };

  const renderName = () => {
    return (
      <div className="flex items-center justify-between w-full ">
        <EditableNameField isEditable={editModeOn} id="e2e-creator-name" maxLength={MAX_TITLE_LENGTH} />
        <div className="mr-16">
          {' '}
          <Popover
            className="w-64 text-xs text-center md:text-sm"
            text="This is the name of your channel. It will be displayed on your channel page and in the RSS feed."
          />
        </div>
      </div>
    );
  };

  const renderDescription = () => {
    if (editModeOn) {
      return (
        <EditableDescriptionField
          maxLength={MAX_DESCRIPTION_LENGTH}
          isEditable={editModeOn}
          id="e2e-creator-description-input"
          className="flex w-full h-full p-2 mt-4 font-thin break-words resize-none editable-input overflow-x-clip text-start"
        />

        // <textarea
        //   aria-label="Episode description edit field"
        //   className={
        //     'editable-input p-2 mt-4 flex h-full w-full resize-none  overflow-x-clip break-words text-start font-thin '
        //   }
        //   name="description"
        //   maxLength={3000}
        // />
      );
    }
    return (
      <Text id="e2e-creator-description" className="block p-2 mt-4 font-thin w-fit ">
        {creatorChannelAccount.description}
      </Text>
    );
  };

  const renderTopContent = () => {
    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}>
          <div className="flex flex-col items-center justify-center w-full px-2 mx-auto lg:mx-0 lg:items-start lg:justify-start">
            <div className="flex flex-col items-center w-full lg:flex-row ">
              <div className="relative flex justify-center mx-auto lg:mr-4"> {renderThumbnail()}</div>
              <div className="flex flex-col items-center justify-center w-full mt-4 mb-auto lg:mt-0">
                <div className="flex justify-center w-full">
                  <div className="relative flex flex-col w-full">
                    {renderName()}
                    {renderEditComponents()}
                    <div>{renderDescription()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    );
  };

  const renderAllMedia = () => {
    return (
      <div className="relative flex flex-col w-full mb-20">
        {creatorChannelGetEpisodeIndexes()
          .reverse()
          .map(index => {
            return (
              <div key={index}>
                {renderMedia(creatorChannelKey, index)}
                <hr className="mx-auto w-[95%] border-buttonDisabled" />
              </div>
            );
          })}
      </div>
    );
  };

  const renderMedia = (owner: PublicKey, index: number) => {
    return (
      <LazyLoad placeholder={<MediaLoading />}>
        <MediaListItem index={index} creatorKey={owner} isEditable={isOwner} />
      </LazyLoad>
    );
  };

  return (
    <>
      <h1 className="mt-12 text-xl font-black text-center text-gray-100 uppercase font-font1 md:mt-4 md:text-start md:text-4xl">
        Excalibur Creator
      </h1>
      <EditChannelModal isOpen={showEditModal} onClose={onEditEnd} onConfirm={editCreator} />

      {renderFromState()}
    </>
  );
}

export default CreatorChannelPageContent;
