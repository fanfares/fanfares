"use client";
import { useAppState } from "../controllers/state/use-app-state";
import { FeedPost } from "./FeedPost";

export function Feed() {
  const { primalNotes, primalProfiles, primalNoteStats } = useAppState();


  return primalNotes.map((note) => {
    const profile = primalProfiles[note.pubkey];
    const stats = primalNoteStats[note.id];

    if (!profile) { return null; }
    console.log(stats);

    return (
      <FeedPost
        key={note.id}
        user={profile.name}
        content={note.content}
        userPfp={profile.picture}
      />
    );
  });
}
