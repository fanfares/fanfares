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
  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>({})

  interface Profile {
    name: string
    picture: string
    display_name: string
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
    "6213a2ffe6932e5399995d66264505f8694803d8f2bfa5582cfa6b6e56a948ac",
    "c5f7256a860c42d2c237d7a619e6157fe64282d2513ac3bfbcc37b85adc6d978",
    "87026fcd69b1e78813124a5ce40e786adbdae0e67242242422f72b415692e679",
    "5afc4300c7dd459597fceb40cb39959ffc4c67038117644de5198ffbf6f995ad",
    "1e7a7777fe3f31d8876f19023db96e0fa8c59ef5d8a602af5bb2716545fbcf71",
    "1439fa54359d6432e3e6e3dcb6a294ad3a4b764b428c91724a9f82a67e847b47",
    "c939f1e391515d321a7849af985dd18f321ad5b5a239403693deedc46f48e15e",
    "c939f1e391515d321a7849af985dd18f321ad5b5a239403693deedc46f48e15e",
    "69b1a9df6ebe01f2f6c87f2283eb1cc40e50a5e422b5c2dd4fc09141bc0d02c6",
    "314bda3c53fd92077f374353126d7b083ba3f2448a048fac5b70650b2ba6fcf5",
    "e9346341508e25af7bf31c2e236fa86bc9fc0986d7530ed767a624ed9bcbd86c",
    "3c80b612b21a8c4aa7eca766ea952bbb5701391c47716aa8036df9fdfe246697",
    "b3979c04c785cdb95dc4001eef294ed6546844698680c344c43fc20d5e4e1334",
    "f2c6d493de0ef84df44434767a6b3ee8e7520db984990bdcf6a42e37a4aab974",
    "33aeca36b7e0f908c569c7926d717f2973b27b3f01745a8edbb5a0c03ea16203",
    "271b71d85d5c22062681ac469b19fae10eede958cd33eb4c12f42b3b786f1553",
    "e9346341508e25af7bf31c2e236fa86bc9fc0986d7530ed767a624ed9bcbd86c",
    "f2c6d493de0ef84df44434767a6b3ee8e7520db984990bdcf6a42e37a4aab974",
    "6213a2ffe6932e5399995d66264505f8694803d8f2bfa5582cfa6b6e56a948ac",
    "3c80b612b21a8c4aa7eca766ea952bbb5701391c47716aa8036df9fdfe246697",
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
      })

      if (!profileEvent) throw new Error("No profile event found")

      // console.log(JSON.stringify(profileEvent))
      return eventToNostrProfile(publicKey, profileEvent)
    } catch (e) {
      throw new Error(`Failed to fetch profile - ${e}`)
    }
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesData: { [key: string]: Profile } = {}
      for (const podcast of Object.values(podcastEpisodes)) {
        const toHide = episodeTestingTitlesFilter.includes(podcast.title)
        if (!toHide) {
          try {
            const profileEvent = await accountFetchProfile(
              podcast.announcement.note.pubkey,
              nostrPool,
              nostrRelays
            )
            profilesData[podcast.announcement.note.pubkey] = profileEvent
          } catch (e) {
            if (e instanceof Error)
              console.error(
                `Failed to fetch profile for ${podcast.announcement.note.pubkey} - ${e.message}`
              )
          }
        }
      }
      setProfiles(profilesData)
    }

    if (!podcastFetching) {
      fetchProfiles()
    }
  }, [podcastEpisodes, podcastFetching, nostrPool, nostrRelays])

  const renderContent = () => {
    if (podcastFetching) return null
    return (
      <div className="container flex pb-8">
        <div className="flex md:flex-wrap md:flex-row flex-col gap-3 w-full md:pb-32">
          {Object.values(podcastEpisodes).map(podcast => {
            const toHide = episodeTestingTitlesFilter.includes(podcast.title)
            console.log(podcast)
            if (toHide) return null
            const defaultProfilePicture =
              "https://shdw-drive.genesysgo.net/DYTesEgJE5YAHBZxRFMe9xENR1xEVuczhD4HqvWf2yfo/default_profile_dark.png"
            const profile = profiles[podcast.announcement.note.pubkey]
            const username = profile && profile.name
            const creatorPicture = profile?.picture || defaultProfilePicture
            const display_name = profile && profile.display_name

            return (
              <EpisodeCard
                key={podcast.gate.note.id}
                onClick={() => {
                  router.push(`/player/${podcast.gate.note.id}`)
                }}
                imgUrl={podcast.imageFilepath}
                title={podcast.title}
                description={podcast.description}
                audioUrl={podcast.audioFilepath}
                creatorName={display_name}
                creatorProfilePicture={creatorPicture}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-40 md:pb-0">
      <h1 className="font-gloock text-center text-gray-100 text-xl/4 md:mt-4 md:text-start md:text-4xl">
        Recent Podcasts{" "}
      </h1>
      {/* <Searchbar /> */}
      {renderLoading()}
      {renderContent()}
    </div>
  )
}

export default DiscoverPageContent
