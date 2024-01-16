import { StateCreator } from "zustand";
import { CombinedState } from "./use-app-state";
import { EventTemplate, Event as NostrEvent, generatePrivateKey } from "nostr-tools";
import {
  NIP_108_KINDS,
  createGatedNoteUnsigned,
  CreateNotePostBody,
  createAnnouncementNoteUnsigned,
} from "nip108";
import { GATE_SERVER } from "../nostr/nostr-defines";

export interface GateCreateContentInput {
  noteToGate: EventTemplate<number>;
  announcementContent: string;
  unlockCost: number;
}

export enum GateCreateState {
  IDLE = "IDLE",
  SIGNING_GATED_CONTENT = "SIGNING_LOCKED_CONTENT",
  SIGNING_GATE = "SIGNING_GATED_CONTENT",
  UPLOADING_GATE = "UPLOADING_GATE",
  PUBLISH_GATE = "PUBLISH_GATE",
  SIGNING_ANNOUNCEMENT = "SIGNING_ANNOUNCEMENT_CONTENT",
  PUBLISH_ANNOUNCEMENT = "PUBLISH_ANNOUNCEMENT",
}

export interface GateCreateSlice {
  gateCreateSubmit: (input: GateCreateContentInput) => Promise<string[]>;
  gateCreateClear: () => void;
  gateCreateState: GateCreateState;
  gateCreateSignedGatedContent: NostrEvent<number> | null;
  gateCreateSecret: string | null;
  gateCreateSignedGate: NostrEvent<NIP_108_KINDS.gate> | null;
  gateCreateSignedAnnouncement: NostrEvent<NIP_108_KINDS.announcement> | null;
  

  gateCreateNoteKeys: string[];
}

const DEFAULT_STATE: GateCreateSlice = {
  gateCreateSubmit: async (input: GateCreateContentInput) => {return []},
  gateCreateClear: () => {},
  gateCreateState: GateCreateState.IDLE,
  gateCreateSecret: null,
  gateCreateSignedGatedContent: null,
  gateCreateSignedGate: null,
  gateCreateSignedAnnouncement: null,
  gateCreateNoteKeys: [],
};

export const createGateCreateSlice: StateCreator<
  CombinedState & GateCreateSlice,
  [],
  [],
  GateCreateSlice
> = (set, get) => {
  const gateCreateClear = () => {
    set({
      gateCreateState: GateCreateState.IDLE,
      gateCreateSignedGatedContent: null,
      gateCreateSignedGate: null,
      gateCreateSecret: null,
      gateCreateSignedAnnouncement: null,
      gateCreateNoteKeys: [],
    });
  };

  const gateCreate = async (input: GateCreateContentInput): Promise<string[]> => {
    const { noteToGate, unlockCost, announcementContent } = input;

    const pool = get().nostrPool;
    const relays = get().nostrRelays;
    const publicKey = get().accountPublicKey;
    const nip07 = get().accountNIP07;
    const gateState = get().gateCreateState;
    const lud16 = get().accountProfile?.lud16;

    if (!pool || !relays || !publicKey || !noteToGate || !nip07 || !lud16) {
      throw new Error("No pool, relays, public key, locked content, nip07, or lud16");
    }

    let gateCreateSignedGatedContent = get().gateCreateSignedGatedContent;
    let gateCreateSecret = get().gateCreateSecret;
    let gateCreateSignedGate = get().gateCreateSignedGate;
    let gateCreateSignedAnnouncement =
      get().gateCreateSignedAnnouncement;

    switch (gateState) {
      case GateCreateState.IDLE:

        gateCreateClear();
        set({ gateCreateState: GateCreateState.SIGNING_GATED_CONTENT });

      case GateCreateState.SIGNING_GATED_CONTENT:
        gateCreateSignedGatedContent = await nip07.signEvent(noteToGate);
        set({
          gateCreateSignedGatedContent,
          gateCreateState: GateCreateState.SIGNING_GATE,
          gateCreateNoteKeys: [gateCreateSignedGatedContent.id],
        });

      case GateCreateState.SIGNING_GATE:
        gateCreateSecret = generatePrivateKey();
        const gatedNote = createGatedNoteUnsigned(
          publicKey,
          gateCreateSecret,
          unlockCost,
          GATE_SERVER,
          gateCreateSignedGatedContent as NostrEvent<number>,
          true,
        );

        gateCreateSignedGate = await nip07.signEvent(gatedNote);
        set({
          gateCreateSignedGate,
          gateCreateSecret,
          gateCreateState: GateCreateState.UPLOADING_GATE,
          gateCreateNoteKeys: [gateCreateSignedGate.id, gateCreateSignedGate.id]
        });

      case GateCreateState.UPLOADING_GATE:
        const postBody: CreateNotePostBody = {
          gateEvent:
            gateCreateSignedGate as NostrEvent<NIP_108_KINDS.gate>,
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

        set({ gateCreateState: GateCreateState.PUBLISH_GATE });

      case GateCreateState.PUBLISH_GATE:
        await pool.publish(
          relays,
          gateCreateSignedGate as NostrEvent<NIP_108_KINDS.gate>
        );
        set({
          gateCreateState: GateCreateState.SIGNING_ANNOUNCEMENT,
        });

      case GateCreateState.SIGNING_ANNOUNCEMENT:
        const announcementNote = createAnnouncementNoteUnsigned(
          publicKey,
          announcementContent,
          gateCreateSignedGate as NostrEvent<NIP_108_KINDS.gate>,
          undefined,
          undefined,
          true,
        );

        gateCreateSignedAnnouncement = await nip07.signEvent(
          announcementNote
        );

        set({
          gateCreateSignedAnnouncement: gateCreateSignedAnnouncement,
          gateCreateState: GateCreateState.PUBLISH_ANNOUNCEMENT,
          gateCreateNoteKeys: [
            gateCreateSignedAnnouncement.id,
            (gateCreateSignedGate as NostrEvent).id,
            (gateCreateSignedGatedContent as NostrEvent).id,
          ],
        });

      case GateCreateState.PUBLISH_ANNOUNCEMENT:
        await pool.publish(
          relays,
          gateCreateSignedAnnouncement as NostrEvent<NIP_108_KINDS.announcement>
        );
        set({ gateCreateState: GateCreateState.IDLE });
    }

    return get().gateCreateNoteKeys;
  };

  return {
    ...DEFAULT_STATE,
    gateCreateClear,
    gateCreateSubmit: gateCreate,
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
