import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { Event as NostrEvent } from 'nostr-tools';
import { AnnouncementNote, GatedNote, KeyNote, NIP_108_KINDS, eventToAnnouncementNote, eventToGatedNote, eventToKeyNote, unlockGatedNote, unlockGatedNoteFromKeyNoteNIP07 } from 'nip108';


export interface UserPageNote {
    kind: number,
    event: NostrEvent<number>,
    announcement?: AnnouncementNote,
    gate?: GatedNote,
    key?: KeyNote,
    unlockedContent?: NostrEvent<number>,
}
export interface UserPageNotes {
    [key: string]: UserPageNote
}
export interface UserPageSlice {
    userPageIsFetching: boolean,
    userPageFetch: (publicKey: string) => void,
    userPageNotes: UserPageNotes
}

const DEFAULT_STATE: UserPageSlice = {
    userPageIsFetching: false,
    userPageFetch: (publicKey: string) => {},
    userPageNotes: {},
};

export const createUserPageSlice: StateCreator<
  CombinedState & UserPageSlice,
  [],
  [],
  UserPageSlice
> = (set, get) => {

    const userPageFetch = (publicKey: string) => {

        const { nostrPool, nostrRelays, userPageIsFetching } = get();

        if(userPageIsFetching) throw new Error('userPageIsFetching is true');
        if(!publicKey) throw new Error('pubkey is undefined');
        if(!nostrPool) throw new Error('nostrPool is undefined');
        if(!nostrRelays) throw new Error('nostrRelays is undefined');

        set({ userPageIsFetching: true });

        nostrPool.list(nostrRelays, [
            {
                kinds: [1, NIP_108_KINDS.announcement],
                authors: [publicKey],
                limit: 100,
            }
        ]).then((events) => {
            const notes: UserPageNotes = {};
            const gatesToFetch: string[] = [];
            const keyFilters = [];

            for(const event of events) {
                if(event.kind === NIP_108_KINDS.announcement) {
                    const announcement = eventToAnnouncementNote(event);
                    gatesToFetch.push(announcement.gate);
                    notes[announcement.gate] = {
                        kind: event.kind,
                        event: event,
                        announcement: announcement,
                    };
                    // keyFilters.push({
                    //     ids: [announcement.gate],
                    // })
                    keyFilters.push({
                        kinds: [NIP_108_KINDS.key],
                        authors: [publicKey],
                        '#e': [announcement.gate],
                    });
                } else {
                    notes[event.id] = {
                        kind: event.kind,
                        event: event,
                    };   
                }
            }

            set({ userPageNotes: notes });

            console.log('gates to fetch', gatesToFetch);
            console.log('key filters', keyFilters);
            const littleGates = gatesToFetch.splice(0, 30);
            nostrPool.list(nostrRelays, [
                {
                    ids: littleGates,
                },
                ...keyFilters,
            ]).then((gatesAndKeys) => {
                const oldNotes = get().userPageNotes;
                const newNotes: UserPageNotes = {};
                const gatesToUnlock: string[] = [];

                const keys = gatesAndKeys.filter((event) => event.kind === NIP_108_KINDS.key);
                const gates = gatesAndKeys.filter((event) => event.kind === NIP_108_KINDS.gate);

                console.log('gates and keys', gatesAndKeys);

                for(const rawGate of gates) {

                    const gate = eventToGatedNote(rawGate);
                    const key = keys.find((rawKey) => {
                        const key = eventToKeyNote(rawKey);
                        return key.gate === gate.note.id;
                    })

                    newNotes[gate.note.id] = {
                        ...oldNotes[gate.note.id],
                        gate: gate,
                        key: key ? eventToKeyNote(key) : undefined,
                    }

                    if(key) gatesToUnlock.push(gate.note.id);

                }

                set({ userPageNotes: {
                    ...oldNotes,
                    ...newNotes,
                } });

                const nip07 = get().accountNIP07;

                if(nip07 && nip07.nip04){
                    for(const gateToUnlock of gatesToUnlock) {
                        const gate = newNotes[gateToUnlock].gate;
                        const key = newNotes[gateToUnlock].key;

                        if(!gate || !key) continue;

                        unlockGatedNoteFromKeyNoteNIP07(
                            nip07,
                            key.note,
                            gate.note
                        ).then((unlockedNote) => {
                            const oldNotes = get().userPageNotes;
                            const newNotes: UserPageNotes = {};

                            newNotes[gate.note.id] = {
                                ...oldNotes[gate.note.id],
                                unlockedContent: unlockedNote,
                            }

                            set({ userPageNotes: {
                                ...oldNotes,
                                ...newNotes,
                            } });

                            console.log('unlocked note', unlockedNote);
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                
                }

            }).catch((error) => {
                console.error(error);
            });

        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            set({ userPageIsFetching: false });
        });
        
    }

    return {
        ...DEFAULT_STATE,
        userPageFetch,
    };
};
