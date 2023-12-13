import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { Event as NostrEvent } from 'nostr-tools';
import { GatedNote, AnnouncementNote, KeyNote, NIP_108_KINDS, eventToKeyNote, eventToGatedNote, eventToAnnouncementNote, unlockGatedNote } from 'nip108';

// First, let's create the ability to see all of the gated posts you have purchased
// So we will fetch by the gate key, and then we will fetch the gated posts
export interface GateSlice {

    gateFetch: () => void,

    gatePurchasedNotes: NostrEvent<number>[],
    gateNotes: GatedNote[],
    gateAnnouncements: {[key: string]: AnnouncementNote},
    gateKeys: {[key: string]: KeyNote},
}

const DEFAULT_STATE: GateSlice = {
    gateFetch: () => {},
    gatePurchasedNotes: [],
    gateNotes: [],
    gateAnnouncements: {},
    gateKeys: {},
};

export const createGateSlice: StateCreator<
  CombinedState & GateSlice,
  [],
  [],
  GateSlice
> = (set, get) => {
    
    const gateFetch = () => {
        const pool = get().nostrPool;
        const relays = get().nostrRelays;
        const publicKey = get().accountPublicKey;
        const nip04 = get().accountNIP07?.nip04;

        if(!nip04){ 
            alert("You must have a NIP-04 account to view gated posts");
            return;
        }

        if(!pool || !relays || !publicKey) return;

        pool.list(relays, [
            { 
                kinds: [NIP_108_KINDS.key],
                authors: [publicKey],
            }
        ]).then(async (rawKeys) => {
            const keys = rawKeys.map(eventToKeyNote)

            const keyMap: {[key: string]: KeyNote} = {};
            const gates: string[] = [];


            
            for (const key of keys) {
                try {
                    const secret = await get().accountNIP07?.nip04?.decrypt(publicKey, key.note.content);
    
                    if(!secret) continue;
                    keyMap[key.gate] = {
                        ...key,
                        unlockedSecret: secret,
                    };
                    gates.push(key.gate);
                } catch (error) {
                    console.log("error", error);
                }
            }

            // pool.list(relays, [
            //     {
            //         '#e': gates,
            //         kinds: [NIP_108_KINDS.announcement],
            //     }
            // ]).then((rawAnnouncements)=>{
            //         const announcements = rawAnnouncements.map(eventToAnnouncementNote);

            //         const announcementMap: {[key: string]: AnnouncementNote} = {};
            //         for (const announcement of announcements) {
            //             announcementMap[announcement.gate] = announcement;
            //         }

            //         set({ gateAnnouncements: announcementMap });
            // });

            pool.list(relays, [
                {
                    ids: gates,
                }
            ]).then((rawGates)=>{
                const gates = rawGates.map(eventToGatedNote);

                const unlockedNotes = gates.map((gate) => {
                    const key = keyMap[gate.note.id];
                    if(!key || !key.unlockedSecret) return null;

                    return unlockGatedNote(gate.note, key.unlockedSecret);
                }).filter((note) => note !== null) as NostrEvent<number>[];

                set({ gatePurchasedNotes: unlockedNotes });
                set({ gateNotes: gates });
            })

            set({ gateKeys: keyMap });
        });

    }

    return {
        ...DEFAULT_STATE,
        gateFetch,
    };
};
