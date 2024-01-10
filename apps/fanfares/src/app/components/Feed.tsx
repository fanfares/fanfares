"use client"
import { generatePrivateKey } from "nostr-tools"
import { useAppState } from "../controllers/state/use-app-state"
import { FeedPost } from "./FeedPost"

export function Feed() {
  const { primalNotes, primalProfiles, primalNoteStats } = useAppState()

  return primalNotes.map(note => {
    const profile = primalProfiles[note.pubkey]
    const stats = primalNoteStats[note.id]

    if (!profile) {
      return null
    }

    console.log(`Render ${note.id}`)

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
