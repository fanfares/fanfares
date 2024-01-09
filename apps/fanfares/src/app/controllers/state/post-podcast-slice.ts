import { Event as NostrEvent, generatePrivateKey } from "nostr-tools";
import { StateCreator } from "zustand";
import { CombinedState } from "./use-app-state";
import { PostGatedNoteIds, PostGatedNoteState, postGatedNote } from "nip108";
import { GATE_SERVER } from "../nostr/nostr-defines";
import { uploadToShdwDrive } from "../shdw/upload";

export type PostPodcastState = PostGatedNoteState | "UPLOADING_FILES";

export interface PostPodcastValues {
  ids: PostGatedNoteIds,
  urls: string[]
}

export interface PostPodcastCallbacks {
  onSuccess?: (values: PostPodcastValues) => void;
  onError?: (error: string) => void;
  onClear?: () => void;
}

export interface PostPodcastSlice {
  postPodcastSubmit: (callbacks: PostPodcastCallbacks) => void;
  postPodcastClear: () => void;

  postPodcastHandleFileChange: (event: any) => void;
  postPodcastUploadFiles: File[];
  postPodcastUploadUrls: string[];

  postPodcastIsRunning: boolean;
  postGatesNoteError?: string;

  postPodcastLud16: string;
  postPodcastSetLud16: (event: any) => void;
  postPodcastHandleLud16Change: (event: any) => void;

  postPodcastContent: string;
  postPodcastHandleContentChange: (event: any) => void;

  postPodcastAnnouncementContent: string;
  postPodcastHandleAnnouncementContentChange: (event: any) => void;

  postPodcastUnlockCost: number;
  postPodcastHandleUnlockCostChange: (event: any) => void;

  postPodcastState: PostPodcastState;
  postPodcastPublicKey?: string | undefined;
  postPodcastSignedGatedNote?: NostrEvent;
  postPodcastSecret?: string;
  postPodcastSignedGate?: NostrEvent;
  postPodcastDidUploadGate?: boolean;
  postPodcastGateResponse?: string;
  postPodcastDidPublishGate?: boolean;
  postPodcastSignedAnnouncement?: NostrEvent;
}

const DEFAULT_STATE: PostPodcastSlice = {
  postPodcastState: "IDLE",
  postPodcastIsRunning: false,
  postPodcastContent: "",
  postPodcastAnnouncementContent: "",
  postPodcastLud16: "",
  postPodcastUnlockCost: 0,

  postPodcastUploadFiles: [],
  postPodcastUploadUrls: [],

  postPodcastHandleFileChange: (event: any) => {},
  postPodcastSetLud16: () => {},
  postPodcastHandleLud16Change: () => {},
  postPodcastHandleContentChange: () => {},
  postPodcastHandleAnnouncementContentChange: () => {},
  postPodcastHandleUnlockCostChange: () => {},

  postPodcastSubmit: () => {},
  postPodcastClear: () => {},
};

export const createPostPodcastSlice: StateCreator<
  CombinedState & PostPodcastSlice,
  [],
  [],
  PostPodcastSlice
> = (set, get) => {

  const postPodcastHandleFileChange = (event: any) => {
    console.log("postPodcastHandleFileChange");
    const fileList = event.target.files as FileList;
    const uploadFiles = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (!file) continue;

      uploadFiles.push(file);
    }

    console.log(uploadFiles);

    set({ postPodcastUploadFiles: uploadFiles });
  };

  const postPodcastSetLud16 = (lud16: string) => {
    set({ postPodcastLud16: lud16 });
  };

  const postPodcastHandleLud16Change = (event: any) => {
    set({ postPodcastLud16: event.target.value });
  };

  const postPodcastHandleContentChange = (event: any) => {
    set({ postPodcastContent: event.target.value });
  };

  const postPodcastHandleAnnouncementContentChange = (event: any) => {
    set({ postPodcastAnnouncementContent: event.target.value });
  };

  const postPodcastHandleUnlockCostChange = (event: any) => {
    set({ postPodcastUnlockCost: event.target.value });
  };

  const postPodcastClear = () => {

    set({
      postPodcastState: "IDLE",
      postPodcastContent: "",
      postPodcastAnnouncementContent: "",
      // Don't clear lud16
    //   postPodcastLud16: accountProfile?.lud16 || "",
      postPodcastUnlockCost: 10000,
      postPodcastPublicKey: undefined,
      postPodcastSignedGatedNote: undefined,
      postPodcastSecret: undefined,
      postPodcastSignedGate: undefined,
      postPodcastDidUploadGate: undefined,
      postPodcastGateResponse: undefined,
      postPodcastDidPublishGate: undefined,
      postPodcastSignedAnnouncement: undefined,
    });
  };

  const postPodcastSubmit = async (callbacks: PostPodcastCallbacks) => {
    const {
      postPodcastUploadFiles,
      postPodcastIsRunning,
      postPodcastContent,
      postPodcastAnnouncementContent,
      postPodcastLud16,
      postPodcastState,
      postPodcastPublicKey,
      postPodcastSignedGatedNote,
      postPodcastSecret,
      postPodcastSignedGate,
      postPodcastDidUploadGate,
      postPodcastGateResponse,
      postPodcastDidPublishGate,
      postPodcastSignedAnnouncement,
      postPodcastUnlockCost,
      accountNIP07,
      nostrPool,
      nostrRelays,
    } = get();

    if (postPodcastIsRunning) return;

    const { onSuccess, onError, onClear } = callbacks;
    const runOnSuccess = onSuccess ? onSuccess : () => {};
    const runOnError = onError ? onError : () => {};
    const runOnClear = onClear ? onClear : () => {};

    try {
      if (!postPodcastLud16) throw new Error("Missing lud16");
      if (!postPodcastUnlockCost) throw new Error("Missing unlock cost");
      if (!postPodcastAnnouncementContent) throw new Error("Missing announcement");
      if (!postPodcastUploadFiles || postPodcastUploadFiles.length === 0) throw new Error("Missing files");
      if (!postPodcastContent) throw new Error("Missing content");
      if (!accountNIP07) throw new Error("Missing NIP07");
      if (!nostrPool) throw new Error("Missing pool");
      if (!nostrRelays) throw new Error("Missing relays");

      set({ postNoteIsRunning: true });

    // Upload Files
    if( postPodcastState === "UPLOADING_FILES" || postPodcastState === "IDLE"){
      set({ postPodcastState: "UPLOADING_FILES" });

      console.log(postPodcastUploadFiles);

      const prefix = generatePrivateKey();
      const fileUrls = await uploadToShdwDrive(postPodcastUploadFiles, prefix);

      if( fileUrls.length !== postPodcastUploadFiles.length ) throw new Error(`Failed to upload files, ${fileUrls} !== ${postPodcastUploadFiles}`);

      set({ postPodcastState: "GETTING_PUBLIC_KEY", postPodcastUploadUrls: fileUrls });
    }


    //TODO construct gated note.

    const ids = await postGatedNote({
        gatedNoteContent: postPodcastContent,
        announcementNoteContent: postPodcastAnnouncementContent,
        gateServer: GATE_SERVER,
        cost: postPodcastUnlockCost,
        lud16: postPodcastLud16,
        nip07: accountNIP07,
        publish: async (note: NostrEvent) => {
          await nostrPool.publish(nostrRelays, note);
        },
        _state: postPodcastState as PostGatedNoteState,
        _setState: (state: PostGatedNoteState) => {
          set({ postPodcastState: state });
        },
        _publicKey: postPodcastPublicKey,
        _setPublicKey: (publicKey: string) => {
          set({ postPodcastPublicKey: publicKey });
        },
        _signedGatedNote: postPodcastSignedGatedNote,
        _setSignedGatedNote: (signedNote: NostrEvent) => {
          set({ postPodcastSignedGatedNote: signedNote });
        },
        _secret: postPodcastSecret,
        _signedGate: postPodcastSignedGate,
        _setSignedGate: (signedNote: NostrEvent, secret: string) => {
          set({
            postPodcastSignedGate: signedNote,
            postPodcastSecret: secret,
          });
        },
        _didUploadGate: postPodcastDidUploadGate,
        _gateResponse: postPodcastGateResponse,
        _setGateResponse: (response: string, didUploadGate: boolean) => {
          set({
            postPodcastGateResponse: response,
            postPodcastDidUploadGate: didUploadGate,
          });
        },
        _didPublishGate: postPodcastDidPublishGate,
        _setDidPublishGate: (didPublishGate: boolean) => {
          set({ postPodcastDidPublishGate: didPublishGate });
        },
        _signedAnnouncement: postPodcastSignedAnnouncement,
        _setSignedAnnouncement: (signedNote: NostrEvent) => {
          set({ postPodcastSignedAnnouncement: signedNote });
        },
        debug: true,
      });

      // Clear the form
      postPodcastClear();
      runOnClear();

      // Run the success callback
      runOnSuccess({ids, urls: []});
    } catch (error) {
      runOnError(`${error}`);
    } finally {
      set({ postNoteIsRunning: false });
    }
  };

  return {
    ...DEFAULT_STATE,
    postPodcastClear,
    postPodcastHandleFileChange,
    postPodcastHandleLud16Change,
    postPodcastHandleContentChange,
    postPodcastSetLud16,
    postPodcastHandleAnnouncementContentChange,
    postPodcastHandleUnlockCostChange,
    postPodcastSubmit,
  };
};
