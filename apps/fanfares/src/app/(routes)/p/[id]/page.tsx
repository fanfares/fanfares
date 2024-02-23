"use client"
import Button from "../../../components/Button"
import { FeedPost } from "../../../components/FeedPost"
import {
  usePrimalNoteStats,
  usePrimalNotes,
  usePrimalProfiles,
} from "../../../controllers/state/primal-slice"
import {
  useAccountNostr,
  useAccountProfile,
} from "../../../controllers/state/account-slice"
import { useCallback, useState } from "react"
import PodcastsCarrousel from "../../../components/PodcastsCarrousel"
import { Modal } from "../../../components/Modal"
import ProfileEditorForm from "../../../components/ProfileEditorForm"
import { getIdFromUrl } from "@/app/controllers/utils/formatting"
import { usePathname } from "next/navigation"

function Profile() {
  const primalNotes = usePrimalNotes()
  const nostrAccount = useAccountNostr()
  const primalProfiles = usePrimalProfiles()
  const primalNoteStats = usePrimalNoteStats()
  const accountProfile = useAccountProfile()
  const [editProfileModalOn, setEditProfileModalOn] = useState(false)

  // ------------ VARIABLES ------------
  const id = getIdFromUrl(usePathname())
  const isOwner = id === nostrAccount?.accountPublicKey
  const loadedProfile = isOwner ? accountProfile : primalProfiles[id]

  const episodes: { imgUrl: string; description: string; title: string }[] = []

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

  const renderEditor = () => {
    if (!isOwner) return null

    return (
      <>
        <Modal isOpen={editProfileModalOn}>
          <ProfileEditorForm onClose={closeEditor} />
        </Modal>
        <div className="flex gap-2 ml-auto">
          <Button onClick={openEditor} className="w-32" label="edit profile" />
        </div>
      </>
    )
  }

  return (
    <section className="container flex flex-col max-w-xl">
      <div className="relative w-full flex">
        <div className="absolute w-32 h-32">
          <img
            src={loadedProfile?.picture ?? "https://placehold.co/400"}
            className="drop-shadow-md rounded-full w-32 h-32 object-cover object-center absolute"
            alt="profile picture"
          />
        </div>
        {renderEditor()}
      </div>
      <div className="mt-36 w-full">
        <div className="text-buttonDefault">
          <p className="">{loadedProfile?.display_name ?? ""}</p>
        </div>
        <p className="text-buttonDisabled text-xs/4">
          {loadedProfile?.lud16 ?? ""}
        </p>
        <p className="text-buttonDisabled text-xs/4">
          {loadedProfile?.nip05 ?? ""}
        </p>
      </div>
      <div className="flex-col gap-2 mt-2 overflow-x-clip relative space-y-2">
        {episodes.length == 0 ? null : (
          <>
            <div className="w-full flex items-center justify-between">
              <p>My Podcasts...</p>
              <Button className="text-sm/4 px-4" label="Show all..." />
            </div>
            <PodcastsCarrousel episodes={episodes} />
          </>
        )}
      </div>
      <div className="space-y-2 mt-8">
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
