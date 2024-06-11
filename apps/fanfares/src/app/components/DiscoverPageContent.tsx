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
import { useAppState } from "../controllers/state/old/use-app-state"
import {
  usePodcastActions,
  usePodcastEpisodes,
  usePodcastFetching,
} from "../controllers/state/podcast-slice"
import { useNostr } from "../controllers/state/nostr-slice"
import { useRouter } from "next/navigation"
import { GATE_SERVER } from "../controllers/nostr/nostr-defines"

import { NIP04, NIP07, eventToNostrProfile } from "utils"
import { useAccountActions } from "../controllers/state/account-slice"
import { SimplePool } from "nostr-tools"




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
  const router = useRouter()
  const { nostrPool, nostrRelays } = useNostr()
  const { podcastFetch } = usePodcastActions()
  const podcastEpisodes = usePodcastEpisodes()
  const podcastFetching = usePodcastFetching()
  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>({});

  interface Profile {
    name: string;
    picture: string;
    display_name:string;
  }
  

  useEffect(() => {
    if (nostrPool && nostrRelays) {
      console.log("Fetching Podcasts")

      podcastFetch(nostrPool, nostrRelays)
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

  const episodeTestingTitlesFilter = [
    "TEST",
    "THIS IS AN M4A",
    "NOSTR TEST",
    "TEST2",
    "This is an M4A",
    "2nd",
    "3rd",
    "Test",
    "Test2",
    "nostr test",
    "test",
    "Another",
    "TEst",
    "new",
  ]


  const accountFetchProfile = async (
    publicKey: string,
    pool: SimplePool,
    relays: string[]
  ): Promise<Profile> => {
    try {
      const profileEvent = await pool.get(relays, {
        kinds: [0],
        limit: 1,
        authors: [publicKey],
      });
  
      if (!profileEvent) throw new Error('No profile event found');
  
      console.log(JSON.stringify(profileEvent));
      return eventToNostrProfile(publicKey, profileEvent);
    } catch (e) {
      throw new Error(`Failed to fetch profile - ${e}`);
    }
  };



  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesData: { [key: string]: Profile } = {};
      for (const podcast of Object.values(podcastEpisodes)) {
        const toHide = episodeTestingTitlesFilter.includes(podcast.title);
        if (!toHide) {
          try {
            const profileEvent = await accountFetchProfile(
              podcast.announcement.note.pubkey,
              nostrPool,
              nostrRelays
            );
            profilesData[podcast.announcement.note.pubkey] = profileEvent;
          } catch (e) {
            if (e instanceof Error)
            console.error(
              `Failed to fetch profile for ${podcast.announcement.note.pubkey} - ${e.message}`
            );
          }
        }
      }
      setProfiles(profilesData);
    };

    if (!podcastFetching) {
      fetchProfiles();
    }
  }, [podcastEpisodes, podcastFetching, nostrPool, nostrRelays]);

  const renderContent = () => {
    if (podcastFetching) return null;
    return (
      <div className="container flex pb-8">
        <div className="flex md:flex-wrap md:flex-row flex-col gap-3 w-full">
          {Object.values(podcastEpisodes).map((podcast) => {
            const toHide = episodeTestingTitlesFilter.includes(podcast.title);
            if (toHide) return null;
            const defaultProfilePicture = "https://shdw-drive.genesysgo.net/DYTesEgJE5YAHBZxRFMe9xENR1xEVuczhD4HqvWf2yfo/default_profile_dark.png"
            const profile = profiles[podcast.announcement.note.pubkey];
            const username = profile && profile.name  
            const creatorPicture = profile?.picture || defaultProfilePicture;
            const display_name = profile && profile.display_name;

            return (
              <EpisodeCard
                key={podcast.gate.note.id}
                onClick={() => {
                  router.push(`/player/${podcast.gate.note.id}`);
                }}
                imgUrl={podcast.imageFilepath}
                title={podcast.title}
                description={podcast.description}
                audioUrl={podcast.audioFilepath}
                creatorName={display_name}
                creatorProfilePicture={creatorPicture}
              />
            );
          })}
        </div>
      </div>
    );
  };


  return (
    <div className="space-y-4">
      <h1 className="font-black text-center text-gray-100 text-xl/4 md:mt-4 md:text-start md:text-4xl">
        Recent Podcasts{" "}
      </h1>
      {/* <Searchbar /> */}
      {renderLoading()}
      {renderContent()}
    </div>
  )
}

export default DiscoverPageContent
