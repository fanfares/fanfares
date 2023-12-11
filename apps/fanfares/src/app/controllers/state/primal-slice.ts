import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { SimplePool, generatePrivateKey } from 'nostr-tools';
import { PRIMAL_CACHE } from '../nostr/nostr-defines';

export enum PrimalScope {
  global = 'global',
  network = 'network',
  tribe = 'tribe',
  follows = 'follows',
}

// AKA 'timeframe'
export enum PrimalSort {
  trending = 'trending',
  mostzapped = 'mostzapped',
  mostzapped4h = 'mostzapped4h',
  popular = 'popular',
  latest = 'latest',
}


export type ExploreFeedPayload = {
    timeframe: string,
    scope: string,
    limit: number,
    user_pubkey?: string,
    since? : number,
    until?: number,
    created_after?: number,
  }
  
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
}

const DEFAULT_STATE: PrimalSlice = {
    primalSocket: null,
    primalAppID: 'nostr',
    primalConnect: () => {},
    primalDisconnect: () => {},

    primalSend: (data: string) => {},
    primalGet: () => {},
};

export const createPrimalSlice: StateCreator<
  CombinedState & PrimalSlice,
  [],
  [],
  PrimalSlice
> = (set, get) => {

    const primalConnect = () => {
        const socket = new WebSocket(PRIMAL_CACHE);
        socket.readyState
        socket.onopen = () => {
            console.log('Primal connected');
            set({ primalSocket: socket });

        };
        socket.onclose = () => {
            console.log('Primal disconnected');
            set({ primalSocket: null });
        };
        socket.onerror = (error) => {
            console.log('Primal error');
            console.log(error);
        };
        socket.onmessage = (event) => {
            console.log('Primal event');
            // const rawData = JSON.parse(event.data);
            // const data = rawData[2];
            // const note = JSON.parse(data.content);
            // console.log(note);

        };
    }

    const primalDisconnect = () => {
        const socket = get().primalSocket;
        if(!socket) return;
        socket.close();
    }

    const primalSend = (message: string) => {
        const ws = get().primalSocket;

        if (!ws) return 

        const event = new CustomEvent('send', { detail: { message, ws }});
        ws.send(message);
        ws.dispatchEvent(event);
    }



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
            key ?? '',
            `explore_${id}`,
            PrimalScope.global, //scope
            PrimalSort.mostzapped, //timeframe
            0,
            20,
            get().primalSend
        )

    }

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


function getExploreFeed (
    pubkey: string | undefined,
    subid: string,
    scope: string,
    timeframe: string,
    until = 0,
    limit = 20,
    primalSend: (data: string) => void,
  ){
  
    let payload: ExploreFeedPayload = { timeframe, scope, limit };
  
    if (pubkey) {
      payload.user_pubkey = pubkey;
    }
  
    if (until > 0) {
      payload.until = until;
    }
  
    if (timeframe === 'trending') {
      const yesterday = Math.floor((new Date().getTime() - day) / 1000);
  
      payload.created_after = yesterday;
    }
  
    if (timeframe === 'mostzapped4h') {
      const fourHAgo = Math.floor((new Date().getTime() - (4 * hour)) / 1000);
  
      payload.timeframe = 'mostzapped';
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

    primalSend(JSON.stringify([
      "REQ",
      subid,
      {cache: [
        "explore",
        payload,
      ]},
    ]));
  };