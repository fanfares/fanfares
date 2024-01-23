"use client"
import { generatePrivateKey } from "nostr-tools"
import { useAppState } from "../controllers/state/use-app-state"
import { FeedPost } from "./FeedPost"
import {
  usePrimalNotes,
  usePrimalProfiles,
  usePrimalNoteStats,
} from "../controllers/state/primal-slice"

export function Feed() {
  const primalNotes = usePrimalNotes()
  const primalProfiles = usePrimalProfiles()
  const primalNoteStats = usePrimalNoteStats()

  //TODO fix renders
  // console.log("Render Feed -- " + primalNotes.length);

  return (
    <>
      <h1 className="font-black text-center text-gray-100 text-xl/4 md:mt-4 md:text-start md:text-4xl">
        Nostr Universe{" "}
      </h1>
      {primalNotes.map(note => {
        const profile = primalProfiles[note.pubkey]
        const stats = primalNoteStats[note.id]
        if (!profile) {
          return null
        }

        return (
          <FeedPost
            userPfp={profile.picture}
            key={generatePrivateKey()}
            note={note}
            user={profile.name}
            content={note.content}
            userProfile={profile.lud16}
          />
        )
      })}
    </>
  )
}
