"use client"

import { usePrimalNoteStats, usePrimalNotes, usePrimalProfiles } from "@/app/controllers/state/primal-slice";
import { getIdFromUrl } from "@/app/controllers/utils/formatting";
import { usePathname } from "next/navigation";
import { useEffect } from "react";


export default function Page() {
    const primalNotes = usePrimalNotes();
    const primalProfiles = usePrimalProfiles();
    const primalNoteStats = usePrimalNoteStats();
    const id = getIdFromUrl(usePathname())

    // ------------ USE EFFECTS ------------
  
    const note = primalNotes[id];
    const profile = primalProfiles[note.pubkey];

    if(!note){
        return <div>Note not found</div>
    }

    if(!profile){
        return <div>Profile for event not found</div>
    }

  return <div>
        <h1>{profile.name} said:</h1>
        <p>{note.content}</p>
  </div>;
}