import { StateCreator } from "zustand";
import { CombinedState } from "./use-app-state";
import {
  generatePrivateKey,
  Event as NostrEvent,
} from "nostr-tools";
import { PRIMAL_CACHE } from "../nostr/nostr-defines";
import { NostrProfile } from "utils";

export enum PrimalScope {
  global = "global",
  network = "network",
  tribe = "tribe",
  follows = "follows",
}

// AKA 'timeframe'
export enum PrimalSort {
  trending = "trending",
  mostzapped = "mostzapped",
  mostzapped4h = "mostzapped4h",
  popular = "popular",
  latest = "latest",
}

export type NostrPostStats = {
    event_id: string
    likes: number;
    mentions: number;
    reposts: number;
    replies: number;
    zaps: number;
    satszapped: number;
    score: number;
    score24h: number;
};

export type ExploreFeedPayload = {
  timeframe: string;
  scope: string;
  limit: number;
  user_pubkey?: string;
  since?: number;
  until?: number;
  created_after?: number;
};

export type MediaSize = "o" | "s" | "m" | "l";

export type MediaVariant = {
  s: MediaSize;
  a: 0 | 1;
  w: number;
  h: number;
  mt: string;
  media_url: string;
};

export type MediaEvent = {
  event_id: string;
  resources: { url: string; variants: MediaVariant[] }[];
};

export const second = 1000;
export const minute = 60 * second;
export const hour = 60 * minute;
export const day = 24 * hour;
export const week = 7 * day;

export interface PrimalSlice {
  primalSocket: WebSocket | null;
  primalAppID: string;
  primalConnect: () => void;
  primalDisconnect: () => void;

  primalSend: (data: string) => void;
  primalGet: () => void;

  primalNotes: NostrEvent<1>[];
  primalProfiles: { [key: string]: NostrProfile }; // Keyed by Pubkey
  primalNoteStats: { [key: string]: NostrPostStats }; // Keyed by Event ID
  primalMediaEvents:{ [key: string]: MediaEvent }; // Keyed by Event ID
}

const DEFAULT_STATE: PrimalSlice = {
  primalSocket: null,
  primalAppID: "nostr",
  primalConnect: () => {},
  primalDisconnect: () => {},

  primalSend: (data: string) => {},
  primalGet: () => {},

  primalNotes: [],
  primalProfiles: {},
  primalNoteStats: {},
  primalMediaEvents: {},
};

export const createPrimalSlice: StateCreator<
  CombinedState & PrimalSlice,
  [],
  [],
  PrimalSlice
> = (set, get) => {

  const parsePrimalEvent = (event: any) => {
    try {
      const rawData = JSON.parse(event.data);
      if (rawData[0] === "EOSE") return;
  
      const data = rawData[2];
  
      switch (data.kind) {
        case 0:
          const profile: NostrProfile = {
            ...JSON.parse(data.content)
          };

          set({
            primalProfiles: {
              ...get().primalProfiles,
              [data.pubkey]: profile,
            },
          })
          break;
        case 1:
          const note = data as NostrEvent<1>;

          set({
            primalNotes: [...get().primalNotes, note],
          })
          break;
        case 1000_0100:
          const noteStats = JSON.parse(data.content) as NostrPostStats;
          set({
            primalNoteStats: {
              ...get().primalNoteStats,
              [noteStats.event_id]: noteStats,
            },
          })
          break;
        case 1000_0107: // CONTENT?
          // console.log(JSON.parse(data.content));
          break;
        case 1000_0113: // IGNORE
          // {since: 13373, until: 20000, order_by: 'satszapped'}
          // console.log(JSON.parse(data.content));
          break;
        case 1000_0119: // MEDIA EVENT
          const mediaEvent = JSON.parse(data.content) as MediaEvent;
          set({
            primalMediaEvents: {
              ...get().primalMediaEvents,
              [data.event_id]: mediaEvent,
            },
          })
          break;
        case 1000_0128: // ARTICLES
          // console.log(JSON.parse(data.content));
          break;
      }
  
    } catch (error) {
      console.error(`\n\nError parsing primal event: ${error}`);
      console.error(JSON.parse(event.data));
      console.error("\n\n\n");
    }
  }


  const primalConnect = () => {
    const socket = new WebSocket(PRIMAL_CACHE);
    socket.readyState;
    socket.onopen = () => {
      console.log("Primal connected");
      set({ primalSocket: socket });

      // First round of Data
      get().primalGet();
    };
    socket.onclose = () => {
      console.log("Primal disconnected");
      set({ primalSocket: null });
    };
    socket.onerror = (error) => {
      console.log("Primal error");
      console.log(error);
    };
    socket.onmessage = parsePrimalEvent;
  };

  const primalDisconnect = () => {
    const socket = get().primalSocket;
    if (!socket) return;
    socket.close();
  };

  const primalSend = (message: string) => {
    const ws = get().primalSocket;

    if (!ws) return;

    const event = new CustomEvent("send", { detail: { message, ws } });
    ws.send(message);
    ws.dispatchEvent(event);
  };

  const primalGet = () => {
    const key = get().accountPublicKey;
    const id = get().primalAppID;

    // getExploreFeed(
    //     account?.publicKey || '',
    //     `explore_${APP_ID}`,
    //     scope,
    //     timeframe,
    //     until,
    //     limit,
    //   );

    //  network
    //scope: global, timeframe: trending, until: 0, limit: 20
    //scope: global, timeframe: mostzapped, until: 0, limit: 20
    //scope: global, timeframe: popular, until: 0, limit: 20
    //scope: global, timeframe: latest, until: 0, limit: 20

    getExploreFeed(
      key ?? "",
      `explore_${id}`,
      PrimalScope.global, //scope
      PrimalSort.mostzapped, //timeframe
      0,
      50,
      get().primalSend
    );
  };

  const primalAppID = generatePrivateKey();

  return {
    ...DEFAULT_STATE,
    primalAppID,
    primalConnect,
    primalDisconnect,
    primalSend,
    primalGet,
  };
};

function getExploreFeed(
  pubkey: string | undefined,
  subid: string,
  scope: string,
  timeframe: string,
  until = 0,
  limit = 20,
  primalSend: (data: string) => void
) {
  let payload: ExploreFeedPayload = { timeframe, scope, limit };

  if (pubkey) {
    payload.user_pubkey = pubkey;
  }

  if (until > 0) {
    payload.until = until;
  }

  if (timeframe === "trending") {
    const yesterday = Math.floor((new Date().getTime() - day) / 1000);

    payload.created_after = yesterday;
  }

  if (timeframe === "mostzapped4h") {
    const fourHAgo = Math.floor((new Date().getTime() - 4 * hour) / 1000);

    payload.timeframe = "mostzapped";
    payload.created_after = fourHAgo;
  }

  // primalSend(JSON.stringify([
  //     "REQ",
  //     subid,
  //     {cache: [
  //       "explore_global_mostzapped_4h",
  //       { user_pubkey: pubkey },
  //     ]},
  //   ]));

  primalSend(JSON.stringify(["REQ", subid, { cache: ["explore", payload] }]));
}
