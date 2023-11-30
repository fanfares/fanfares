import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { Metadata } from '@excalibur/metadata';
import { PublicKey } from '@solana/web3.js';
import { useRef } from 'react';
import { removeSpaces } from 'src/controllers/utils';
import { getMediaDataFromUrl } from 'src/controllers/utils/get-media-data-from-url';
import { Text } from 'src/views/components/Text';

export interface NftTileProps {
  nft: Metadata;
  currentMediaKey: PublicKey;
  isCurrentlyPlaying: boolean;
  isLoading: boolean;
  onPlayPause: (key: PublicKey) => void;
}

export function NftTile(props: NftTileProps) {
  const { nft, currentMediaKey, isCurrentlyPlaying, onPlayPause, isLoading } = props;
  // const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { mediaKey, isExcaliburNFT } = getMediaDataFromUrl(nft.external_url ?? '');

  const isCurrentMedia = mediaKey && currentMediaKey && mediaKey?.toString() === currentMediaKey?.toString();
  const isTilePlaying = isCurrentMedia && isCurrentlyPlaying;
  const icon = isLoading ? FAProSolid.faLoader : isTilePlaying ? FAProSolid.faCirclePause : FAProSolid.faCirclePlay;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

  const playPause = () => {
    if (!isExcaliburNFT) return;

    onPlayPause(mediaKey);
  };

  const playableNFT = () => {
    return (
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={cardRef}
        id="shinyCard"
        className="m-2 h-32 w-32 cursor-pointer rounded-lg bg-transparent perspective ">
        <div
          id={removeSpaces(nft.name) + '-nft-tile'}
          className="relative h-full w-full rounded-lg duration-1000 preserve-3d group-hover:my-rotate-y-180 ">
          <button className="absolute inset-0 z-20 " onClick={playPause}>
            <FontAwesomeIcon
              className={`m:animate-pulse text-4xl text-buttonAccentHover transition-all `}
              icon={icon}
            />
          </button>

          <div className="h-full w-full rounded-lg">
            <div className="shinyEffect relative h-32 w-32 rounded-lg object-cover ">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Thumbnail Image" id="" className="h-full w-full rounded-lg object-cover " src={nft.image} />
            </div>{' '}
            <Text className="absolute bottom-2 left-2 z-10 w-5/6 rounded bg-skin-fill p-1 shadow-md drop-shadow-lg line-clamp-1">
              {nft.name}
            </Text>
          </div>
        </div>
      </div>
    );
  };

  const renderByState = () => {
    if (isExcaliburNFT) {
      return playableNFT();
    } else {
      return null;
    }
  };

  return renderByState();
}
