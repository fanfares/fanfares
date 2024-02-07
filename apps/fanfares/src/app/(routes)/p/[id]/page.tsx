"use client"
import { Event, generatePrivateKey } from "nostr-tools"
import Button from "../../../components/Button"
import { useAppState } from "../../../controllers/state/old/use-app-state"
import { FeedPost } from "../../../components/FeedPost"
import {
  usePrimalNoteStats,
  usePrimalNotes,
  usePrimalProfiles,
} from "../../../controllers/state/primal-slice"
import { useAccountProfile } from "../../../controllers/state/account-slice"
import Image from "next/image"
import { useEffect, useState } from "react"
import EpisodeCard from "../../../components/EpisodeCard"
import PodcastsCarrousel from "../../../components/PodcastsCarrousel"
import { Modal } from "../../../components/Modal"
import ProfileEditorForm from "../../../components/ProfileEditorForm"
import { getIdFromUrl } from "@/app/controllers/utils/formatting"
import { usePathname } from "next/navigation"

function Profile() {
  const primalNotes = usePrimalNotes()
  const primalProfiles = usePrimalProfiles()
  const primalNoteStats = usePrimalNoteStats()
  const accountProfile = useAccountProfile()
  const [editProfileModalOn, setEditProfileModalOn] = useState(false)

  const id = getIdFromUrl(usePathname())
  const profile = primalProfiles[id]

  // const [filteredEvents, setFilteredEvents] = useState<Event<1>[]>([])

  // useEffect(() => {
  //   const filtered = primalNotes.filter(
  //     event => event.pubkey === accountProfile?.pubkey
  //   )

  //   setFilteredEvents(filtered)
  // }, [primalNotes, accountProfile])

  const episodes = [
    {
      imgUrl: "https://m.primal.net/HZpV.png",
      description: "Description 1",
      title: "Title 1",
    },
    {
      imgUrl: "https://m.primal.net/HZpV.png",
      description: "Description 2",
      title: "Title 2",
    },
    {
      imgUrl: "https://m.primal.net/HZpV.png",
      description: "Description 3",
      title: "Title 3",
    },
    {
      imgUrl: "https://m.primal.net/HZpV.png",
      description: "Description 4",
      title: "Title 4",
    },

    {
      imgUrl: "https://m.primal.net/HZpV.png",
      description: "Description 5",
      title: "Title 5",
    },
    {
      imgUrl: "https://m.primal.net/HZpV.png",
      description: "Description 6",
      title: "Title 6",
    },
    {
      imgUrl: "https://m.primal.net/HZpV.png",
      description: "Description 7",
      title: "Title 8",
    },
  ]

  const renderNotes = () => {
    return Object.values(primalNotes).map(note => {
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

  return (
    <section className="container flex flex-col max-w-xl">
      <div className="relative w-full flex">
        <div className="absolute w-32 h-32">
          <img
            src={accountProfile?.picture}
            className="drop-shadow-md rounded-full w-32 h-32 object-cover object-center absolute"
            alt="profile picture"
          />
        </div>
        <Modal isOpen={editProfileModalOn}>
          <ProfileEditorForm />
        </Modal>
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={() => setEditProfileModalOn(!editProfileModalOn)}
            className="w-32"
            label="edit profile"
          />
        </div>
      </div>
      <div className="mt-28 w-full">
        <div className="text-buttonDefault">
          <p className="">{accountProfile?.display_name}</p>
        </div>
        <p className="text-buttonDisabled text-xs/4">{accountProfile?.lud16}</p>
        <p className="text-buttonDisabled text-xs/4">{accountProfile?.nip05}</p>
      </div>
      <div className="flex-col gap-2 mt-2 overflow-x-clip relative space-y-2">
        <div className="w-full flex items-center justify-between">
          <p>Podcasts</p>
          <Button className="text-sm/4 px-4" label="Show all..." />
        </div>

        <PodcastsCarrousel episodes={episodes} />
      </div>
      <div className="space-y-2 mt-8">
        <p>My posts...</p>

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


// "use client"

// import {
//   usePrimalNoteStats,
//   usePrimalNotes,
//   usePrimalProfiles,
// } from "@/app/controllers/state/primal-slice"
// import { getIdFromUrl } from "@/app/controllers/utils/formatting"
// import { usePathname } from "next/navigation"
// import { useEffect } from "react"
// import Lottie from "lottie-react"

// export default function Page() {
//   const primalNotes = usePrimalNotes()
//   const primalProfiles = usePrimalProfiles()
//   const primalNoteStats = usePrimalNoteStats()
//   const id = getIdFromUrl(usePathname())

//   // ------------ USE EFFECTS ------------

//   const profile = primalProfiles[id]

//   if (!profile) {
//     return <div>Profile not found</div>
//   }

//   return (
//     <div>
//       {/* <Lottie className="w-10" animationData={lottie} loop={true} /> */}
//       Page of {profile.name}
//     </div>
//   )
// }
