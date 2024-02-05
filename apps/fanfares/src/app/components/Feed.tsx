"use client"
import { generatePrivateKey } from "nostr-tools"
import { useAppState } from "../controllers/state/old/use-app-state"
import { FeedPost } from "./FeedPost"
import {
  usePrimalNotes,
  usePrimalProfiles,
  usePrimalNoteStats,
  usePrimalIsFetching
} from "../controllers/state/primal-slice"

export function Feed() {
  const primalNotes = usePrimalNotes()
  const primalProfiles = usePrimalProfiles()
  const primalNoteStats = usePrimalNoteStats()
  const primalIsFetching = usePrimalIsFetching();

  //TODO fix renders
  // console.log("Render Feed -- " + primalNotes.length);


  const renderLoading = () => {
    return <div>TODO Better Loading Screen Loading...</div>
  }

  const renderNotes = () => {
 return Object.values(primalNotes).map(note => {
  const profile = primalProfiles[note.pubkey]
  const stats = primalNoteStats[note.id]


  if (!profile) {
    return null
  }


  return (
    <FeedPost
      userPfp={profile.picture}
      key={note.id}
      note={note}
      user={profile.name}
      content={note.content}
      userProfile={profile.lud16}
    />
  )
})
  }

  return (
    <>
      <h1 className="font-black text-center text-gray-100 text-xl/4 md:mt-4 md:text-start md:text-4xl">
        Nostr Universe{" "}
      </h1>
      {primalIsFetching ? renderLoading() : renderNotes()}
    </>
  )
}
