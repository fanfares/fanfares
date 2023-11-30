import { EditableDescriptionField } from 'src/views/components/EditableDescriptionField';
import { EditableNameField } from 'src/views/components/EditableNameField';
import { MediaThumbnailUploadField } from 'src/views/components/MediaThumbnailUploadField';
import { Text } from 'src/views/components/Text';

import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { Keypair, PublicKey } from '@solana/web3.js';
import { getTruncatedPublicKey } from '@utils';
import { saveAs } from 'file-saver';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import Media from 'react-media';
import { toast } from 'react-toastify';
import { SolanaAccountFetchState } from 'src/controllers/state/solana-state';
import { useAppState } from 'src/controllers/state/use-app-state';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { getFilenameFromTitle } from 'src/controllers/utils/file-helpers';
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from 'src/controllers/utils/nft-metadata';
import EditFreezeStatusModal from 'src/views/modals/EditFreezeStatusModal';
import EditPodcastModal from 'src/views/modals/EditPodcastModal';
import { contentfulLoader } from '../../../controllers/utils/image-loader';
import Chat from '../chat/Chat';
import EpisodeInformation from './EpisodeInformation';
import { EditMediaFormData } from './edit-media-validation';

interface PlayerPageContentProps {
  mediaKeyString: string;
}

function PlayerPageContent(props: PlayerPageContentProps) {
  const { mediaKeyString } = props;
  const [editModeOn, setEditModeOn] = useState(false);
  const [editPodcastModalOpen, setEditPodcastModalOpen] = useState(false);

  const [freezeStateModalOpen, setFreezeStateModalOpen] = useState<boolean>(false);

  const {
    publicKey,
    playerIsCreator,
    playerMediaState,
    playerMediaAccount,
    playerHasMinted,
    playerErrorMessage,
    playerCreatorAccount,
    playerTogglePlaying,
    playerAudioUrl,
    editARMedia,
    playerForceUpdate,
    playerGetIcon,
    mediaModalOpenDonate,
    mediaModalOpenMint,
    mediaModalOpenShare,
    playerMediaKey,
    playerSetMedia,
    playerDuration,
    playerSize
  } = useAppState();

  //Show more state
  const [showMore, setShowMore] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // ------------------ FUNCTIONS ------------------

  const downloadFile = async () => {
    const title = playerMediaAccount.name;

    if (!playerAudioUrl) return;
    if (!title) return;
    if (!playerAudioUrl) return;

    if (!playerHasMinted) {
      toast('You need to mint the NFT to download this content!');
      return;
    }

    if (downloading) {
      toast('Downloading...');
      return;
    }

    setDownloading(true);
    toast('Downloading...');

    fetch(playerAudioUrl)
      .then(res => {
        res
          .blob()
          .then(blob => {
            saveAs(blob, getFilenameFromTitle(title));
            toast.success('Downloaded!');
          })
          .finally(() => {
            setDownloading(false);
          });
      })
      .catch(e => {
        toast.error('Error downloading media');
        setDownloading(false);
      });
  };

  const setTextInputFeilds = useCallback(() => {
    if (playerMediaAccount.name) {
      setValue('name', playerMediaAccount.name);
    }
    if (playerMediaAccount.description) {
      setValue('description', playerMediaAccount.description);
    }
    // eslint-disable-next-line
  }, [playerMediaAccount]);

  const onEditEnd = (completed: boolean) => {
    if (completed) {
      setTimeout(playerForceUpdate, 3000);
      setEditModeOn(false);
    }
    setEditPodcastModalOpen(false);
  };

  const onSubmitValid = () => {
    setEditPodcastModalOpen(true);
  };

  const onSubmitInvalid = (errors: FieldErrors<EditMediaFormData>) => {
    console.log('Form Submit Errors', errors);
  };

  const methods = useForm<EditMediaFormData>({
    mode: 'onSubmit',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUseNativeValidation: true
  });
  const { handleSubmit, setValue, getValues } = methods;

  const stopEnterFromSubmittingTheForm = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  const editMediaMetadata = async () => {
    const { name, description, thumbnail } = getValues();

    editARMedia({
      mediaAccount: playerMediaAccount,
      userAccount: playerCreatorAccount,
      editMediaName: name,
      editMediaDescription: description,
      newArtworkFile: thumbnail,
      duration: playerDuration,
      size: playerSize
    });
  };

  useEffect(() => {
    if (!playerMediaKey || !mediaKeyString || playerMediaKey.toString() !== mediaKeyString) {
      playerSetMedia(mediaKeyString);
    }
  }, [mediaKeyString, playerSetMedia, playerMediaKey]);

  useEffect(() => {
    if (playerMediaAccount) {
      setTextInputFeilds();
    }
    // eslint-disable-next-line
  }, [setTextInputFeilds, playerMediaAccount, editModeOn]);

  // ------------ RENDERERS ---------------

  const renderFromState = () => {
    switch (playerMediaState) {
      case SolanaAccountFetchState.noKey:
        return renderNoKey();
      case SolanaAccountFetchState.fetching:
        return renderFetching();
      case SolanaAccountFetchState.fetched:
        return renderPlayerPage();
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
        <p>No Key Set...</p>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p>{playerErrorMessage}</p>
      </div>
    );
  };

  const renderDne = () => {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p>Media account does not exist</p>
      </div>
    );
  };

  const renderSmall = () => {
    //Small page view
    return (
      <div className="flex items-start w-full h-screen mb-40 ">
        <div className="flex flex-col items-center w-full px-2">
          {editModeOn ? (
            <div className="flex flex-col w-full gap-2">
              {renderLeftContent()}
              {renderPodcastTitle()}
            </div>
          ) : (
            <div className="flex w-full gap-2">
              {renderLeftContent()}
              <div className="w-full mt-8"> {renderPodcastTitle()}</div>
            </div>
          )}

          <div className="flex flex-col items-start w-full ">
            {renderActionMenu()}

            <div
              className={`mx-auto my-2 w-full max-w-md flex-col items-center justify-center rounded-lg bg-skin-fill/80 p-2 text-sm text-skin-muted
              
              ${playerMediaAccount?.description.length == 0 && !editModeOn ? 'hidden' : ''}
              

              `}>
              <div className="flex flex-row w-full">
                {' '}
                <button aria-label="Expand description" className="mr-2" type="button">
                  <FontAwesomeIcon aria-label="Expand description" icon={FAProSolid.faAlignLeft} />
                </button>{' '}
                <p className="space-x-2">Description</p>
              </div>

              {renderDescription()}
              <div className="flex">
                {' '}
                <button
                  aria-label="Hide/Show more description"
                  type="button"
                  onClick={() => setShowMore(!showMore)}
                  className={`ml-auto mt-2 text-xs font-thin ${editModeOn ? 'hidden' : ''}`}>
                  {showMore ? 'Hide...' : 'Show more...'}
                </button>
              </div>
            </div>
            <hr className="w-full mt-4 mb-4 border-buttonDisabled/40 " />
            {renderChat()}
          </div>
        </div>
      </div>
    );
  };

  const renderMedium = () => {
    //Medium page view
    return (
      <div className="flex items-center w-full h-full mb-40 md:mb-0 md:items-start">
        <div className="flex flex-col items-center w-full md:justify-start lg:flex-row lg:items-start ">
          <div className="flex w-full ">
            <div className="w-[264px]"> {renderLeftContent()}</div>
            <div className="flex flex-col w-full mb-4 ml-4 text-sm mt-7 text-skin-muted">
              {renderPodcastTitle()}{' '}
              <div className="flex flex-col max-w-sm p-2 rounded-lg bg-skin-fill/80">
                <div className="flex">
                  {' '}
                  <button className="mr-2" type="button">
                    <FontAwesomeIcon icon={FAProSolid.faAlignLeft} />
                  </button>
                  <p className="">Description</p>
                </div>
                {renderDescription()}
                <button
                  type="button"
                  onClick={() => setShowMore(!showMore)}
                  className={`ml-auto mt-2 text-xs font-thin ${editModeOn ? 'hidden' : ''}`}>
                  {showMore ? 'Hide...' : 'Show more...'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start w-full lg:ml-4">
            {renderActionMenu()}
            <hr className="w-full mt-8 mb-4 border-buttonDisabled/40 " />
            {renderChat()}
          </div>
        </div>
      </div>
    );
  };

  const renderLarge = () => {
    //Large page view

    return (
      <div className="flex items-start w-full h-full mb-0">
        <div className="flex flex-col items-start w-full max-w-5xl gap-4 ">
          <div className="flex flex-row">
            <div className="w-[264px]">{renderLeftContent()}</div>
            <div className="flex flex-col items-start w-full ml-4 ">
              <div className="flex flex-col w-full mb-4 text-sm text-skin-muted">
                {renderPodcastTitle()}
                <div
                  className={`w-full max-w-lg items-start rounded-lg bg-skin-fill/80 p-2 ${
                    playerMediaAccount?.description.length == 0 && !editModeOn ? 'hidden' : 'flex flex-col'
                  }`}>
                  <div className="flex">
                    {' '}
                    <button aria-label="Expand description" className="mr-2" type="button">
                      <FontAwesomeIcon icon={FAProSolid.faAlignLeft} />
                    </button>
                    <p className="">Description</p>
                  </div>
                  {renderDescription()}
                  <button
                    aria-label="Expand description"
                    type="button"
                    onClick={() => setShowMore(!showMore)}
                    className={`ml-auto mt-2 text-xs font-thin ${editModeOn ? 'hidden' : ''}`}>
                    {showMore ? 'Hide...' : 'Show more...'}
                  </button>
                </div>
              </div>

              {renderActionMenu()}
            </div>
          </div>
          <hr className="w-full mt-4 mb-4 border-buttonDisabled/40 " />
          {renderChat()}
        </div>
      </div>
    );
  };

  const renderPlayerPage = () => {
    return (
      <FormProvider {...methods}>
        <form onKeyDown={stopEnterFromSubmittingTheForm} onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}>
          <Media
            onChange={setTextInputFeilds}
            queries={{
              small: '(min-width: 264px) and (max-width: 767px)',
              medium: '(min-width: 768px) and (max-width: 1023px)',
              large: '(min-width: 1024px)'
            }}>
            {matches => (
              <div>
                <Fragment>{matches.large && renderLarge()}</Fragment>
                <Fragment>{matches.medium && renderMedium()}</Fragment>
                <Fragment>{matches.small && renderSmall()}</Fragment>
              </div>
            )}
          </Media>
        </form>
      </FormProvider>
    );
  };

  const renderThumbnail = () => {
    if (editModeOn) {
      return (
        <div className="relative h-40 w-40 md:h-[264px] md:w-[264px] ">
          <MediaThumbnailUploadField />
        </div>
      );
    }

    return (
      <div className="relative w-40 h-40">
        <Image
          loader={contentfulLoader}
          src={playerMediaAccount.thumbnailUri}
          alt={playerMediaAccount?.name ?? 'Creator'}
          layout="fill"
          className="rounded-2xl"
          objectFit={'cover'}
        />
        {/* <p>{url}</p> */}
      </div>
    );
  };

  const renderTitle = () => {
    const title = playerMediaAccount.name ?? getTruncatedPublicKey(playerMediaAccount.key ?? PublicKey.default);

    return (
      <div className="w-full mt-2 mr-4 text-sm font-bold text-md line-clamp-2 md:text-lg lg:mt-8 lg:text-2xl">
        {editModeOn ? (
          <>
            {' '}
            <EditableNameField
              aria-label="Episode title"
              maxLength={MAX_TITLE_LENGTH}
              isEditable={editModeOn}
              id={E2EID.playerTitleInput}
              className={`editable-input  h-8 resize-none `}
              currentValue={title}
            />
          </>
        ) : (
          <p id={E2EID.playerTitle} className="">
            {title}
          </p>
        )}
      </div>
    );
  };

  const renderDescription = () => {
    const description = playerMediaAccount?.description;

    if (editModeOn) {
      return (
        <div className="w-full">
          <EditableDescriptionField
            aria-label="Episode description edit field"
            maxLength={MAX_DESCRIPTION_LENGTH}
            isEditable={editModeOn}
            className="w-full h-full px-2 mr-4 overflow-scroll text-sm font-bold break-words align-top resize-none editable-input"
            id={E2EID.playerDescriptionInput}
          />
          <p id={E2EID.playerDescription} className="hidden">
            {description}
          </p>
        </div>
      );
    }

    return (
      <div className={`max-w-lg pr-4`}>
        <p id={E2EID.playerDescription} className={showMore ? 'break-words' : 'truncate'}>
          {description}
        </p>
      </div>
    );
  };
  // ${editModeOn ? 'w-[264px]' : 'w-40'}
  // add to render contentleft div if needed
  const renderLeftContent = () => {
    return (
      <div className="flex flex-col items-center justify-start mt-8 md:w-full ">
        <div
          className={`flex w-40 flex-col justify-around
        `}>
          {renderThumbnail()}
          {editModeOn ? '' : <EpisodeInformation mediaAccount={playerMediaAccount} />}
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

  const renderEditButton = () => {
    if (editModeOn) {
      return (
        <div className="flex gap-2 top-20">
          <button
            id="e2e-submit-edit-button"
            type="submit"
            onClick={() => setEditPodcastModalOpen(!editPodcastModalOpen)}
            className="items-center w-8 h-8 rounded bg-skin-fill text-skin-muted hover:bg-skin-fill/40 hover:text-buttonAccentHover active:bg-white">
            <FontAwesomeIcon icon={FAProSolid.faCheck} />
          </button>
          <button
            aria-label="Freeze/Unfreeze minting"
            type="button"
            onClick={() => {
              setFreezeStateModalOpen(true);
            }}
            className="items-center w-8 h-8 rounded bg-skin-fill text-skin-muted hover:bg-skin-fill/40 hover:text-buttonAccentHover active:bg-white">
            <FontAwesomeIcon icon={playerMediaAccount.isMintingFrozen ? FAProSolid.faFire : FAProSolid.faSnowflake} />
          </button>
          <button
            type="button"
            id="e2e-close-edit-mode-button-2"
            onClick={turnEditModeOff}
            className="w-8 h-8 text-red-500 rounded bg-skin-fill hover:bg-skin-fill/40 hover:text-red-900 active:bg-white">
            <FontAwesomeIcon icon={FAProSolid.faClose} />
          </button>
        </div>
      );
    }

    if (playerIsCreator) {
      return (
        <button
          aria-label="Edit episode"
          type="button"
          id="e2e-enter-edit-mode-button"
          className="w-8 h-8 px-4 btn"
          onClick={turnEditModeOn}>
          <FontAwesomeIcon icon={FAProSolid.faPen} />
        </button>
      );
    }

    return null;
  };

  const renderPodcastTitle = () => {
    return (
      <div className="relative w-full">
        <div className="flex items-end justify-between w-full space-x-2">
          {renderTitle()}
          {playerIsCreator ? renderEditButton() : null}
        </div>
        <div className="flex flex-row items-center justify-start my-4 space-x-2 text-skin-muted lg:my-4">
          <FontAwesomeIcon icon={FAProSolid.faUser} />
          <Link href={'/creator/' + playerMediaAccount?.originalOwner.toString() ?? 'owner'}>
            <a className="text-sm font-bold hover:underline md:block">
              {playerCreatorAccount?.name ?? getTruncatedPublicKey(playerCreatorAccount.key ?? PublicKey.default)}
            </a>
          </Link>
        </div>
      </div>
    );
  };

  const renderPlayButton = () => {
    return (
      <div className="w-full">
        <button aria-label="Play episode" type="button" id={E2EID.playerPlayButton} onClick={playerTogglePlaying}>
          <FontAwesomeIcon
            className="mr-2 text-6xl transition-all hover:text-buttonAccentHover md:text-7xl "
            icon={playerGetIcon()}
          />
        </button>
      </div>
    );
  };

  const renderDonationStats = () => {
    return (
      <div
        id="e2e-donations-tooltip-area"
        className={`relative mx-2 hidden ${
          playerMediaAccount?.originalOwner ? 'flex' : 'hidden'
        } flex-col items-center text-left text-skin-muted md:mx-8`}>
        <Text id="donation-count" className="text-xs font-bold ">
          {playerMediaAccount.uniqueDonation}
        </Text>
        <Text className="text-[0.5rem] ">donations</Text>
      </div>
    );
  };

  const renderDownloadButton = () => {
    const title = playerMediaAccount.name;

    if (!playerAudioUrl) return null;
    if (!title) return null;

    return (
      <button onClick={downloadFile} type="button">
        <FontAwesomeIcon
          className={`text-lg ${playerHasMinted ? '' : 'opacity-60'} ${downloading ? 'animate-pulse' : ''}`}
          icon={FAProSolid.faDownload}
        />
      </button>
    );
  };

  const renderActionMenu = () => {
    return (
      <>
        <div className="mx-auto mt-2 flex w-full justify-evenly md:mt-4 md:items-start md:justify-center lg:mx-0 lg:mt-0 lg:items-center">
          <div className="flex items-center justify-center ">
            {renderPlayButton()}
            {renderDonationStats()}
          </div>
          <div className="flex flex-row items-center justify-center gap-2 my-auto md:gap-2">
            <div className="flex items-center gap-2">
              <button
                aria-label="Make a donation"
                id={E2EID.playerDonateButton}
                type="button"
                className="btn px-2 text-[12px] md:px-4 md:text-xs "
                onClick={mediaModalOpenDonate}>
                Contribute
              </button>
              <div className="relative ">
                <button
                  aria-label="Mint Audio NFT"
                  disabled={playerMediaAccount.isMintingFrozen || playerHasMinted}
                  id={E2EID.playerMintButton}
                  type="button"
                  className={`btn px-2 text-[12px] md:px-4 md:text-xs ${
                    playerMediaAccount.isMintingFrozen && !playerHasMinted ? 'line-through' : ''
                  }`}
                  onClick={mediaModalOpenMint}>
                  {playerMediaAccount.isMintingFrozen ? '❄️ ' : ''}
                  {playerHasMinted ? 'Already Minted!' : 'Mint Audio NFT'}
                  {playerMediaAccount.isMintingFrozen ? ' ❄️' : ''}
                </button>
              </div>
              <button
                aria-label="Share episode on Socials"
                id={E2EID.playerShareButton}
                type="button"
                className="btn px-2 text-[12px] md:px-4 md:text-xs"
                onClick={mediaModalOpenShare}>
                Share
              </button>
              {renderDownloadButton()}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderChat = () => {
    if (!playerMediaAccount) return null;

    const creatorWallets = [];

    creatorWallets.push(playerMediaAccount.originalOwner);
    creatorWallets.push(playerMediaAccount.workerDistributions.map(worker => worker.wallet));
    //TODO get original media's workers

    return (
      <div className="w-full">
        <Chat
          mediaKey={playerMediaAccount.key}
          creatorWallets={creatorWallets}
          hasMinted={playerHasMinted}
          poster={publicKey ?? Keypair.generate().publicKey}
        />
      </div>
    );
  };

  return (
    <div className="">
      <h1 className="mt-12 text-xl font-black text-center text-gray-100 uppercase font-font1 md:mt-4 md:text-start md:text-4xl">
        Excalibur Player
      </h1>
      <EditFreezeStatusModal isOpen={freezeStateModalOpen} onClose={() => setFreezeStateModalOpen(false)} />
      <EditPodcastModal isOpen={editPodcastModalOpen} onClose={onEditEnd} onConfirm={editMediaMetadata} />
      {renderFromState()}
    </div>
  );
}

export default PlayerPageContent;
