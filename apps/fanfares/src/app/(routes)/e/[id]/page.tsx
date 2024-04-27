"use client"

import { FeedPost } from "@/app/components/FeedPost";
import { usePrimalIsFetching, usePrimalNoteStats, usePrimalNotes, usePrimalProfiles } from "@/app/controllers/state/primal-slice";
import { getIdFromUrl } from "@/app/controllers/utils/formatting";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";
import { LottieLoading } from "../../../components/Lottie"

export default function Page() {
    const primalNotes = usePrimalNotes();
    const primalProfiles = usePrimalProfiles();
    const primalNoteStats = usePrimalNoteStats();
    const primalIsFetching = usePrimalIsFetching()
    const id = getIdFromUrl(usePathname())

    const renderLoading = () => {
        return (
        <div className="w-full h-full flex items-center">
            <Lottie className="w-20" animationData={LottieLoading} loop={true} />
            <p className="">Loading...</p>
        </div>
        )
    }

    console.log('primalIsFetching', primalIsFetching)

    // ------------ USE EFFECTS ------------
    try {
        const note = primalNotes[id];
        const stats = primalNoteStats[note.id]
        const profile = primalProfiles[note.pubkey];

        if(!note){
            return <div>Note not found</div>
        }

        if(!profile){
            return <div>Profile for event not found</div>
        }

        return (
            <div>
                <FeedPost key={note.id} note={note} profile={profile} stats={stats} />
            </div>
        )
    } catch (e) {
        return <>{renderLoading()}</>
    }
}