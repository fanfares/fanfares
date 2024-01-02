import { StateCreator } from "zustand";
import { CombinedState } from "./use-app-state";
import { Event as NostrEvent, generatePrivateKey } from "nostr-tools";
import {
  GatedNote,
  AnnouncementNote,
  KeyNote,
  NIP_108_KINDS,
  eventToKeyNote,
  eventToGatedNote,
  eventToAnnouncementNote,
  unlockGatedNote,
  createGatedNoteUnsigned,
  CreateNotePostBody,
  createAnnouncementNoteUnsigned,
} from "nip108";
import { GATE_SERVER } from "../nostr/nostr-defines";

// First, let's create the ability to see all of the gated posts you have purchased
// So we will fetch by the gate key, and then we will fetch the gated posts

export interface CreateGateContentInput {
  lockedContent: NostrEvent<number>;
  announcementContent: string;
  unlockCost: number;
}

export enum CreateGateState {
  IDLE = "IDLE",
  SIGNING_LOCKED_CONTENT = "SIGNING_LOCKED_CONTENT",
  SIGNING_GATED_CONTENT = "SIGNING_GATED_CONTENT",
  UPLOADING_GATE = "UPLOADING_GATE",
  PUBLISH_GATE = "PUBLISH_GATE",
  SIGNING_ANNOUNCEMENT_CONTENT = "SIGNING_ANNOUNCEMENT_CONTENT",
  PUBLISH_ANNOUNCEMENT = "PUBLISH_ANNOUNCEMENT",
}

export interface CreateGateSlice {
  gateCreate: (input: CreateGateContentInput) => Promise<void>;
  gateCreateClear: () => void;
  gateCreateState: CreateGateState;
  gateCreateSignedLockedContent: NostrEvent<number> | null;
  gateCreateSecret: string | null;
  gateCreateSignedGatedContent: NostrEvent<NIP_108_KINDS.gate> | null;
  gateCreateSignedAnnouncementContent: NostrEvent<NIP_108_KINDS.announcement> | null;
}

const DEFAULT_STATE: CreateGateSlice = {
  gateCreate: async (input: CreateGateContentInput) => {},
  gateCreateClear: () => {},
  gateCreateState: CreateGateState.IDLE,
  gateCreateSecret: null,
  gateCreateSignedLockedContent: null,
  gateCreateSignedGatedContent: null,
  gateCreateSignedAnnouncementContent: null,
};

export const createGateCreateSlice: StateCreator<
  CombinedState & CreateGateSlice,
  [],
  [],
  CreateGateSlice
> = (set, get) => {
  const gateCreateClear = () => {
    set({
      gateCreateState: CreateGateState.IDLE,
      gateCreateSignedLockedContent: null,
      gateCreateSignedGatedContent: null,
      gateCreateSecret: null,
      gateCreateSignedAnnouncementContent: null,
    });
  };

  const gateCreate = async (input: CreateGateContentInput) => {
    const { lockedContent, unlockCost, announcementContent } = input;

    const pool = get().nostrPool;
    const relays = get().nostrRelays;
    const publicKey = get().accountPublicKey;
    const nip07 = get().accountNIP07;
    const gateState = get().gateCreateState;
    const lud16 = get().accountProfile?.lud16;

    if (!pool || !relays || !publicKey || !lockedContent || !nip07 || !lud16) {
      alert("No pool, relays, public key, locked content, nip07, or lud16");
      return;
    }

    let gateCreateSignedLockedContent = get().gateCreateSignedLockedContent;
    let gateCreateSecret = get().gateCreateSecret;
    let gateCreateSignedGatedContent = get().gateCreateSignedGatedContent;
    let gateCreateSignedAnnouncementContent =
      get().gateCreateSignedAnnouncementContent;

    switch (gateState) {
      case CreateGateState.IDLE:
        set({ gateCreateState: CreateGateState.SIGNING_LOCKED_CONTENT });

      case CreateGateState.SIGNING_LOCKED_CONTENT:
        gateCreateSignedLockedContent = await nip07.signEvent(lockedContent);
        set({
          gateCreateSignedLockedContent,
          gateCreateState: CreateGateState.SIGNING_GATED_CONTENT,
        });

      case CreateGateState.SIGNING_GATED_CONTENT:
        gateCreateSecret = generatePrivateKey();
        const gatedNote = createGatedNoteUnsigned(
          publicKey,
          gateCreateSecret,
          unlockCost,
          GATE_SERVER,
          gateCreateSignedLockedContent as NostrEvent<number>
        );

        gateCreateSignedGatedContent = await nip07.signEvent(gatedNote);
        set({
          gateCreateSignedGatedContent,
          gateCreateSecret,
          gateCreateState: CreateGateState.UPLOADING_GATE,
        });

      case CreateGateState.UPLOADING_GATE:
        const postBody: CreateNotePostBody = {
          gateEvent:
            gateCreateSignedGatedContent as NostrEvent<NIP_108_KINDS.gate>,
          lud16: lud16,
          secret: gateCreateSecret as string,
          cost: unlockCost,
        };

        const response = await fetch(GATE_SERVER + "/create", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(postBody),
        });

        if (!response.ok) throw new Error("Failed to upload gate");

        set({ gateCreateState: CreateGateState.PUBLISH_GATE });

      case CreateGateState.PUBLISH_GATE:
        await pool.publish(
          relays,
          gateCreateSignedGatedContent as NostrEvent<NIP_108_KINDS.gate>
        );
        set({
          gateCreateState: CreateGateState.SIGNING_ANNOUNCEMENT_CONTENT,
        });

      case CreateGateState.SIGNING_ANNOUNCEMENT_CONTENT:
        const announcementNote = createAnnouncementNoteUnsigned(
          publicKey,
          announcementContent,
          gateCreateSignedGatedContent as NostrEvent<NIP_108_KINDS.gate>
        );

        gateCreateSignedAnnouncementContent = await nip07.signEvent(
          announcementNote
        );

        set({
          gateCreateSignedAnnouncementContent,
          gateCreateState: CreateGateState.PUBLISH_ANNOUNCEMENT,
        });

      case CreateGateState.PUBLISH_ANNOUNCEMENT:
        await pool.publish(
          relays,
          gateCreateSignedAnnouncementContent as NostrEvent<NIP_108_KINDS.announcement>
        );
        set({ gateCreateState: CreateGateState.IDLE });
    }
  };

  return {
    ...DEFAULT_STATE,
    gateCreateClear,
    gateCreate,
  };
};

// const submitForm = async () => {
//     if (submittingForm) return;

//     setSubmittingForm(true);

//     try {
//       if (!webln) throw new Error("No webln provider");
//       if (!nostr) throw new Error("No nostr provider");
//       if (!publicKey) throw new Error("No Public Key");
//       if (!relay) throw new Error("No relay");

//       // ------------------- VALIDATE FORM -------------------------
//       const { lud16, cost, preview, content } = formData;

//       // 1. Check if lud16 is valid (looks like an email)
//       const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//       if (!emailRegex.test(lud16)) throw new Error("Invalid lud16 format");

//       // 2. Check if price is valid
//       if (!cost || cost < MIN_SAT_COST || cost > MAX_SAT_COST)
//         throw new Error(`Price should be >= ${MIN_SAT_COST} and <= ${MAX_SAT_COST} sats`);
//       const unlockCost = cost * 1000;

//       // 3. Check if preview is valid
//       if (preview.length > MAX_PREVIEW_LENGTH || preview.length < MIN_PREVIEW_LENGTH)
//         throw new Error(`Preview should be <= 260 chars and >= ${MIN_PREVIEW_LENGTH} chars`);

//       // 4. Check if content is valid
//       if (content.length > MAX_CONTENT_LENGTH || content.length < MIN_CONTENT_LENGTH)
//         throw new Error(`Content should be <= ${MAX_CONTENT_LENGTH} chars and >= ${MIN_CONTENT_LENGTH} chars`);

//       // ------------------- CREATE LOCKED CONTENT -------------------------

//       const lockedContent = {
//         kind: 1,
//         pubkey: publicKey,
//         created_at: Math.floor(Date.now() / 1000),
//         tags: [],
//         content: content,
//       };
//       const lockedContentVerified = await nostr.signEvent(lockedContent);

//       const secret = generatePrivateKey();
//       const gatedNote = createGatedNoteUnsigned(
//         publicKey,
//         secret,
//         unlockCost,
//         GATE_SERVER,
//         lockedContentVerified
//       );

//       const gatedNoteVerified = await nostr.signEvent(gatedNote);

//       const postBody: CreateNotePostBody = {
//         gateEvent: gatedNoteVerified,
//         lud16: lud16,
//         secret: secret,
//         cost: unlockCost,
//       };

//       const response = await fetch(GATE_SERVER + "/create", {
//         method: "POST",
//         headers: {
//           "Content-type": "application/json",
//         },
//         body: JSON.stringify(postBody),
//       });

//       const responseJson = await response.json();
//       console.log(responseJson);

//       console.log("Publishing Gated Note...");
//       await relay.publish(gatedNoteVerified);

//       // ------------------- CREATE ANNOUNCEMENT NOTE -------------------------

//       const announcementNote = createAnnouncementNoteUnsigned(
//         publicKey,
//         preview,
//         gatedNoteVerified
//       );

//       console.log("Publishing Announcement Note...");
//       const announcementNoteVerified = await nostr.signEvent(announcementNote);
//       await relay.publish(announcementNoteVerified);

//       // ------------------- ADD NOTE TO EVENTS -------------------------

//       console.log("Adding Notes to Events...");
//       setAnnouncementNotes([
//         eventToAnnouncementNote(announcementNoteVerified),
//         ...announcementNotes,
//       ]);
//       setGatedNotes([eventToGatedNote(gatedNoteVerified), ...gatedNotes]);
//     } catch (e) {
//       alert(e);
//       console.log(e);
//     }

//     setSubmittingForm(false);
//     setFormData(DEFAULT_FORM_DATA);
//     setPostFormOpen(false);
//   };
