import { Event as NostrEvent } from 'nostr-tools';
import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { PostGatedNoteIds, PostNoteState, postGatedNote } from 'nip108';



export interface PostGatedNoteCallbacks {
    onSuccess?: (ids: PostGatedNoteIds) => void;
    onError?: (error: string) => void;
    onClear?: () => void;
}
  
export interface PostGatedNoteSlice {

    postGatedNoteSubmit: (callbacks: PostGatedNoteCallbacks) => void,
    postGatedNoteClear: () => void,

    postGatedNoteIsRunning: boolean,
    postGatesNoteError?: string,

    postGatedNoteContent: string,
    postGatedNoteHandleContentChange: (event: any) => void,

    postGatesNoteAnnouncementContent: string,
    postGatesNoteHandleAnnouncementContentChange: (event: any) => void,

    postGatesNoteUnlockCost: number,
    postGatesNoteHandleUnlockCostChange: (event: any) => void,

    postGatedNoteState: PostNoteState,
    postGatedNotePublicKey?: string | undefined,
    postGatedNoteSignedGatedNote?: NostrEvent, 
    postGatedNoteSecret?: string,
    postGatedNoteSignedGate?: NostrEvent,
    postGatedNoteDidUploadGate?: boolean,
    postGatedNoteGateResponse?: string,
    postGatedNoteDidPublishGate?: boolean,
    postGatedNoteSignedAnnouncement?: NostrEvent,
}

// _state?: PostGatedNoteState;
// _setState: (state: PostGatedNoteState) => void;

// _publicKey?: string;
// _setPublicKey: (publicKey: string) => void;

// _signedGatedNote?: NostrEvent;
// _setSignedGatedNote: (signedNote: NostrEvent) => void;

// _secret?: string;
// _signedGate?: NostrEvent;
// _setSignedGate: (signedNote: NostrEvent, secret: string) => void;

// _didUploadGate?: boolean;
// _gateResponse?: string;
// _setGateResponse: (response: string, didUploadGate: boolean) => void;

// _didPublishGate?: boolean;
//   _setDidPublishGate: (didPublishGate: boolean) => void;

// _signedAnnouncement?: NostrEvent;
// _setSignedAnnouncement: (signedNote: NostrEvent) => void;


const DEFAULT_STATE: PostGatedNoteSlice = {
    postGatedNoteState: PostNoteState.IDLE,
    postGatedNoteIsRunning: false,
    postGatedNoteContent: '',
    postGatesNoteAnnouncementContent: '',
    postGatesNoteUnlockCost: 0,

    postGatedNoteHandleContentChange: () => {},
    postGatesNoteHandleAnnouncementContentChange: () => {},
    postGatesNoteHandleUnlockCostChange: () => {},

    postGatedNoteSubmit: () => {},
    postGatedNoteClear: () => {},
};

export const createPostNoteSlice: StateCreator<
  CombinedState & PostGatedNoteSlice,
  [],
  [],
  PostGatedNoteSlice
> = (set, get) => {

    const postGatedNoteHandleContentChange = (event: any) => {
        set({ postGatedNoteContent: event.target.value });
    }

    const postGatesNoteHandleAnnouncementContentChange = (event: any) => {
        set({ postGatesNoteAnnouncementContent: event.target.value });
    }

    const postGatesNoteHandleUnlockCostChange = (event: any) => {
        set({ postGatesNoteUnlockCost: event.target.value });
    }

    const postGatedNoteClear = () => {
        set({
            postGatedNoteState: PostNoteState.IDLE,
            postGatedNoteContent: '',
            postGatesNoteAnnouncementContent: '',
            postGatesNoteUnlockCost: 0,
            postGatedNotePublicKey: undefined,
            postGatedNoteSignedGatedNote: undefined,
            postGatedNoteSecret: undefined,
            postGatedNoteSignedGate: undefined,
            postGatedNoteDidUploadGate: undefined,
            postGatedNoteGateResponse: undefined,
            postGatedNoteDidPublishGate: undefined,
            postGatedNoteSignedAnnouncement: undefined,
        });
    }

    const postGatedNoteSubmit = async (callbacks: PostGatedNoteCallbacks) => {
        const { postGatedNoteIsRunning, postGatedNoteContent, postGatedNoteState, postGatedNotePublicKey, postGatedNoteSignedGatedNote, postGatedNoteSecret, postGatedNoteSignedGate, postGatedNoteDidUploadGate, postGatedNoteGateResponse, postGatedNoteDidPublishGate, postGatedNoteSignedAnnouncement, accountNIP07, nostrPool, nostrRelays } = get();

        if( postGatedNoteIsRunning ) return;

        const { onSuccess, onError, onClear } = callbacks;
        const runOnSuccess = onSuccess ? onSuccess : () => {};
        const runOnError = onError ? onError : () => {};
        const runOnClear = onClear ? onClear : () => {};

        try {

            if( !postGatedNoteContent ) throw new Error("Missing content");
            if( !accountNIP07 ) throw new Error("Missing NIP07");
            if( !nostrPool ) throw new Error("Missing pool");
            if( !nostrRelays ) throw new Error("Missing relays");

            set({ postNoteIsRunning: true });

            //TODO Finish
            // const ids = await postGatedNote({
            //     gatedNoteContent: postGatedNoteContent,
            //     announcementNoteContent: postGatedNote,
            //     cost: postGatesNoteUnlockCost,
            //     nip07: accountNIP07,
            //     pool: nostrPool,
            //     relays: nostrRelays,
            // });

            // Clear the form
            postGatedNoteClear();
            runOnClear();

            // Run the success callback
            // runOnSuccess(ids);

        } catch (error) {
            runOnError(`${error}`)
        } finally {
            set({ postNoteIsRunning: false });
        }

    };
   
    return {
        ...DEFAULT_STATE,
        postGatedNoteClear,
        postGatedNoteHandleContentChange,
        postGatesNoteHandleAnnouncementContentChange,
        postGatesNoteHandleUnlockCostChange,
        postGatedNoteSubmit,
    };
};
