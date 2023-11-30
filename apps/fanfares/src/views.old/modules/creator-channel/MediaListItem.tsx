import Popover from '@components/ToolTip';
import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { PublicKey } from '@solana/web3.js';
import { getConfig, removeSpaces } from '@utils';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DrmMediaAccount } from 'src/controllers/drm-api';
import { Episode } from 'src/controllers/state/create-creator-channel-slice';
import { useAppState } from 'src/controllers/state/use-app-state';
import { Text } from 'src/views/components/Text';
import BurnMediaModal from 'src/views/modals/BurnMediaModal';
import { contentfulLoader } from '../../../controllers/utils/image-loader';

export interface MediaListItemProps {
  index: number;
  creatorKey: PublicKey;
  isEditable?: boolean;
}

export function MediaListItem({ index, creatorKey, isEditable }: MediaListItemProps) {
  const { creatorChannelGetEpisode } = useAppState();
  const { drmApi } = useAppState();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [badMediaAccount, setBadMediaAccount] = useState<DrmMediaAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');
  const [burned, setBurned] = useState<boolean>(false);
  const { defaultMediaThumbnailUrl, playedThreshold } = getConfig();
  const [burnModalShowing, setBurnModalShowing] = useState<boolean>(false);

  useEffect(() => {
    setBurnModalShowing(false);
    setIsLoading(true);
    setLoadingMessage('Loading...');
    creatorChannelGetEpisode(index)
      .then(episode => {
        setIsLoading(false);
        setEpisode(episode);
      })
      .catch(err => {
        fetchBadAccount();
        console.log('Failed to load episode,', err);
      });
    /* eslint-disable-next-line */
  }, [index, creatorKey, creatorChannelGetEpisode]);

  const fetchBadAccount = () => {
    drmApi
      .fetchMediaAccountByOwnerAndIndex(creatorKey, index)
      .then(setBadMediaAccount)
      .catch(e => {
        console.log('Failed to load bad media account, ', e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const burnEpisode = () => {
    setBurnModalShowing(true);
  };

  const renderFromState = () => {
    if (isLoading) {
      return renderLoading();
    } else if (burned) {
      return null;
    } else if (badMediaAccount) {
      return renderBadAccount();
    } else if (episode) {
      return renderContent();
    }

    return null;
  };

  const renderLoading = () => {
    return (
      <div className="cursor-pointer hover:bg-buttonAccentHover/20">
        {/* <audio ref={media} src={mediaUrl ?? fallbackAudio} preload="episode"></audio> */}
        <hr className="w-full border-buttonDisabled" />
        <div className="relative flex flex-col w-full ">
          <div className="flex items-center justify-center my-4">
            <div className="relative left-2 w-[100px]">
              <Image
                loader={contentfulLoader}
                src={defaultMediaThumbnailUrl}
                alt={'LOADING'}
                layout="fixed"
                width={100}
                height={100}
                objectFit="contain"
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col w-full my-auto ml-4"></div>
            <div className="flex flex-row items-start justify-between ml-4 gap-x-4">
              <div className="flex flex-col items-center justify-center my-auto gap-y-1">{loadingMessage}</div>

              <div className="flex flex-col items-end w-20 my-auto mr-2 text-xs text-right "></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // const renderDuration = () => {
  //   return <Text>{episode.duration}</Text>;
  // };

  const [isOwner] = useState(true);
  const editMode = isOwner ? '' : 'hidden';

  const date = episode?.creationDate ? moment(episode.creationDate).format('DD MMM YY') : null;

  const renderEditButton = () => {
    return isEditable ? (
      <Link
        href={'/player/' + episode.key}
        className={`text-skin-default h-8 w-8 rounded bg-skin-fill hover:bg-skin-fill/40 ${editMode}`}>
        <FontAwesomeIcon className="p-2 mt-2 text-black bg-white rounded-full" icon={FAProSolid.faPen} />
      </Link>
    ) : null;
  };

  // eslint-disable-next-line
  const renderDeleteButton = () => {
    if (!isEditable) return null;

    if (episode.uniqueDonation !== 0) return null;

    return (
      <button
        disabled={episode.uniqueDonation !== 0}
        onClick={burnEpisode}
        className={`e2e-burn-media-button h-8 w-8 rounded-full bg-white text-red-500 hover:text-red-900 ${editMode}`}>
        <FontAwesomeIcon icon={FAProSolid.faTrashCanXmark} />
      </button>
    );
  };

  const renderBadAccount = () => {
    return (
      <div className="cursor-pointer hover:bg-buttonAccentHover/20">
        {/* <audio ref={media} src={mediaUrl ?? fallbackAudio} preload="episode"></audio> */}
        <hr className="w-full border-buttonDisabled" />
        <div className="relative flex flex-col w-full ">
          <div className="flex items-center justify-center my-4">
            <div className=" relative left-2 w-[100px]">
              <Image
                loader={contentfulLoader}
                src={defaultMediaThumbnailUrl}
                alt={'BAD ACCOUNT'}
                layout="responsive"
                width={100}
                height={100}
                objectFit={'cover'}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col w-full my-auto ml-4">
              <>
                <a id={removeSpaces(episode.name)} className="text-sm font-bold line-clamp-1">
                  This is an unused media account
                </a>
                <Text id={removeSpaces(episode.name) + '-description'} className="mt-2 text-sm font-thin line-clamp-3">
                  Click on the trash can to reclaim you Solana!
                </Text>
              </>
            </div>
            <div className="flex flex-row items-start justify-between ml-4 gap-x-4">
              <div className="flex flex-col items-center justify-center my-auto gap-y-1">{renderDeleteButton()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCreatorInfo = () => {
    // Comment out this line to test
    // if (!isOwner) return null;
    if (!episode) return null;

    return (
      <div>
        <div className="flex flex-row gap-4 ml-2">
          <div className="flex flex-row items-center gap-2 px-4 py-1 text-base font-bold text-white bg-skin-fill rounded-xl">
            <Popover
              iconTrigger={FAProSolid.faPlay}
              text={`The amount of Plays for this media. A Play is counted when ${(playedThreshold * 100).toFixed(
                0
              )}% of the media is listened to.`}
              className="w-40 text-center"
              iconClassName="text-buttonAccentHover"
            />
            {/* <FontAwesomeIcon icon={} /> */}
            {episode.plays}
          </div>
          <div className="flex flex-row items-center gap-2 px-4 py-1 text-base font-bold text-white bg-skin-fill rounded-xl ">
            <Popover
              iconTrigger={FAProSolid.faCoin}
              text="Total amount of Solana donated ( Number of NFTs minted )"
              className="text-center w-44"
              iconClassName="text-buttonAccentHover"
            />
            {/* <FontAwesomeIcon icon={FAProSolid.faCoin} /> */}
            {episode.solDonated} ( {episode.uniqueDonation} )
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="relative">
        <div className="absolute z-10 flex flex-col items-center justify-center ml-auto -translate-y-8 cursor-pointer right-5 top-8 gap-y-1">
          {renderEditButton()}
          {/* This functionality will be moved to player page */}
          {renderDeleteButton()}
        </div>
        <BurnMediaModal
          episodeNumber={index}
          isOpen={burnModalShowing}
          setIsOpen={setBurnModalShowing}
          callback={setBurned}
        />
        {/* <Link href={'/player/' + episode.key?.toString() ?? 'demo'}> */}
        <Link href={'/player/' + episode.key?.toString() ?? 'demo'}>
          <div className="flex flex-col w-full gap-2 p-2 cursor-pointer h-fit md:rounded-lg md:hover:bg-buttonAccentHover/20">
            {/* <audio ref={media} src={mediaUrl ?? fallbackAudio} preload="episode"></audio> */}
            <div className="relative flex flex-row items-center w-full ">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={episode?.thumbnail ?? defaultMediaThumbnailUrl}
                alt={episode?.name ?? 'LOADING'}
                className="object-cover w-10 h-10 rounded md:rounded-xl"
              />
              <div className="flex flex-col ml-2">
                {' '}
                <Text className="text-base font-bold text-skin-inverted">#{index.toString().padStart(3, '0')}</Text>
                <Text className="w-full text-skin-inverted">{date}</Text>
              </div>
              {renderCreatorInfo()}
            </div>
            <a id={removeSpaces(episode.name)} className="text-sm font-bold e2e-media-list-item line-clamp-1">
              {episode?.name ?? 'LOADING'}
            </a>
            <Text
              id={removeSpaces(episode.name) + '-description'}
              className="w-full text-sm font-thin overflow-ellipsis line-clamp-2">
              {episode?.description ?? 'LOADING'}
            </Text>

            {/* <div className="relative flex flex-col w-full gap-2 ">
              <div className="flex items-center">
                <div className="flex flex-row items-start justify-between ml-4 gap-x-4">
                  <div className="flex flex-col items-end w-20 my-auto mr-2 text-xs text-right ">
                    {renderDuration()}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </Link>
      </div>
    );
  };

  return renderFromState();
}
