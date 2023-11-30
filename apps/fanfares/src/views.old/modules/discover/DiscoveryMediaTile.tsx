import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { Metadata } from '@excalibur/metadata';
import Image from 'next/image';
import Link from 'next/link';
import Media from 'react-media';
import { Text } from 'src/views/components/Text';
import { contentfulLoader } from '../../../controllers/utils/image-loader';

// https://www.figma.com/file/prlcVs5JaW6oXAINeDYaGC/%E2%9C%8F%EF%B8%8F-Excalibur---Podcast-App---Milestone-2---Dev?node-id=94%3A4608

export interface DiscoveryMediaTileProps {
  metadata: Metadata;
  playerUrl: string;
  tileKey: string;
}

export function DiscoveryMediaTile(props: DiscoveryMediaTileProps) {
  // const { playerTogglePlaying, playerMediaAccount } = useAppState();
  const { metadata, playerUrl } = props;

  const getTime = () => {
    const durationAttribute = metadata.attributes.find(att => {
      return att.trait_type === 'Duration';
    });

    if (durationAttribute) {
      try {
        const seconds = parseInt(durationAttribute.value.split('s')[0]);
        return Math.ceil(seconds / 60).toString();
      } catch (e) {
        console.error(e);
      }
    }

    return null;
  };

  const renderDateAndTime = () => {
    const date = '';
    const time = getTime();
    if (!date || !time) {
      return null;
    }

    return (
      <div className="mb-1 ml-1 mr-1 flex flex-row items-center justify-between pt-2 text-xs font-bold leading-[12px] text-gray-500">
        <Text>{date}</Text>
        <FontAwesomeIcon icon={FAProSolid.faCircleSmall} className="text-[8px]" />
        <Text>{time} Min</Text>
      </div>
    );
  };

  const metadataNameSlicer = () => {
    if (metadata.name.length > 40) {
      return metadata.name.slice(0, 40) + '...';
    }
    return metadata.name;
  };


  const renderDiscoveryTileBigScreen = () => {
    return (
      <Link href={playerUrl}>
        <div className="e2e-podcast-tile group h-60 w-40 cursor-pointer flex-col items-center justify-start rounded-lg border border-white/[10%] p-2 transition duration-300 ease-linear hover:scale-105 hover:bg-black/[10%] md:flex md:h-64 md:w-40">
          <div className="group/playButton relative h-36 w-full rounded-lg transition duration-300 group-hover:brightness-110">
            <Image
              priority
              loader={contentfulLoader}
              src={metadata.image}
              alt={metadata.name + ' thumbnail'}
              layout="fill"
              objectFit="cover"
              className="rounded-md drop-shadow-2xl"
            />
          </div>
          <div className="mt-2 flex  w-full flex-col items-start border-white/[10%]">
            <h2 className="e2e-podcast-title mt-2 w-[130px] truncate px-1 text-xs font-bold uppercase  leading-[18px] md:w-[140px] md:text-sm">
              {metadataNameSlicer()}
            </h2>
            <p className="e2e-podcast-title mt-1 h-8 w-full overflow-clip px-1 text-xs font-thin leading-[18px] line-clamp-2 ">
              {metadata?.description}
            </p>
          </div>
          {renderDateAndTime()}

        </div>
      </Link>
    );
  };

  const renderDiscoveryTileSmallScreen = () => {
    return (
      <Link href={playerUrl}>
        <div className="flex w-[340px] flex-col rounded-lg border border-white/[10%] px-2 py-3">
          <div className="e2e-podcast-tile group flex h-full cursor-pointer items-start justify-start transition duration-300 ease-linear hover:bg-black/[10%]">
            <div className="group/playButton relative h-[75px] w-[75px] rounded-lg transition duration-300 group-hover:brightness-110">
              <Image
                priority
                loader={contentfulLoader}
                src={metadata.image}
                alt={metadata.name + ' thumbnail'}
                layout="fixed"
                width={75}
                height={75}
                objectFit="fill"
                className="rounded-md drop-shadow-2xl"
              />
            </div>
            <div className="ml-2 flex w-full flex-col items-start border-white/[10%]">
              <h2 className="e2e-podcast-title mt-1 w-[220px] truncate px-1 text-xs font-bold uppercase leading-[18px] md:w-[140px] md:text-sm">
                {metadata.name}
              </h2>
              <p className="e2e-podcast-title mt-1 h-fit w-full overflow-clip px-1 text-xs font-thin leading-[18px] line-clamp-3 ">
                {metadata?.description}
              </p>
            </div>
            {renderDateAndTime()}
          </div>
          <hr className="mx-auto mt-2 h-1 w-full" />
        </div>
      </Link>
    );
  };

  return (
    <Media
      queries={{
        mobile: '(min-width: 264px) and (max-width: 767px)'
      }}>
      {matches => <>{matches.mobile ? renderDiscoveryTileSmallScreen() : renderDiscoveryTileBigScreen()}</>}
    </Media>
  );
}

export default DiscoveryMediaTile;
