import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { GatedNote, AnnouncementNote, KeyNote, NIP_108_KINDS, eventToKeyNote, eventToGatedNote } from 'nip108';

export interface GateSlice {

    gateFetch: () => void,

    gateNotes: GatedNote[],
    gateAnnouncements: {[key: string]: AnnouncementNote},
    gateKeys: {[key: string]: KeyNote},
}

const DEFAULT_STATE: GateSlice = {
    gateFetch: () => {},
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

        if(!pool || !relays || !publicKey) return;

        pool.list(relays, [
            { 
                kinds: [NIP_108_KINDS.key],
                authors: [publicKey],
            }
        ]).then((rawKeys) => {
            const keys = rawKeys.map(eventToKeyNote)

            const keyMap: {[key: string]: KeyNote} = {};
            const gates: string[] = [];
            for (const key of keys) {
                keyMap[key.gate] = key;
                gates.push(key.gate);
            }

            pool.list(relays, [
                {
                    ids: gates,
                }
            ]).then((rawGates)=>{
                const gates = rawGates.map(eventToGatedNote);
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
