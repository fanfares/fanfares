"use client"
import { generatePrivateKey } from "nostr-tools"
import { useAppState } from "../controllers/state/use-app-state"
import { FeedPost } from "./FeedPost"
import { usePrimalNotes, usePrimalProfiles, usePrimalNoteStats } from "../controllers/state/primal-slice";

export function Feed() {
  const primalNotes = usePrimalNotes();
  const primalProfiles = usePrimalProfiles();
  const primalNoteStats = usePrimalNoteStats();

  //TODO fix renders
  // console.log("Render Feed -- " + primalNotes.length);

  return primalNotes.map(note => {
    const profile = primalProfiles[note.pubkey]
    const stats = primalNoteStats[note.id]

    if (!profile) {
      return null
    }

    return (
      <FeedPost
        key={generatePrivateKey()}
        note={note}
        user={profile.name}
        content={note.content}
        userPfp={profile.picture}
        userProfile={profile.lud16}
      />
    )
  })
}
