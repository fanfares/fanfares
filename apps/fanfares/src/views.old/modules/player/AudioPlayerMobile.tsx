import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { Menu } from '@headlessui/react';
import { PublicKey } from '@solana/web3.js';
import { getTruncatedPublicKey } from '@utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Media from 'react-media';
import { useAppState } from 'src/controllers/state/use-app-state';
import { contentfulLoader } from '../../../controllers/utils/image-loader';

export function AudioPlayer() {
  const router = useRouter();

  const {
    playerUpdateSizeAndDuration,
    playerMediaKey,
    playerMediaAccount,
    playerHasMinted,
    playerCreatorAccount,
    playerAudioUrl,
    playerThumbnailUrl,
    playerIsPlaying,
    playerTogglePlaying,
    playerIsGlobalPlayerShowing,
    playerShowGlobalPlayer,
    playerHideGlobalPlayer,
    playerIsLoading,
    playerGetIcon,
    mediaModalOpenDonate,
    mediaModalOpenMint,
    mediaModalOpenShare
  } = useAppState();

  const [volume, setVolume] = useState<number>(80);

  const title = playerMediaAccount?.name ?? getTruncatedPublicKey(playerMediaAccount.key ?? PublicKey.default);
  const creatorName =
    playerCreatorAccount?.name ?? getTruncatedPublicKey(playerCreatorAccount.key ?? PublicKey.default);
  const isMintingFrozen = playerMediaAccount.isMintingFrozen;

  const backToPlayer = async () => {
    await router.push(`/player/${playerMediaKey.toString()}`);
  };

  const toggleShowing = () => {
    if (playerIsGlobalPlayerShowing) {
      playerHideGlobalPlayer();
    } else {
      playerShowGlobalPlayer();
    }
  };

  //--------------- STATES ------------------
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // --------------- REFERENCES---------------
  const audioPlayer = useRef<HTMLAudioElement>();
  const audioBar = useRef<HTMLInputElement>();
  const progressBar = useRef<HTMLInputElement>();
  const animationRef = useRef<number>();

  //--------------- FUNCTIONS ---------------

  useEffect(() => {
    // Corss Origin is needed for Arweave to resolve
    audioPlayer.current.crossOrigin = 'anonymous';
    audioPlayer.current.onloadeddata = onLoad;

    // eslint-disable-next-line
  }, [playerAudioUrl]);

  const calculateTime = (secs: number) => {
    if (isNaN(secs)) secs = 0;
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const changePlayerCurrentTime = useCallback(() => {
    progressBar.current.style.setProperty(
      '--seek-before-width',
      `${(Number(progressBar.current.value) / duration) * 100}%`
    );
    setCurrentTime(Number.parseInt(progressBar.current.value));
    // eslint-disable-next-line
  }, [duration, setCurrentTime]);

  const whilePlaying = useCallback(() => {
    if (audioPlayer.current) {
      progressBar.current.value = audioPlayer.current.currentTime.toString();
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    // eslint-disable-next-line
  }, [changePlayerCurrentTime]);

  const onLoad = useCallback(async () => {
    let rawDuration = audioPlayer.current.duration;
    if (isNaN(rawDuration)) rawDuration = 0;

    playerUpdateSizeAndDuration(rawDuration);
    const seconds = Math.floor(rawDuration);
    setDuration(seconds);
    progressBar.current.max = seconds.toString();
    if (playerIsPlaying) play();
    // eslint-disable-next-line
  }, [playerAudioUrl]);

  const play = useCallback(async () => {
    await audioPlayer.current.play();
    animationRef.current = requestAnimationFrame(whilePlaying);
    // eslint-disable-next-line
  }, [audioPlayer, animationRef, whilePlaying]);

  const pause = useCallback(() => {
    if (audioPlayer.current) {
      audioPlayer.current.pause();
    } // cancelAnimationFrame(animationRef.current);
    // eslint-disable-next-line
  }, []);

  // if (router.pathname === '/') {
  //   playerHideGlobalPlayer();
  //   pause();
  // }

  const changeRange = () => {
    audioPlayer.current.currentTime = Number.parseInt(progressBar.current.value);
    changePlayerCurrentTime();
  };

  const changeVolume = e => {
    audioPlayer.current.volume = Number.parseInt(audioBar.current.value) / 100;
    setVolume(Number(e.target.value));
  };

  const back15 = () => {
    progressBar.current.value = Math.max(Number(progressBar.current.value) - 15, 0).toString();
    changeRange();
  };

  const forward15 = () => {
    progressBar.current.value = Math.min(Number(progressBar.current.value) + 15, duration).toString();
    changeRange();
  };

  useEffect(() => {
    if (playerIsLoading) {
      pause();
      return;
    }
    if (playerIsPlaying) {
      play();
    } else {
      pause();
    }
  }, [pause, play, playerIsPlaying, playerIsLoading]);

  //--------------- RENDERERS ---------------

  const renderPodcastInfo = () => {
    return (
      <>
        <div className="absolute left-16 top-4 max-w-[268px] md:top-3 md:max-w-md">
          <p className="truncate text-sm font-bold text-skin-base md:w-full md:text-base">{title}</p>
          <Link className="" href={'/creator/' + playerCreatorAccount.creatorKey.toString() ?? 'owner'}>
            <a className="mt-1 flex w-40 truncate text-[0.7rem] text-skin-muted hover:underline md:w-64 md:text-[1rem] md:text-xs">
              {creatorName}
            </a>
          </Link>
        </div>
      </>
    );
  };

  const renderPodcastPFP = () => {
    return (
      <>
        <div className="absolute left-2 top-6 ">
          <Image
            loader={contentfulLoader}
            src={playerThumbnailUrl}
            alt=""
            width={50}
            height={50}
            className="rounded-full"
            layout={'intrinsic'}
          />
        </div>
      </>
    );
  };

  const renderProgressBar = () => {
    return (
      <>
        <div className="absolute bottom-2 left-2 flex w-[90%] items-center justify-center gap-x-2">
          <p className="text-xs text-skin-muted">{calculateTime(currentTime)}</p>
          <input
            aria-label="Player progress bar"
            type="range"
            className="progressBar w-full "
            defaultValue="0"
            ref={progressBar}
            onChange={changeRange}
          />
          <p className="text-xs text-skin-muted">{calculateTime(duration)}</p>
        </div>
      </>
    );
  };

  const renderBackToPlayerMenuItem = () => {
    if (!backToPlayer) return null;
    return (
      <Menu.Item>
        {() => (
          <>
            <button
              onClick={backToPlayer}
              className="flex rounded-t-lg bg-black px-4 py-3 text-sm text-white hover:bg-skin-button-accent-hover active:bg-violet-300 active:text-black">
              Back to Player
            </button>
            <hr className="mx-auto mt-[-1px] w-[80%] border-buttonDisabled"></hr>
          </>
        )}
      </Menu.Item>
    );
  };

  const renderDonateMenuItem = () => {
    return (
      <Menu.Item>
        {() => (
          <>
            <button
              aria-label="Make a donation"
              onClick={mediaModalOpenDonate}
              className={`flex bg-black px-4 py-3 text-sm text-white hover:bg-skin-button-accent-hover active:bg-violet-300 active:text-black ${
                !backToPlayer ? ' rounded-t-lg' : ''
              }`}>
              Contribute
            </button>
            <hr className="mx-auto mt-[-1px] w-[80%] border-buttonDisabled"></hr>
          </>
        )}
      </Menu.Item>
    );
  };

  const renderMintMenuItem = () => {
    const disabled = isMintingFrozen || playerHasMinted;
    return (
      <Menu.Item>
        {() => (
          <>
            <button
              aria-label="Mint Audio NFT"
              disabled={disabled}
              onClick={mediaModalOpenMint}
              className={`flex bg-black px-4 py-3 text-sm text-white hover:bg-skin-button-accent-hover active:bg-violet-300 active:text-black ${
                isMintingFrozen && !playerHasMinted ? 'line-through' : ''
              } ${disabled ? 'opacity-50' : ''}`}>
              {isMintingFrozen ? '❄️ ' : ''}
              {playerHasMinted ? 'Already Minted ⭐️' : 'Mint Audio NFT'}
              {isMintingFrozen ? ' ❄️' : ''}
            </button>
            <hr className="mx-auto mt-[-1px] w-[80%] border-buttonDisabled"></hr>
          </>
        )}
      </Menu.Item>
    );
  };

  const renderShareMenuItem = () => {
    return (
      <Menu.Item>
        {() => (
          <button
            aria-label="Share episode on Socials"
            onClick={mediaModalOpenShare}
            className="flex rounded-b-lg bg-black px-4 py-3 text-sm text-white hover:bg-skin-button-accent-hover active:bg-violet-300 active:text-black">
            Share
          </button>
        )}
      </Menu.Item>
    );
  };

  const renderActionMenu = () => {
    return (
      <Menu>
        <Menu.Button aria-label="Open Menu">
          <FontAwesomeIcon
            className="h-4 w-4 rounded bg-skin-button-accent p-1 hover:bg-skin-button-accent-hover hover:text-buttonAccent"
            icon={FAProSolid.faEllipsisH}
          />
        </Menu.Button>
        <Menu.Items
          aria-label="Select one option"
          className="absolute bottom-20 right-0 z-50 flex w-36 flex-col font-bold">
          {renderBackToPlayerMenuItem()}
          {renderDonateMenuItem()}
          {renderMintMenuItem()}
          {renderShareMenuItem()}
        </Menu.Items>
      </Menu>
    );
  };

  const renderVolumeMenu = () => {
    return (
      <Menu>
        <Menu.Button aria-label="Adjust volume">
          <FontAwesomeIcon
            className="h-4 w-4 rounded bg-skin-button-accent p-1 hover:bg-skin-button-accent-hover hover:text-buttonAccent"
            icon={FAProSolid.faVolume}
          />
        </Menu.Button>
        <Menu.Items className="absolute bottom-[90px] left-[-59px] flex h-10 w-36 rotate-[270deg] flex-col items-center justify-center rounded-l-md bg-black py-2 font-bold">
          <Menu.Item aria-label="Volume bar">
            {() => (
              <>
                <input
                  className="volumeControlBar"
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  ref={audioBar}
                  onChange={e => changeVolume(e)}
                />
                <p className="0 absolute -right-8 -z-40 w-10 rotate-90 rounded-t-md bg-black py-3 text-center text-xs text-skin-muted">
                  {volume}%
                </p>
              </>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    );
  };

  const renderRightMenuButtons = () => {
    return (
      <>
        <div className="absolute right-4 top-5 flex flex-col gap-2">
          {renderActionMenu()}
          {renderVolumeMenu()}
        </div>
      </>
    );
  };

  const renderPlayerControlButtons = () => {
    return (
      <>
        {/* CONTROL BUTTONS */}
        <div className="absolute inset-y-0 bottom-0 right-14 flex w-28 items-center justify-center gap-x-2 md:bottom-0">
          <FontAwesomeIcon
            aria-label="Back 15 seconds"
            className="text- text-2xl hover:text-buttonAccentHover md:text-xl"
            icon={FAProSolid.faArrowRotateLeft}
            onClick={back15}
          />
          <FontAwesomeIcon
            aria-label="Play/Pause"
            className="text-2xl hover:text-buttonAccentHover md:text-4xl"
            icon={playerGetIcon()}
            onClick={playerTogglePlaying}
          />
          <FontAwesomeIcon
            aria-label="Forward 15 seconds"
            className="text-2xl hover:text-buttonAccentHover md:text-xl"
            icon={FAProSolid.faArrowRotateRight}
            onClick={forward15}
          />
        </div>
      </>
    );
  };

  const renderAudioPlayerBigScreen = () => {
    return (
      <div className="fixed -bottom-1 left-0 z-50 h-10 w-full justify-center ">
        <audio ref={audioPlayer} src={playerAudioUrl} preload="metadata"></audio>
        <div
          className={`absolute bottom-3 w-full max-w-7xl rounded-2xl border-t-2 border-buttonAccentHover transition-transform duration-300 ease-linear md:bottom-5 md:left-60 md:w-[70%] ${
            playerIsGlobalPlayerShowing ? ' md:translate-y-2' : 'translate-y-[6.5rem] transform md:translate-y-[7rem]'
          } ${playerIsPlaying ? 'translate-y-0' : null}`}>
          <div className="bg-fill/50 relative float-left grid h-28 w-full items-center gap-x-2 rounded-lg p-4 drop-shadow-md backdrop-blur-md ">
            {renderPodcastPFP()}
            {renderPodcastInfo()}
            {renderProgressBar()}
          </div>
          {renderPlayerControlButtons()}
          {renderRightMenuButtons()}
          <button
            aria-label="Hide/Show player"
            onClick={toggleShowing}
            className="2xl absolute -top-7 left-5 block w-32 rounded-t-2xl border-2 border-b-0 border-buttonAccentHover p-1 text-xs text-skin-muted outline-none backdrop-blur-md">
            {playerIsGlobalPlayerShowing ? 'Hide' : 'Show'} Player
          </button>
        </div>
      </div>
    );
  };

  const renderAudioPlayerMobile = () => {
    return (
      <div className="fixed bottom-16 left-0 z-40 flex h-12 w-full flex-row items-center bg-skin-fill ">
        <audio ref={audioPlayer} src={playerAudioUrl} preload="metadata"></audio>
        {/* <div className="absolute flex items-center justify-center w-full -top-1 gap-x-2">
          <input
            aria-label="Player progress bar"
            type="range"
            className="w-full"
            defaultValue="0"
            ref={progressBar}
            onChange={changeRange}
          />
        </div> */}
        <div className="mx-2 mt-2">
          <Image
            loader={contentfulLoader}
            src={playerThumbnailUrl}
            alt=""
            width={40}
            height={40}
            className=""
            layout={'intrinsic'}
          />
        </div>
        <div>
          <p className="truncate font-bold text-skin-base">{title}</p>
          <Link className="" href={'/creator/' + playerCreatorAccount.creatorKey.toString() ?? 'owner'}>
            <a className="mt-1 flex w-40 truncate text-sm text-skin-muted hover:underline md:w-64 md:text-[1rem] md:text-xs">
              {creatorName}
            </a>
          </Link>
        </div>{' '}
        <FontAwesomeIcon
          aria-label="Play/Pause"
          className="ml-auto mr-8 text-3xl"
          icon={playerGetIcon()}
          onClick={playerTogglePlaying}
        />{' '}
      </div>
    );
  };

  return (
    <Media
      queries={{
        mobile: '(max-width: 768px)',
        bigScreen: '(min-width: 769px)'
      }}>
      {matches => (
        <Fragment>
          {matches.mobile && renderAudioPlayerMobile()}
          {matches.bigScreen && renderAudioPlayerBigScreen()}
        </Fragment>
      )}
    </Media>
  );
}
