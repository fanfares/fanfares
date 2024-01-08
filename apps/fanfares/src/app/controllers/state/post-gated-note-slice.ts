import { Event as NostrEvent } from "nostr-tools";
import { StateCreator } from "zustand";
import { CombinedState } from "./use-app-state";
import { PostGatedNoteIds, PostGatedNoteState, postGatedNote } from "nip108";
import { GATE_SERVER } from "../nostr/nostr-defines";

export interface PostGatedNoteCallbacks {
  onSuccess?: (ids: PostGatedNoteIds) => void;
  onError?: (error: string) => void;
  onClear?: () => void;
}

export interface PostGatedNoteSlice {
  postGatedNoteSubmit: (callbacks: PostGatedNoteCallbacks) => void;
  postGatedNoteClear: () => void;

  postGatedNoteIsRunning: boolean;
  postGatesNoteError?: string;

  postGatedNoteLud16: string;
  postGatedNoteSetLud16: (event: any) => void;
  postGatedNoteHandleLud16Change: (event: any) => void;

  postGatedNoteContent: string;
  postGatedNoteHandleContentChange: (event: any) => void;

  postGatedNoteAnnouncementContent: string;
  postGatedNoteHandleAnnouncementContentChange: (event: any) => void;

  postGatedNoteUnlockCost: number;
  postGatedNoteHandleUnlockCostChange: (event: any) => void;

  postGatedNoteState: PostGatedNoteState;
  postGatedNotePublicKey?: string | undefined;
  postGatedNoteSignedGatedNote?: NostrEvent;
  postGatedNoteSecret?: string;
  postGatedNoteSignedGate?: NostrEvent;
  postGatedNoteDidUploadGate?: boolean;
  postGatedNoteGateResponse?: string;
  postGatedNoteDidPublishGate?: boolean;
  postGatedNoteSignedAnnouncement?: NostrEvent;
}

const DEFAULT_STATE: PostGatedNoteSlice = {
  postGatedNoteState: PostGatedNoteState.IDLE,
  postGatedNoteIsRunning: false,
  postGatedNoteContent: "",
  postGatedNoteAnnouncementContent: "",
  postGatedNoteLud16: "",
  postGatedNoteUnlockCost: 0,

  postGatedNoteSetLud16: () => {},
  postGatedNoteHandleLud16Change: () => {},
  postGatedNoteHandleContentChange: () => {},
  postGatedNoteHandleAnnouncementContentChange: () => {},
  postGatedNoteHandleUnlockCostChange: () => {},

  postGatedNoteSubmit: () => {},
  postGatedNoteClear: () => {},
};

export const createPostGatedNoteSlice: StateCreator<
  CombinedState & PostGatedNoteSlice,
  [],
  [],
  PostGatedNoteSlice
> = (set, get) => {

  const postGatedNoteSetLud16 = (lud16: string) => {
    console.log("postGatedNoteSetLud16Change", lud16);
    set({ postGatedNoteLud16: lud16 });
  };

  const postGatedNoteHandleLud16Change = (event: any) => {
    set({ postGatedNoteLud16: event.target.value });
  };

  const postGatedNoteHandleContentChange = (event: any) => {
    set({ postGatedNoteContent: event.target.value });
  };

  const postGatedNoteHandleAnnouncementContentChange = (event: any) => {
    set({ postGatedNoteAnnouncementContent: event.target.value });
  };

  const postGatedNoteHandleUnlockCostChange = (event: any) => {
    set({ postGatedNoteUnlockCost: event.target.value });
  };

  const postGatedNoteClear = () => {

    set({
      postGatedNoteState: PostGatedNoteState.IDLE,
      postGatedNoteContent: "",
      postGatedNoteAnnouncementContent: "",
      // Don't clear lud16
    //   postGatedNoteLud16: accountProfile?.lud16 || "",
      postGatedNoteUnlockCost: 10000,
      postGatedNotePublicKey: undefined,
      postGatedNoteSignedGatedNote: undefined,
      postGatedNoteSecret: undefined,
      postGatedNoteSignedGate: undefined,
      postGatedNoteDidUploadGate: undefined,
      postGatedNoteGateResponse: undefined,
      postGatedNoteDidPublishGate: undefined,
      postGatedNoteSignedAnnouncement: undefined,
    });
  };

  const postGatedNoteSubmit = async (callbacks: PostGatedNoteCallbacks) => {
    const {
      postGatedNoteIsRunning,
      postGatedNoteContent,
      postGatedNoteAnnouncementContent: postGatesNoteAnnouncementContent,
      postGatedNoteLud16,
      postGatedNoteState,
      postGatedNotePublicKey,
      postGatedNoteSignedGatedNote,
      postGatedNoteSecret,
      postGatedNoteSignedGate,
      postGatedNoteDidUploadGate,
      postGatedNoteGateResponse,
      postGatedNoteDidPublishGate,
      postGatedNoteSignedAnnouncement,
      postGatedNoteUnlockCost: postGatesNoteUnlockCost,
      accountNIP07,
      nostrPool,
      nostrRelays,
    } = get();

    if (postGatedNoteIsRunning) return;

    const { onSuccess, onError, onClear } = callbacks;
    const runOnSuccess = onSuccess ? onSuccess : () => {};
    const runOnError = onError ? onError : () => {};
    const runOnClear = onClear ? onClear : () => {};

    try {
      if (!postGatedNoteContent) throw new Error("Missing content");
      if (!accountNIP07) throw new Error("Missing NIP07");
      if (!nostrPool) throw new Error("Missing pool");
      if (!nostrRelays) throw new Error("Missing relays");

      set({ postNoteIsRunning: true });

    const ids = await postGatedNote({
        gatedNoteContent: postGatedNoteContent,
        announcementNoteContent: postGatesNoteAnnouncementContent,
        gateServer: GATE_SERVER,
        cost: postGatesNoteUnlockCost,
        lud16: postGatedNoteLud16,
        nip07: accountNIP07,
        publish: async (note: NostrEvent) => {
          await nostrPool.publish(nostrRelays, note);
        },
        _state: postGatedNoteState,
        _setState: (state: PostGatedNoteState) => {
          set({ postGatedNoteState: state });
        },
        _publicKey: postGatedNotePublicKey,
        _setPublicKey: (publicKey: string) => {
          set({ postGatedNotePublicKey: publicKey });
        },
        _signedGatedNote: postGatedNoteSignedGatedNote,
        _setSignedGatedNote: (signedNote: NostrEvent) => {
          set({ postGatedNoteSignedGatedNote: signedNote });
        },
        _secret: postGatedNoteSecret,
        _signedGate: postGatedNoteSignedGate,
        _setSignedGate: (signedNote: NostrEvent, secret: string) => {
          set({
            postGatedNoteSignedGate: signedNote,
            postGatedNoteSecret: secret,
          });
        },
        _didUploadGate: postGatedNoteDidUploadGate,
        _gateResponse: postGatedNoteGateResponse,
        _setGateResponse: (response: string, didUploadGate: boolean) => {
          set({
            postGatedNoteGateResponse: response,
            postGatedNoteDidUploadGate: didUploadGate,
          });
        },
        _didPublishGate: postGatedNoteDidPublishGate,
        _setDidPublishGate: (didPublishGate: boolean) => {
          set({ postGatedNoteDidPublishGate: didPublishGate });
        },
        _signedAnnouncement: postGatedNoteSignedAnnouncement,
        _setSignedAnnouncement: (signedNote: NostrEvent) => {
          set({ postGatedNoteSignedAnnouncement: signedNote });
        },
        debug: true,
      });

      // Clear the form
      postGatedNoteClear();
      runOnClear();

      // Run the success callback
      runOnSuccess(ids);
    } catch (error) {
      runOnError(`${error}`);
    } finally {
      set({ postNoteIsRunning: false });
    }
  };

  return {
    ...DEFAULT_STATE,
    postGatedNoteClear,
    postGatedNoteHandleLud16Change,
    postGatedNoteHandleContentChange,
    postGatedNoteSetLud16,
    postGatedNoteHandleAnnouncementContentChange,
    postGatedNoteHandleUnlockCostChange,
    postGatedNoteSubmit,
  };
};
