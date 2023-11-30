import { Metadata } from '@excalibur/metadata';
import { getPlayerUrl } from '@utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { queryLatestMediaMetadata } from 'src/controllers/firebase/firebase-functions';
import { isMediaBlacklisted } from 'src/controllers/firebase/media-blacklist';
import { useAppState } from 'src/controllers/state/use-app-state';
import LazyLoad from '../../components/LazyLoad';
import { DiscoveryMediaTile, DiscoveryMediaTileProps } from './DiscoveryMediaTile';
import DiscoveryMediaTileLoading from './DiscoveryMediaTileLoading';

export interface DiscoveryMediaInfo extends Metadata {
  media_key: string;
  owner_key: string;
  creator_name: string;
}

function DiscoverPageContent() {
  const { program, drmApi } = useAppState();

  const [media, setMedia] = useState<DiscoveryMediaInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMedias = useCallback(async () => {
    setIsLoading(true);

    queryLatestMediaMetadata()
      .then(media => {
        // eslint-disable-next-line
        setMedia(media as any);
        setIsLoading(false);
      })
      .catch(e => {
        console.error(e);
        setIsLoading(false);
      });

    // eslint-disable-next-line
  }, [drmApi, program]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setSearchQuery(event.target.value);
    }
  };

  const filteredPodcasts = useMemo(() => {
    const searchQueryLowerCase = searchQuery.toLowerCase();
    return media.filter(podcast => {
      if (isMediaBlacklisted(podcast)) return false;
      if (!searchQueryLowerCase) return true;
      return (
        podcast.name.toLowerCase().includes(searchQueryLowerCase) ||
        podcast.description.toLowerCase().includes(searchQueryLowerCase) ||
        podcast.creator_name.toLowerCase().includes(searchQueryLowerCase)
      );
    });
  }, [searchQuery, media]);

  useEffect(() => {
    loadMedias().then();
  }, [loadMedias]);

  const renderLoading = () => {
    if (!isLoading) return null;

    return (
      <div className="flex items-center justify-center w-full h-screen">
        <svg className="... mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24"></svg>
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) return null;
    return (
      // <div className="flex items-center justify-center w-full pb-10 mx-auto rounded lg:justify-start">
      <> {renderPodcastTileGrid()}</>
      // </div>
    );
  };

  //T-32 Make into a grid
  const renderPodcastTileGrid = () => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4 md:justify-start md:gap-4">
        {filteredPodcasts.map(MediaMetadata => {
          return renderPodcastTile({
            tileKey: MediaMetadata.media_key,
            metadata: MediaMetadata,
            playerUrl: getPlayerUrl(MediaMetadata.media_key)
          });
        })}
      </div>
    );
  };

  const renderPodcastTile = (props: DiscoveryMediaTileProps) => {
    const id = `e2e-${props.tileKey}`;
    return (
      <div key={props.tileKey} id={id} className="">
        <LazyLoad placeholder={<DiscoveryMediaTileLoading />}>
          <DiscoveryMediaTile tileKey={props.tileKey} metadata={props.metadata} playerUrl={props.playerUrl} />
        </LazyLoad>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col w-full h-full pb-20 overflow-y-scroll md:pb-10">
        <h1 className="mt-12 text-xl font-black text-center text-gray-100 uppercase font-font1 md:mt-4 md:text-start md:text-4xl">
          This Week on Excalibur
        </h1>

        <div className="mt-10">
          <input
            id="e2e-discover-search-bar"
            onChange={handleSearch}
            placeholder="Search..."
            className="left-[36px] w-full border-2 border-buttonAccent
                   p-3 rounded-md bg-transparent outline-none
                   placeholder:text-xl placeholder:font-thin
                   placeholder:text-skin-inverted"
          />
        </div>
        {renderLoading()}
        {renderContent()}
      </div>
    </>
  );
}

export default DiscoverPageContent;
