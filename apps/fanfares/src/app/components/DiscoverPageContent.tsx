"use client"
// import { Metadata } from '@excalibur/metadata';
// import { getPlayerUrl } from '@utils';
import { useCallback, useEffect, useMemo, useState } from "react"
// import { queryLatestMediaMetadata } from 'src/controllers/firebase/firebase-functions';
// import { isMediaBlacklisted } from 'src/controllers/firebase/media-blacklist';
// import { useAppState } from 'src/controllers/state/use-app-state';
// import LazyLoad from '../../components/LazyLoad';
import Image from "next/image"

import Link from "next/link"
import Searchbar from "./Searchbar"
import { useAppState } from "../controllers/state/use-app-state"
import { NIP_108_KINDS, eventToAnnouncementNote, eventToGatedNote } from "nip108"

export interface DiscoveryMediaInfo extends Metadata {
  media_key: string
  owner_key: string
  creator_name: string
}

function DiscoverPageContent() {
  // const { program, drmApi } = useAppState();

  const [media, setMedia] = useState<DiscoveryMediaInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { nostrPool, nostrRelays } = useAppState();

  useEffect(() => {
    if(!nostrPool || !nostrRelays) return;

    nostrPool.list(nostrRelays, [
      {
        kinds: [NIP_108_KINDS.announcement],
        limit: 10,
      }
    ]).then((rawAnnouncements) => {
      const announcements = rawAnnouncements.map(eventToAnnouncementNote);
      const gatesToGet = announcements.map((a) => a.gate);
      
      nostrPool.list(nostrRelays, [
        {
          ids: gatesToGet,
        }
      ]).then((rawGates) => {
        const gates = rawGates.map(eventToGatedNote);
        console.log(gates);
      })
    })

  }, [
    nostrPool,
    nostrRelays,
  ]);



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
      <div className="container flex justify-center ">
        <div className="flex flex-wrap gap-3 ">
          {renderEpisodeCard()}
          {renderEpisodeCard()}
          {renderEpisodeCard()}
          {renderEpisodeCard()}
          {renderEpisodeCard()}
          {renderEpisodeCard()}
          {renderEpisodeCard()}
          {renderEpisodeCard()}
          {renderEpisodeCard()}
          {renderEpisodeCard()}
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

  const renderEpisodeCard = () => {
    return (
      <Link
        href={""}
        className="e2e-podcast-tile group md:w-48 lg:w-40 w-full cursor-pointer flex md:flex-col  md:items-center justify-start rounded-lg border border-buttonAccent p-2 transition duration-300 ease-linear md:hover:scale-105 md:hover:bg-black/[10%] md:h-64 gap-2">
        <div className="relative flex items-center w-20 rounded-lg md:transition md:duration-300 md:w-full group/playButton md:h-36 md:group-hover:brightness-110">
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
            className="object-cover w-20 h-20 border rounded-md md:w-full md:h-full drop-shadow-2xl border-buttonAccent"
          />
        </div>
        {/* <div className="mt-2 h-full flex w-full flex-col items-start border-white/[10%] justify-start truncate line-clamp-2"></div> */}
        <div className="flex-col flex-1 w-40 mt-2 space-y-2 md:px-2">
          <p className="e2e-podcast-title text-xs font-bold uppercase md:leading-[18px] md:text-sm md:w-11/12 truncate mr-auto ">
            {/* {metadataNameSlicer()} */}
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro
            totam iure obcaecati quisquam saepe molestiae laborum veritatis,
            quod at accusamus odio reiciendis enim sit dignissimos tempore omnis
            id ipsam consequuntur.
          </p>
          <p className="tracking-tight text-xs/4 line-clamp-2 md:text-base/4 ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            nisi magni ab voluptas veniam rem, asperiores optio harum
            necessitatibus nam repellendus nihil minima est quam excepturi
            fugit. Tenetur, voluptas nemo.
          </p>
          <p className="ml-auto text-xs font-thin text-right md:text-start ">
            D 01/01/01 H 01:01:00
          </p>{" "}
          {/* {renderDateAndTime()} */}
        </div>
      </Link>
    )
  }

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
      <h1 className="font-black text-center text-gray-100 uppercase text-xl/4 md:mt-4 md:text-start md:text-4xl">
        This Week on Excalibur
      </h1>
      <Searchbar />
      {renderLoading()}
      {renderContent()}
    </div>
  )
}

export default DiscoverPageContent
