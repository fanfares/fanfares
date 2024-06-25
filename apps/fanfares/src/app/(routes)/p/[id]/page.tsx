"use client"
import Button from "../../../components/Button"
import { FeedPost } from "../../../components/FeedPost"
import {
  usePrimalActions,
  usePrimalIsFetching,
  usePrimalNoteStats,
  usePrimalNotes,
  usePrimalProfiles,
  usePrimalSocket,
} from "../../../controllers/state/primal-slice"

import {
  useAccountNostr,
  useAccountProfile,
} from "../../../controllers/state/account-slice"
import { useCallback, useEffect, useState } from "react"
import PodcastsCarrousel from "../../../components/PodcastsCarrousel"
import { Modal } from "../../../components/Modal"
import ProfileEditorForm from "../../../components/ProfileEditorForm"
import { getIdFromUrl } from "@/app/controllers/utils/formatting"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons"
import { usePodcastEpisodes } from "@/app/controllers/state/podcast-slice"
import {
  Event,
  Filter,
  Event as NostrEvent,
  SimplePool,
  getEventHash,
} from "nostr-tools"
import { useNostr } from "@/app/controllers/state/nostr-slice"
function Profile() {
  const primalNotes = usePrimalNotes()
  const nostrAccount = useAccountNostr()
  const primalActions = usePrimalActions()
  const primalProfiles = usePrimalProfiles()
  const primalNoteStats = usePrimalNoteStats()
  const primalSocket = usePrimalSocket()
  const podcastEpisodes = usePodcastEpisodes()

  const primalIsFetching = usePrimalIsFetching()
  const accountProfile = useAccountProfile()
  const [editProfileModalOn, setEditProfileModalOn] = useState(false)
  const [fetched, setFetched] = useState(false)
  const { nostrPool, nostrRelays } = useNostr()

  // ------------ VARIABLES ------------
  const pubkeyFromURL = getIdFromUrl(usePathname())
  primalActions.primalGetUserFeed(pubkeyFromURL)
  const isOwner = pubkeyFromURL === nostrAccount?.accountPublicKey
  const loadedProfile = isOwner ? accountProfile : primalProfiles[pubkeyFromURL]
  const [followsYou, setFollowsYou] = useState(false)
  const [youFollow, setYouFollow] = useState(false)

  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>({})
  const accountNostr = useAccountNostr()

  const episodes: {
    imgUrl: string
    description: string
    title: string
    episodeUrl: string
  }[] = []

  interface Profile {
    name: string
    picture: string
    display_name: string
    episodeUrl: string
  }
  // ------------ FUNCTIONS ------------

  //TODO Load Profile from ID

  const openEditor = useCallback(() => {
    if (isOwner) {
      setEditProfileModalOn(true)
    }
  }, [setEditProfileModalOn, isOwner])

  const closeEditor = useCallback(() => {
    setEditProfileModalOn(false)
  }, [setEditProfileModalOn])

  const renderNotes = () => {
    return Object.values(primalNotes).map(note => {
      if (note.pubkey !== pubkeyFromURL) {
        return null
      }
      const profile = primalProfiles[note.pubkey]
      const stats = primalNoteStats[note.id]

      if (!profile) {
        return null
      }

      return (
        <FeedPost key={note.id} note={note} profile={profile} stats={stats} />
      )
    })
  }

  const renderPodcasts = () => {
    Object.values(podcastEpisodes).map(podcast => {
      if (podcast.announcement.note.pubkey == pubkeyFromURL) {
        console.log(podcast)
        episodes.push({
          imgUrl: podcast.imageFilepath,
          description: podcast.description,
          title: podcast.title,
          episodeUrl: podcast.announcement.gate,
        })
      }
    })

    return (
      <div className="space-y-2 mt-4">
        {episodes.length > 0 && episodes.length < 5 && (
          <>
            <div className="w-full flex items-center justify-between">
              <p>Latest episodes</p>
              {/* TO IMPLEMENT */}
              {/* CREATE A PAGE FOR ALL EPISODES */}
              <Button className="text-sm/4 px-4 hidden" label="Show all..." />
            </div>
            <PodcastsCarrousel episodes={episodes} />
          </>
        )}
      </div>
    )
  }

  const renderEditor = () => {
    if (!isOwner) return null

    return (
      <>
        <Modal isOpen={editProfileModalOn}>
          <ProfileEditorForm onClose={closeEditor} />
        </Modal>
        <div className="flex gap-2 ml-auto">
          <Button onClick={openEditor} className="w-24" label="edit profile" />
        </div>
      </>
    )
  }

  async function followAccount() {
    try {
      const targetPubkey = pubkeyFromURL
      const myPubkey = nostrAccount?.accountPublicKey || ""
      const userFollows = await fetchFollowList(myPubkey)
      const isFollowing = userFollows.some(follow => follow === targetPubkey)
      if (isFollowing) {
        setYouFollow(true)

        return
      }

      const followEvent: Event = {
        kind: 3,
        tags: [["p", targetPubkey!]],
        content: "",
        sig: "",
        id: "",
        created_at: Math.floor(Date.now() / 1000),
        pubkey: accountNostr?.accountPublicKey!.toString() || "",
      }

      const signedEvent = await window.nostr.signEvent(followEvent)
      followEvent.sig = signedEvent.sig
      followEvent.id = getEventHash(followEvent)
      nostrPool.publish(nostrRelays, followEvent)
    } catch (error) {
      console.error("Error following account:", error)
    }
  }

  async function fetchFollowList(userPubkey: string): Promise<string[]> {
    const filter: Filter<number>[] = [
      {
        kinds: [3], // Filter for "follow" events
        authors: [userPubkey], // Your own events
        limit: 1000, // Adjust limit as needed (consider pagination if following many)
      },
    ]

    const events = await nostrPool.list(nostrRelays, filter)

    // Extract followed pubkeys
    const followedPubkeys = events.map(
      event => event.tags.find(tag => tag[0] === "p")?.[1]
    )
    const targetPubkey = pubkeyFromURL

    const isFollowing = followedPubkeys.some(follow => follow === targetPubkey)
    if (isFollowing) {
      console.log(`Already following ${targetPubkey}`)
      setYouFollow(true)
    }

    return followedPubkeys.filter(Boolean) as string[] // Filter out undefined values (in case of malformed events)
  }

  useEffect(() => {
    if (!accountNostr) return
    fetchFollowList(accountNostr.accountPublicKey!)
  }, [pubkeyFromURL, accountNostr])

  const renderFollowYouTag = () => {
    //Read events
    //Search events kind 3
    //Tags will be ["p", "logged in pubkey"]
    //If pubkey is in tags, then follows you , render tag
  }

  // ------------ USE EFFCTS ------------

  useEffect(() => {
    if (primalSocket && !fetched && !primalIsFetching) {
      primalActions.primalGetUserFeed(pubkeyFromURL)
      setFetched(true)
    }
  }, [primalSocket, primalIsFetching, fetched, pubkeyFromURL])

  return (
    <section className="flex flex-col">
      <div className="relative w-full flex md:h-80 h-40">
        <img
          src={loadedProfile?.picture ?? "https://placehold.co/400"}
          className="drop-shadow-md border rounded-full object-cover object-center absolute w-20 h-20 md:w-40 md:h-40 md:-bottom-16 -bottom-8 left-2 z-10"
          alt="profile picture"
        />
        <img
          src={loadedProfile?.banner ?? ""}
          alt=""
          className="drop-shadow-lg"
        />
        {/* TODO Add followers and following */}
        {/* <div className="absolute left-32 top-10">Followers / Following</div> */}
      </div>
      <div className="mt-2 ml-auto flex gap-2">
        <Button
          className="w-24"
          label={youFollow ? "Unfollow" : "Follow"}
          onClick={followAccount}
        />
        {renderEditor()}
      </div>{" "}
      <div className="mt-12 w-full flex flex-col space-y-1">
        <div className="text-buttonDefault flex items-center gap-1">
          <p className="text-lg font-semibold">
            {loadedProfile?.display_name || loadedProfile?.name}
          </p>
          {loadedProfile?.nip05 && (
            <FontAwesomeIcon icon={faCheckCircle} className="w-4" />
          )}
          <p className="text-buttonDisabled text-xs/4 ml-2 bg-buttonAccentHover px-2 py-[2px] rounded-md">
            {followsYou ?? false ? "follows you" : ""}
          </p>
        </div>
        <p className="text-buttonDisabled text-xs/4">
          {loadedProfile?.nip05 ?? ""}
        </p>
        <p className="font-light text-sm">{loadedProfile?.about}</p>
      </div>
      <div className="flex flex-row items-center gap-x-2 mt-4 justify-evenly">
        <div
          className={`flex flex-col items-center mt-4          
          ${true && "border-b-2 border-buttonAccentHover"}`}>
          <p className="text-buttonMuted font-semibold text-lg">1234</p>
          <p className="text-buttonDisabled text-xs">notes</p>
        </div>
        <div
          className={`flex flex-col items-center mt-4          
          ${false && "border-b-2 border-buttonAccentHover"}`}>
          <p className="text-buttonMuted font-semibold text-lg">1234</p>
          <p className="text-buttonDisabled text-xs">Replies</p>
        </div>
        <div
          className={`flex flex-col items-center mt-4          
          ${false && "border-b-2 border-buttonAccentHover"}`}>
          <p className="text-buttonMuted font-semibold text-lg">1234</p>
          <p className="text-buttonDisabled text-xs">zaps</p>
        </div>
        <div
          className={`flex flex-col items-center mt-4          
          ${false && "border-b-2 border-buttonAccentHover"}`}>
          <p className="text-buttonMuted font-semibold text-lg">1234</p>
          <p className="text-buttonDisabled text-xs">following</p>
        </div>
        <div
          className={`flex flex-col items-center mt-4          
          ${false && "border-b-2 border-buttonAccentHover"}`}>
          <p className="text-buttonMuted font-semibold text-lg">1234</p>
          <p className="text-buttonDisabled text-xs">followers</p>
        </div>
      </div>
      <hr className="mt-4 bg-red-500" />
      <div className="flex-col gap-2 mt-2 overflow-x-clip relative space-y-2">
        {renderPodcasts()}
      </div>
      <div className="space-y-2 mt-4">
        {/* <p>My posts...</p> */}

        {/* {filteredEvents.map(note => {



          return (
            <FeedPost
            key={note.id}
            note={note}
            profile={profile}
            stats={stats}
          />
            <FeedPost
              key={generatePrivateKey()}
              note={note}
              user={accountProfile?.name}
              content={note.content}
              userPfp={accountProfile?.picture}
              userProfile={accountProfile?.lud16}
            />
          )
        })} */}
        {renderNotes()}
      </div>
    </section>
  )
}

export default Profile
