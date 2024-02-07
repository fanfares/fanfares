"use client"
import { generatePrivateKey } from "nostr-tools"
import { useAppState } from "../controllers/state/old/use-app-state"
import { FeedPost } from "./FeedPost"
import {
  usePrimalNotes,
  usePrimalProfiles,
  usePrimalNoteStats,
  usePrimalIsFetching,
} from "../controllers/state/primal-slice"
import Lottie from "lottie-react"
import { LottieLoading } from "./Lottie"

export function Feed() {
  const primalNotes = usePrimalNotes()
  const primalProfiles = usePrimalProfiles()
  const primalNoteStats = usePrimalNoteStats()
  const primalIsFetching = usePrimalIsFetching()

  //TODO fix renders
  // console.log("Render Feed -- " + primalNotes.length);

  const renderLoading = () => {
    return (
      <div className="w-full h-full flex items-center">
        <Lottie className="w-20" animationData={LottieLoading} loop={true} />
        <p className="">Loading...</p>
      </div>
    )
  }

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
    <>
      <h1 className="font-black text-center text-gray-100 text-xl/4 md:mt-4 md:text-start md:text-4xl">
        Nostr Universe{" "}
      </h1>
      {primalIsFetching ? renderLoading() : renderNotes()}
    </>
  )
}
