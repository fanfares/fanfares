import {
  Event as NostrEvent,
  SimplePool,
} from "nostr-tools";
import { StateCreator, create } from "zustand";
import { PostGatedNoteIds, PostGatedNoteState, postGatedNote } from "nip108";
import { GATE_SERVER } from "../nostr/nostr-defines";
import { uploadToShdwDrive } from "../shdw/upload";
import { NIP07 } from "utils";

export type PostPodcastState = PostGatedNoteState | "UPLOADING_FILES";

export interface PostPodcastValues {
  ids: PostGatedNoteIds;
  urls: string[];
}

export interface PostPodcastCallbacks {
  onSuccess?: (values: PostPodcastValues) => void;
  onError?: (error: string) => void;
  onClear?: () => void;
}

export interface PostPodcastSlice {
  postPodcastSubmit: (
    nostrPool: SimplePool,
    nostrRelays: string[],
    accountNIP07: NIP07,
    callbacks: PostPodcastCallbacks
  ) => void;
  postPodcastClear: () => void;

  postPodcastHandleImageChange: (event: any) => void;
  postPodcastImageFile: File | null;
  postPodcastImageUrl?: string;

  postPodcastHandleAudioChange: (event: any) => void;
  postPodcastAudioFile: File | null;
  postPodcastAudioUrl?: string;

  postPodcastIsRunning: boolean;
  postGatesNoteError?: string;

  postPodcastCheckTC: boolean;
  postPodcastHandleCheckTCChange: (event: any) => void;

  postPodcastLud16: string;
  postPodcastSetLud16: (event: any) => void;
  postPodcastHandleLud16Change: (event: any) => void;

  postPodcastTitle: string;
  postPodcastHandleTitleChange: (event: any) => void;

  postPodcastDescription: string;
  postPodcastHandleDescriptionChange: (event: any) => void;

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
  postPodcastTitle: "",
  postPodcastDescription: "",
  postPodcastLud16: "",
  postPodcastUnlockCost: 10_000, // Sats
  postPodcastCheckTC: false,

  postPodcastAudioFile: null,
  postPodcastImageFile: null,

  postPodcastHandleAudioChange: () => {},
  postPodcastHandleImageChange: () => {},

  postPodcastSetLud16: () => {},
  postPodcastHandleCheckTCChange: () => {},
  postPodcastHandleLud16Change: () => {},
  postPodcastHandleTitleChange: () => {},
  postPodcastHandleDescriptionChange: () => {},
  postPodcastHandleUnlockCostChange: () => {},

  postPodcastSubmit: () => {},
  postPodcastClear: () => {},
};

export const createPostPodcastSlice: StateCreator<
   PostPodcastSlice,
  [],
  [],
  PostPodcastSlice
> = (set, get) => {
  const postPodcastHandleCheckTCChange = (event: any) => {
    set({ postPodcastCheckTC: event.target.checked });
  };

  const postPodcastHandleAudioChange = (event: any) => {
    const fileList = event.target.files as FileList;
    const file = fileList.item(0);

    set({ postPodcastAudioFile: file });
  };

  const postPodcastHandleImageChange = (event: any) => {
    const fileList = event.target.files as FileList;
    const file = fileList.item(0);

    set({ postPodcastImageFile: file });
  };

  const postPodcastSetLud16 = (lud16: string) => {
    set({ postPodcastLud16: lud16 });
  };

  const postPodcastHandleLud16Change = (event: any) => {
    set({ postPodcastLud16: event.target.value });
  };

  const postPodcastHandleTitleChange = (event: any) => {
    set({ postPodcastTitle: event.target.value });
  };

  const postPodcastHandleDescriptionChange = (event: any) => {
    set({ postPodcastDescription: event.target.value });
  };

  const postPodcastHandleUnlockCostChange = (event: any) => {
    set({ postPodcastUnlockCost: event.target.value });
  };

  const postPodcastClear = () => {
    set({
      postPodcastState: "IDLE",
      postPodcastTitle: "",
      postPodcastDescription: "",
      postPodcastCheckTC: false,
      // Don't clear lud16
      //   postPodcastLud16: accountProfile?.lud16 || "",
      postPodcastUnlockCost: 10_000, // Sats
      postPodcastAudioFile: null,
      postPodcastAudioUrl: undefined,
      postPodcastImageFile: null,
      postPodcastImageUrl: undefined,
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

  const postPodcastSubmit = async (
    nostrPool: SimplePool,
    nostrRelays: string[],
    accountNIP07: NIP07,
    callbacks: PostPodcastCallbacks
  ) => {
    const {
      postPodcastAudioFile,
      postPodcastImageFile,
      postPodcastIsRunning,
      postPodcastTitle,
      postPodcastDescription,
      postPodcastLud16,
      postPodcastState,
      postPodcastPublicKey,
      postPodcastSignedGatedNote,
      postPodcastCheckTC,
      postPodcastSecret,
      postPodcastSignedGate,
      postPodcastDidUploadGate,
      postPodcastGateResponse,
      postPodcastDidPublishGate,
      postPodcastSignedAnnouncement,
      postPodcastUnlockCost,
    } = get();

    if (postPodcastIsRunning) return;

    const { onSuccess, onError, onClear } = callbacks;
    const runOnSuccess = onSuccess ? onSuccess : () => {};
    const runOnError = onError ? onError : () => {};
    const runOnClear = onClear ? onClear : () => {};

    try {
      if (!postPodcastCheckTC)
        throw new Error("User has not agreed to to the terms and conditions");
      if (!postPodcastLud16) throw new Error("Missing lud16");
      if (!postPodcastUnlockCost) throw new Error("Missing unlock cost");
      if (!postPodcastTitle) throw new Error("Missing announcement");
      if (!postPodcastDescription) throw new Error("Missing content");
      if (!postPodcastAudioFile) throw new Error("Missing audio file");
      if (!postPodcastImageFile) throw new Error("Missing image file");
      if (!accountNIP07) throw new Error("Missing NIP07");
      if (!nostrPool) throw new Error("Missing pool");
      if (!nostrRelays) throw new Error("Missing relays");

      set({ postPodcastIsRunning: true });

      // Upload Files
      if (
        postPodcastState === "UPLOADING_FILES" ||
        postPodcastState === "IDLE"
      ) {
        set({ postPodcastState: "UPLOADING_FILES" });

        // const prefix = generatePrivateKey();
        const uploadFiles = [postPodcastAudioFile, postPodcastImageFile];
        const prefix = "debug";
        const fileUrls = await uploadToShdwDrive(uploadFiles, prefix);

        const audioUrl = fileUrls.find((url) =>
          url.includes(postPodcastAudioFile.name)
        );
        const imageUrl = fileUrls.find((url) =>
          url.includes(postPodcastImageFile.name)
        );

        if (!audioUrl) throw new Error("Missing audio url");
        if (!imageUrl) throw new Error("Missing image url");

        set({
          postPodcastState: "GETTING_PUBLIC_KEY",
          postPodcastAudioUrl: audioUrl,
          postPodcastImageUrl: imageUrl,
        });
      }

      // Creating notes
      const { postPodcastAudioUrl, postPodcastImageUrl } = get();
      if (!postPodcastAudioUrl)
        throw new Error("Missing audio url after upload");
      if (!postPodcastImageUrl)
        throw new Error("Missing image url after upload");

      // Creating gated note
      const gatedNoteTags = [["r", postPodcastAudioUrl]];
      const gatedNoteContent = postPodcastAudioUrl;

      // Creating announcement note
      const announcementNoteTags = [
        ["r", postPodcastImageUrl],
        ["t", "podcast"],
      ];

      const announcementNoteContent = `${postPodcastTitle}\n${postPodcastDescription}`;

      const ids = await postGatedNote({
        gatedNoteContent,
        gatedNoteTags,
        announcementNoteContent,
        announcementNoteTags,
        gateServer: GATE_SERVER,
        costmSats: postPodcastUnlockCost * 1000,
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
      runOnSuccess({ ids, urls: [] });
    } catch (error) {
      runOnError(`${error}`);
    } finally {
      set({ postPodcastIsRunning: false });
    }
  };

  return {
    ...DEFAULT_STATE,
    postPodcastClear,
    postPodcastHandleCheckTCChange,
    postPodcastHandleAudioChange,
    postPodcastHandleImageChange,
    postPodcastHandleLud16Change,
    postPodcastHandleTitleChange,
    postPodcastSetLud16,
    postPodcastHandleDescriptionChange,
    postPodcastHandleUnlockCostChange,
    postPodcastSubmit,
  };
};

export const usePostPodcast = create<PostPodcastSlice>()(createPostPodcastSlice);

