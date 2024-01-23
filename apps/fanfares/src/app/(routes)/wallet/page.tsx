'use client';
import { useAppState } from "@/app/controllers/state/use-app-state";
import { Event as NostrEvent } from "nostr-tools";

export default function WalletPage(){

    //TODO Christian Fix User Notes
    return null;
    // const { gatePurchasedNotes } = useAppState();

    // const renderGateNote = (note: NostrEvent<number>) => {
    //     return <p key={note.id}>{note.content}</p>
    // }

    // return <section className="flex flex-col space-y-2">
    //     {gatePurchasedNotes.map(renderGateNote)}
    // </section>
}