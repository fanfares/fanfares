'use client';
import { useAppState } from "@/app/controllers/state/use-app-state";
import { GatedNote } from "nip108";


export default function WalletPage(){
    const { gateNotes, gateFetch } = useAppState();

    const onClick = () => {
        gateFetch();
    }

    const renderGateNote = (note: GatedNote) => {

        return <p>{note.note.sig}</p>
    }

    return <section className="flex flex-col space-y-2">
        <p onClick={onClick} >Click Me For Gated Posts</p>
        {gateNotes.map(renderGateNote)}
    </section>
}