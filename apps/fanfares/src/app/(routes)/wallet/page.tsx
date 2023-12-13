'use client';
import { useAppState } from "@/app/controllers/state/use-app-state";
import { Event as NostrEvent } from "nostr-tools";

export default function WalletPage(){
    const { gateFetch, gatePurchasedNotes } = useAppState();

    const onClick = () => {
        gateFetch();
    }

    const renderGateNote = (note: NostrEvent<number>) => {

        return <p key={note.id}>{note.content}</p>
    }

    return <section className="flex flex-col space-y-2">
        <p onClick={onClick} >Click Me For Gated Posts</p>
        {gatePurchasedNotes.map(renderGateNote)}
    </section>
}