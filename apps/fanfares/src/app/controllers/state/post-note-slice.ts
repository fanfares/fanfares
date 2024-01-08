import { Event as NostrEvent } from 'nostr-tools';
import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { PostNoteState, postNote } from 'nip108';


export interface PostNoteCallbacks {
    onSuccess?: (id: string) => void;
    onError?: (error: string) => void;
    onClear?: () => void;
}
  
export interface PostNoteSlice {

    postNoteSubmit: (callbacks: PostNoteCallbacks) => void,
    postNoteClear: () => void,

    postNoteIsRunning: boolean,
    postNoteError?: string,

    postNoteContent: string,
    postNoteHandleContentChange: (event: any) => void,

    postNoteState: PostNoteState,
    postNotePublicKey?: string | undefined,
    postNoteSignedNote?: NostrEvent, 
}

const DEFAULT_STATE: PostNoteSlice = {
    postNoteState: PostNoteState.IDLE,
    postNoteIsRunning: false,
    postNoteContent: '',

    postNoteSubmit: () => {},
    postNoteClear: () => {},
    postNoteHandleContentChange: () => {},
};

export const createPostNoteSlice: StateCreator<
  CombinedState & PostNoteSlice,
  [],
  [],
  PostNoteSlice
> = (set, get) => {

    const postNoteHandleContentChange = (event: any) => {
        set({ postNoteContent: event.target.value });
    }

    const postNoteClear = () => {
        set({
            postNoteState: PostNoteState.IDLE,
            postNoteContent: '',
            postNotePublicKey: undefined,
            postNoteSignedNote: undefined,
        });
    }

    const postNoteSubmit = async (callbacks: PostNoteCallbacks) => {
        const { postNoteIsRunning, postNoteContent, postNoteState, postNotePublicKey, postNoteSignedNote, accountNIP07, nostrPool, nostrRelays } = get();

        if( postNoteIsRunning ) return;

        const { onSuccess, onError, onClear } = callbacks;
        const runOnSuccess = onSuccess ? onSuccess : () => {};
        const runOnError = onError ? onError : () => {};
        const runOnClear = onClear ? onClear : () => {};

        try {

            if( !postNoteContent ) throw new Error("Missing content");
            if( !accountNIP07 ) throw new Error("Missing NIP07");
            if( !nostrPool ) throw new Error("Missing pool");
            if( !nostrRelays ) throw new Error("Missing relays");

            set({ postNoteIsRunning: true });

            const id = await postNote({
                content: postNoteContent,
                nip07: accountNIP07,
                publish: async function (note: NostrEvent<number>): Promise<void> {
                    await nostrPool.publish(nostrRelays, note);
                },
                _state: postNoteState,
                _setState: function (state: PostNoteState): void {
                    set({ postNoteState: state });
                },
                _publicKey: postNotePublicKey,
                _setPublicKey: function (publicKey: string): void {
                    set({ postNotePublicKey: publicKey });
                },
                _signedNote: postNoteSignedNote,
                _setSignedNote: function (signedNote: NostrEvent<number>): void {
                    set({ postNoteSignedNote: signedNote });
                },
                debug: true,
            })

            // Clear the form
            postNoteClear();
            runOnClear();

            // Run the success callback
            runOnSuccess(id);

        } catch (error) {
            runOnError(`${error}`)
        } finally {
            set({ postNoteIsRunning: false });
        }

    };
   
    return {
        ...DEFAULT_STATE,
        postNoteClear,
        postNoteSubmit,
        postNoteHandleContentChange,
    };
};
