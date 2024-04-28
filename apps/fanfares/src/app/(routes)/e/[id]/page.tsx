"use client"

import { FeedPost } from "@/app/components/FeedPost";
import { usePrimalActions, usePrimalIsFetching, usePrimalNoteStats, usePrimalNotes, usePrimalProfiles, usePrimalSocket } from "@/app/controllers/state/primal-slice";
import { getIdFromUrl } from "@/app/controllers/utils/formatting";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";
import { LottieLoading } from "../../../components/Lottie"
import { JSX, useEffect, useState } from "react";
import { NostrPostStats } from "@/app/controllers/primal/primalHelpers";
import { NostrProfile } from "utils";
import { get } from "http";
import { Event } from "nostr-tools";

export default function Page() {
    const primalNotes = usePrimalNotes();
    const primalProfiles = usePrimalProfiles();
    const primalNoteStats = usePrimalNoteStats();
    const primalSocket = usePrimalSocket();
    const primalIsFetching = usePrimalIsFetching()
    const primalActions = usePrimalActions()
    const id = getIdFromUrl(usePathname())

    const [stats, setStats] = useState<NostrPostStats>()
    const [profile, setProfile] = useState<NostrProfile>()

    const renderLoading = () => {
        return (
        <div className="w-full h-full flex items-center">
            <Lottie className="w-20" animationData={LottieLoading} loop={true} />
            <p className="">Loading...</p>
        </div>
        )
    }

    const getReplies = () => {
        const replies: JSX.Element[] = []
        Object.keys(primalNotes).map((key) => {
            const note = primalNotes[key]
            if (note.tags.find((tag: string[]) => tag[0] === 'e' && tag[1] === id)
            && primalProfiles[note.pubkey] && primalNoteStats[note.id]
            ){
                replies.push(<FeedPost key={note.id} note={note} profile={primalProfiles[note.pubkey]} stats={primalNoteStats[note.id]} />)
            }
        })
        return replies
    }

    useEffect(() => {
        if (primalSocket){
            primalActions.primalGetReplies(id)
        }
    }, [primalSocket, primalIsFetching, id])

    const note = primalNotes[id]

    useEffect(() => {
        if (note){
            // console.log('stats', primalNoteStats[note.id], 'profile', primalProfiles[note.pubkey])
            const stats = primalNoteStats[note.id]
            const profile = primalProfiles[note.pubkey]
            setStats(stats)
            setProfile(profile)
        }
    }, [note, primalNoteStats, primalProfiles])

    if(!note){
        return <>{renderLoading()}</>
        return <div>Note not found</div>
    }

    if(!profile){
        return <div>Profile for event not found</div>
    }

    return (
        <div id="root-note">
            <FeedPost key={note.id} note={note} profile={profile} stats={stats} />
            <div id="reply-notes">
                {getReplies()}
            </div>
        </div>
    )
}

function primalGetReplies(id: string) {
    throw new Error("Function not implemented.");
}
