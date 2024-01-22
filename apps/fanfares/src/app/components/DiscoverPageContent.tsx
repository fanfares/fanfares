"use client"
// import { Metadata } from '@excalibur/metadata';
// import { getPlayerUrl } from '@utils';
import { useCallback, useEffect, useMemo, useState } from "react"
// import { queryLatestMediaMetadata } from 'src/controllers/firebase/firebase-functions';
// import { isMediaBlacklisted } from 'src/controllers/firebase/media-blacklist';
// import { useAppState } from 'src/controllers/state/use-app-state';
// import LazyLoad from '../../components/LazyLoad';

import Searchbar from "./Searchbar"
import EpisodeCard from "./EpisodeCard"

import { config } from "@fortawesome/fontawesome-svg-core"
import { useAppState } from "../controllers/state/use-app-state"
import { usePodcastActions, usePodcastEpisodes, usePodcastFetching } from "../controllers/state/podcast-slice"
import { useNostr } from "../controllers/state/nostr-slice"

config.autoAddCss = false /* eslint-disable import/first */
export interface DiscoveryMediaInfo extends Metadata {
  media_key: string
  owner_key: string
  creator_name: string
}

export interface DiscoveryTileInfo {
  imgUrl: string
  title: string
  description: string
  audioUrl?: string
}

function DiscoverPageContent() {
  // const { program, drmApi } = useAppState();
  const { nostrPool, nostrRelays } = useNostr();
  const { podcastFetch, podcastUnlock } = usePodcastActions();
  const podcastEpisodes = usePodcastEpisodes();
  const podcastFetching = usePodcastFetching();

  console.log("Render Podcasts -- " + Object.values(podcastEpisodes).length);

  useEffect(() => {
    if(nostrPool && nostrRelays){
      console.log("Fetching Podcasts");
      podcastFetch(
        nostrPool,
        nostrRelays,
      );
    }
  }, [podcastFetch, nostrPool, nostrRelays])

  // const loadMedias = useCallback(async () => {
  //   setIsLoading(true);

  //   queryLatestMediaMetadata()
  //     .then(media => {
  //       // eslint-disable-next-line
  //       setMedia(media as any);
  //       setIsLoading(false);
  //     })
  //     .catch(e => {
  //       console.error(e);
  //       setIsLoading(false);
  //     });

  //   // eslint-disable-next-line
  // }, [drmApi, program]);

  // const filteredPodcasts = useMemo(() => {
  //   const searchQueryLowerCase = searchQuery.toLowerCase()
  //   return media.filter(podcast => {
  //     // if (isMediaBlacklisted(podcast)) return false;
  //     if (!searchQueryLowerCase) return true
  //     return (
  //       // podcast.name.toLowerCase().includes(searchQueryLowerCase) ||
  //       // podcast.description.toLowerCase().includes(searchQueryLowerCase) ||
  //       podcast.creator_name.toLowerCase().includes(searchQueryLowerCase)
  //     )
  //   })
  // }, [searchQuery, media])

  // useEffect(() => {
  //   loadMedias().then();
  // }, [loadMedias]);

  const renderLoading = () => {
    if (!podcastFetching) return null

    return (
      <div className="flex items-center justify-center w-full h-screen">
        <svg
          className="... mr-3 h-5 w-5 animate-spin"
          viewBox="0 0 24 24"></svg>
        <p className="animate-pulse">Loading...</p>
      </div>
    )
  }

  const renderContent = () => {
    if (podcastFetching) return null
    return (
      // <div className="flex items-center justify-center w-full pb-10 mx-auto rounded lg:justify-start">
      <div className="container flex">
        <div className="flex flex-wrap gap-3 ">
          {Object.values(podcastEpisodes).map(podcast => {
            return (
              <EpisodeCard
                onClick={() => {
                  // if (!podcast.audioFilepath) {
                  //   podcastUnlock(
                  //     podcast.gate.note.id
                  //   )
                  // }
                }}
                imgUrl={podcast.imageFilepath}
                title={podcast.title}
                description={podcast.description}
                audioUrl={podcast.audioFilepath}
              />
            )
          })}
        </div>
      </div>

      // </div>
    )
  }

  //T-32 Make into a grid
  // const renderPodcastTileGrid = () => {
  //   return (
  //     // <div className="grid justify-center grid-cols-2 gap-3 mx-auto mt-4 sm:flex-wrap sm:flex md:justify-start md:gap-4 lg:mx-0">
  //     <div className="container flex flex-wrap justify-center gap-3 mt-4 ">
  //       {filteredPodcasts.map(MediaMetadata => {
  //         return renderPodcastTile({
  //           tileKey: MediaMetadata.media_key,
  //           metadata: MediaMetadata,
  //           playerUrl: getPlayerUrl(MediaMetadata.media_key),
  //         })
  //       })}
  //       {renderEpisodeCard()}
  //       {renderEpisodeCard()}

  //       {renderEpisodeCard()}
  //       {renderEpisodeCard()}
  //       {renderEpisodeCard()}
  //       {renderEpisodeCard()}
  //       {renderEpisodeCard()}
  //     </div>
  //   )
  // }

  // const renderPodcastTile = (props: DiscoveryMediaTileProps) => {
  //   const id = `e2e-${props.tileKey}`
  //   return (
  //     <div key={props.tileKey} id={id} className="">
  //       {/* <LazyLoad placeholder={<DiscoveryMediaTileLoading />}> */}
  //       <DiscoveryMediaTile
  //         tileKey={props.tileKey}
  //         metadata={props.metadata}
  //         playerUrl={props.playerUrl}
  //       />
  //       {/* </LazyLoad> */}
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-4">
      <h1 className="font-black text-center text-gray-100 text-xl/4 md:mt-4 md:text-start md:text-4xl">
        This Week on FanFares
      </h1>
      <Searchbar />
      {renderLoading()}
      {renderContent()}
    </div>
  )
}

export default DiscoverPageContent

