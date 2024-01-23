"use client";

import { useAppState } from "@/app/controllers/state/use-app-state";
import { UserPageNote } from "@/app/controllers/state/user-page-slice";
import { createNoteUnsigned } from "nip108";
import React, { useEffect } from "react";

function UserNote(event: UserPageNote) {

    let content = <p>{event.event.content}</p>

    if(event.announcement){
        content = (
            <div>
                <p>🔓{event.announcement.note.content}🔓</p>
            </div>
        )
    }

    if(event.unlockedContent && event.announcement){
        content = (
            <div>
                <p>🔓{event.announcement.note.content}🔓</p>
                <p>🔑{event.unlockedContent.content}🔑</p>
            </div>
        )
    }

    return (
        <div className="m-5" id={event.event.id}>
            {content}
        </div>
    )
}

export default function UserPage() {

    return null;

    //TODO Christian Fix User Slice
//     const { userPageFetch, userPageIsFetching, userPageNotes, accountPublicKey, } = useAppState();

//     useEffect(() => {
//         if(accountPublicKey)
//             userPageFetch(accountPublicKey);
//     }, [accountPublicKey]);



//     if(userPageIsFetching)
//         return <div>Loading...</div>



//   return (
//     <div>
//         {Object.values(userPageNotes).sort((a, b)=>{
//             return b.event.created_at - a.event.created_at;
//         }).map(UserNote)}
//     </div>
//   );
}
