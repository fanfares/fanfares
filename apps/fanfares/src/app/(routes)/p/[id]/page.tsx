"use client"

import {
  usePrimalNoteStats,
  usePrimalNotes,
  usePrimalProfiles,
} from "@/app/controllers/state/primal-slice"
import { getIdFromUrl } from "@/app/controllers/utils/formatting"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import Lottie from "lottie-react"
import lottie from "./lottie.json"

export default function Page() {
  const primalNotes = usePrimalNotes()
  const primalProfiles = usePrimalProfiles()
  const primalNoteStats = usePrimalNoteStats()
  const id = getIdFromUrl(usePathname())

  // ------------ USE EFFECTS ------------

  const profile = primalProfiles[id]

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div>
      <Lottie className="w-10" animationData={lottie} loop={true} />
      Page of {profile.name}
    </div>
  )
}
