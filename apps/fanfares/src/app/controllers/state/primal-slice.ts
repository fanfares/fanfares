import { create } from "zustand";
import { StateCreator } from "zustand";
import { generatePrivateKey, Event as NostrEvent } from "nostr-tools";
import { PRIMAL_CACHE } from "../nostr/nostr-defines";
import { NostrProfile } from "utils";
import {
  getExploreFeed,
  getUserFeed,
  MediaEvent,
  NostrPostStats,
  PrimalScope,
  PrimalSort,
} from "../primal/primalHelpers";

export interface PrimalSlice {
  primalSocket: WebSocket | null;
  primalAppID: string;
  primalFetching: boolean;
  primalNotes: { [key: string]: NostrEvent<1> };
  primalProfiles: { [key: string]: NostrProfile }; // Keyed by Pubkey
  primalNoteStats: { [key: string]: NostrPostStats }; // Keyed by Event ID
  primalMediaEvents: { [key: string]: MediaEvent }; // Keyed by Event ID

  actions: {
    primalConnect: () => void;
    primalDisconnect: () => void;
    primalSend: (data: string) => void;
    primalGet: (publicKey: string) => void;
  };
}

const DEFAULT_STATE: PrimalSlice = {
  primalSocket: null,
  primalFetching: false,
  primalAppID: "nostr",
  primalNotes: {},
  primalProfiles: {},
  primalNoteStats: {},
  primalMediaEvents: {},

  actions: {
    primalConnect: () => {},
    primalDisconnect: () => {},
    primalSend: (data: string) => {},
    primalGet: (pubkey: string) => {},
  },
};

export const createPrimalSlice: StateCreator<
  PrimalSlice,
  [],
  [],
  PrimalSlice
> = (set, get) => {
  // -------------- PRIMAL SEND ----------------
  const primalSend = (message: string) => {
    const ws = get().primalSocket;
    console.log('ws message',message,ws)

    if (!ws) return;

    const event = new CustomEvent("send", { detail: { message, ws } });
    ws.send(message);
    ws.dispatchEvent(event);
  };

  // -------------- PRIMAL GET ----------------
  const primalGet = (publicKey: string) => {

    if(get().primalSocket === null){
      console.log('Primal socket is null')
      return;
    }

    const id = get().primalAppID;

    //  network
    //scope: global, timeframe: trending, until: 0, limit: 20
    //scope: global, timeframe: mostzapped, until: 0, limit: 20
    //scope: global, timeframe: popular, until: 0, limit: 20
    //scope: global, timeframe: latest, until: 0, limit: 20

    if(get().primalFetching){
      console.log("Primal is already fetching");
      return;
    }

    set({ primalFetching: true });

    if (publicKey) {
      getUserFeed(
        publicKey ?? "",
        publicKey ?? "",
        `feed_${id}`,
        0,
        20,
        primalSend
      );
    } else {
      getExploreFeed(
        publicKey ?? "",
        `explore_${id}`,
        PrimalScope.global, //scope
        PrimalSort.mostzapped, //timeframe
        0,
        100,
        primalSend
      );
    }
  };

  // -------------- PARSE PRIMAL SEND ----------------
  const parsePrimalEvent = (event: any) => {
    // console.log('event',event)
    try {
      const rawData = JSON.parse(event.data);
      if (rawData[0] === "EOSE"){
        set({ primalFetching: false });
        return;
      }

      const data = rawData[2];

      switch (data.kind) {
        case 0:
          const profile: NostrProfile = {
            ...JSON.parse(data.content),
          };

          const profiles = get().primalProfiles;
          if(profiles[profile.pubkey]) return;

          set({
            primalProfiles: {
              ...profiles,
              [data.pubkey]: profile,
            },
          });
          break;
        case 1:
          const note = data as NostrEvent<1>;

          const notes = get().primalNotes;
          if(notes[note.id]) return;

          set({
            primalNotes: {
              ...notes,
              [note.id]: note,
            },
          });
          break;
        case 1000_0100:
          const noteStats = JSON.parse(data.content) as NostrPostStats;

          const stats = get().primalNoteStats;
          if(stats[noteStats.event_id]) return;

          set({
            primalNoteStats: {
              ...stats,
              [noteStats.event_id]: noteStats,
            },
          });
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

          const mediaEvents = get().primalMediaEvents;
          if(mediaEvents[mediaEvent.event_id]) return;

          set({
            primalMediaEvents: {
              ...mediaEvents,
              [data.event_id]: mediaEvent,
            },
          });
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
  };

  // -------------- PRIMAL CONNECT ----------------
  const primalConnect = () => {
    const socket = new WebSocket(PRIMAL_CACHE);
    socket.readyState;
    socket.onopen = () => {
      console.log("Primal connected", socket);
      set({ primalSocket: socket });

      // First round of Data
      // primalGet("");
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

  const primalAppID = generatePrivateKey();

  return {
    ...DEFAULT_STATE,
    primalAppID,
    actions: {
      primalConnect,
      primalDisconnect,
      primalSend,
      primalGet,
    },
  };
};

const usePrimalSlice = create<PrimalSlice>()(createPrimalSlice);

export const usePrimalIsFetching = () => usePrimalSlice((state) => state.primalFetching);
export const usePrimalActions = () => usePrimalSlice((state) => state.actions);
export const usePrimalState = () => usePrimalSlice((state) => state);
export const usePrimalSocket = () =>
  usePrimalSlice((state) => state.primalSocket);
export const usePrimalAppID = () =>
  usePrimalSlice((state) => state.primalAppID);
export const usePrimalNotes = () =>
  usePrimalSlice((state) => state.primalNotes);
export const usePrimalProfiles = () =>
  usePrimalSlice((state) => state.primalProfiles);
export const usePrimalNoteStats = () =>
  usePrimalSlice((state) => state.primalNoteStats);
export const usePrimalMediaEvents = () =>
  usePrimalSlice((state) => state.primalMediaEvents);
