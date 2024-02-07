import { Event as NostrEvent } from 'nostr-tools';
import { SimplePool } from 'nostr-tools';
import { StateCreator } from 'zustand';

export interface NotePageSlice {
    noteId: string | null;
    note: NostrEvent | null;
    noteFetching: boolean;
    noteError: string | null;
    actions: {
        setNoteId: (
            noteId: string,
            nostrPool: SimplePool,
            nostrRelays: string[]
        ) => void;
    }
}

const DEFAULT_STATE: NotePageSlice = {
    noteId: null,
    noteFetching: false,
    note: null,
    noteError: null,
    actions: {
        setNoteId: () => {},
    }
};

export const createTestSlice: StateCreator<
  NotePageSlice,
  [],
  [],
  NotePageSlice
> = (set, get) => {

    const reset = () => {
        set({ 
            noteId: null,
            note: null,
            noteError: null,
            noteFetching: false,
        });
    }
    
    const setNoteId = (
        noteId: string, 
        nostrPool: SimplePool, 
        nostrRelays: string[]
    ) => {
        reset();

        set({ noteId });

        // TODO start fetching
        nostrPool.get(
            nostrRelays,
            {
                ids: [noteId],
            }
        ).then((event) => {
            if(event){
                set({ note: event });
            } else {
                set({ noteError: "Note not found" });
            }
        }).finally(() => {
            set({ noteFetching: false });
        });

    }


    return {
        ...DEFAULT_STATE,
        actions: {
            setNoteId,
        }
    };
};
