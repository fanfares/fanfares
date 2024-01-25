"use client"
import { generatePrivateKey } from "nostr-tools"
import Button from "../components/Button"
import { useAppState } from "../controllers/state/old/use-app-state"
import { FeedPost } from "../components/FeedPost"
import { usePrimalNoteStats, usePrimalNotes, usePrimalProfiles } from "../controllers/state/primal-slice"

function Profile() {
  const primalNotes = usePrimalNotes();
  const primalProfiles = usePrimalProfiles();
  const primalNoteStats = usePrimalNoteStats();

  return (
    <section className="container flex flex-col max-w-xl">
      <div className="relative w-full flex">
        <img
          src="http://placebeard.it/640/480"
          className="drop-shadow-md rounded-full w-32 h-32 object-cover object-center absolute"
          alt=""
        />
        <div className="flex gap-2 ml-auto">
          <Button className="w-32" label="edit profile" />
        </div>
      </div>
      <div className="mt-28 w-full space-y-2">
        <div className="flex text-buttonDefault">
          <p className="">%Username Placeholder%</p>
          <span className="ml-auto font-thin">Joined at xyz</span>
        </div>
        <p className="text-buttonDisabled">%LUD16 Placeholder</p>
        <p className="text-buttonDisabled">%NPUB placeholder</p>
      </div>
      <div className="space-y-2 mt-4">
        {primalNotes.map(note => {
          const profile = primalProfiles[note.pubkey]
          const stats = primalNoteStats[note.id]

          return (
            <FeedPost
              key={generatePrivateKey()}
              note={note}
              user={profile?.name}
              content={note.content}
              userPfp={profile?.picture}
              userProfile={profile?.lud16}
            />
          )
        })}
      </div>
    </section>
  )
}

export default Profile
