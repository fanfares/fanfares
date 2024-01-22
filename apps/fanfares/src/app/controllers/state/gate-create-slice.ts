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
