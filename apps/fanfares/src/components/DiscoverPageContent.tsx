"use client"
// import { Metadata } from '@excalibur/metadata';
// import { getPlayerUrl } from '@utils';
import { useCallback, useEffect, useMemo, useState } from "react"
// import { queryLatestMediaMetadata } from 'src/controllers/firebase/firebase-functions';
// import { isMediaBlacklisted } from 'src/controllers/firebase/media-blacklist';
// import { useAppState } from 'src/controllers/state/use-app-state';
// import LazyLoad from '../../components/LazyLoad';
import Image from "next/image"

import {
  DiscoveryMediaTile,
  DiscoveryMediaTileProps,
} from "./DiscoveryMediaTile"
import DiscoveryMediaTileLoading from "./DiscoveryMediaTileLoading"
import Link from "next/link"

export interface DiscoveryMediaInfo extends Metadata {
  media_key: string
  owner_key: string
  creator_name: string
}

function DiscoverPageContent() {
  // const { program, drmApi } = useAppState();

  const [media, setMedia] = useState<DiscoveryMediaInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState("")

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setSearchQuery(event.target.value)
    }
  }

  const filteredPodcasts = useMemo(() => {
    const searchQueryLowerCase = searchQuery.toLowerCase()
    return media.filter(podcast => {
      // if (isMediaBlacklisted(podcast)) return false;
      if (!searchQueryLowerCase) return true
      return (
        // podcast.name.toLowerCase().includes(searchQueryLowerCase) ||
        // podcast.description.toLowerCase().includes(searchQueryLowerCase) ||
        podcast.creator_name.toLowerCase().includes(searchQueryLowerCase)
      )
    })
  }, [searchQuery, media])

  // useEffect(() => {
  //   loadMedias().then();
  // }, [loadMedias]);

  const renderLoading = () => {
    if (!isLoading) return null

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
    if (isLoading) return null
    return (
      // <div className="flex items-center justify-center w-full pb-10 mx-auto rounded lg:justify-start">
      <> {renderPodcastTileGrid()}</>
      // </div>
    )
  }

  //T-32 Make into a grid
  const renderPodcastTileGrid = () => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4 md:justify-start md:gap-4">
        {/* {filteredPodcasts.map(MediaMetadata => {
          return renderPodcastTile({
            tileKey: MediaMetadata.media_key,
            metadata: MediaMetadata,
            playerUrl: getPlayerUrl(MediaMetadata.media_key),
          })
        })} */}
        <Link href={""}>
          <div className="e2e-podcast-tile group h-60 w-40 cursor-pointer flex-col items-center justify-start rounded-lg border border-white/[10%] p-2 transition duration-300 ease-linear hover:scale-105 hover:bg-black/[10%] md:flex md:h-64 md:w-40">
            <div className="relative w-full transition duration-300 rounded-lg group/playButton h-36 group-hover:brightness-110">
              {/* //should be IMAGE, this is just mocking */}
              <img
                // priority
                // loader={contentfulLoader}
                src={
                  "https://www.partnershipprojectsuk.com/wp-content/uploads/2020/08/Neon-podcast-logo.jpg"
                }
                alt={" thumbnail"}
                // layout="fill"
                // objectFit="cover"
                className="object-cover h-full rounded-md drop-shadow-2xl"
              />
            </div>
            <div className="mt-2 flex  w-full flex-col items-start border-white/[10%]">
              <h2 className="e2e-podcast-title mt-2 w-[130px] truncate px-1 text-xs font-bold uppercase  leading-[18px] md:w-[140px] md:text-sm">
                {/* {metadataNameSlicer()} */}
                Name
              </h2>
              <p className="e2e-podcast-title mt-1 h-8 w-full overflow-clip px-1 text-xs font-thin leading-[18px] line-clamp-2 ">
                description
              </p>
            </div>
            {/* {renderDateAndTime()} */}
            01/01/01 01:01
          </div>
        </Link>
      </div>
    )
  }

  const renderPodcastTile = (props: DiscoveryMediaTileProps) => {
    const id = `e2e-${props.tileKey}`
    return (
      <div key={props.tileKey} id={id} className="">
        {/* <LazyLoad placeholder={<DiscoveryMediaTileLoading />}> */}
        <DiscoveryMediaTile
          tileKey={props.tileKey}
          metadata={props.metadata}
          playerUrl={props.playerUrl}
        />
        {/* </LazyLoad> */}
      </div>
    )
  }

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
  )
}

export default DiscoverPageContent
