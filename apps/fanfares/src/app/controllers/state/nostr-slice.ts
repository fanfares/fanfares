import { StateCreator, create } from 'zustand';
import { CombinedState } from './old/use-app-state';
import { SimplePool } from 'nostr-tools';
import { NOSTR_RELAYS } from '../nostr/nostr-defines';

export interface NostrSlice {
    nostrRelays: string[];
    nostrPool: SimplePool;
    nostrDisconnect: () => void;
}

const DEFAULT_STATE: NostrSlice = {
    nostrRelays: NOSTR_RELAYS,
    nostrPool: new SimplePool(),
    nostrDisconnect: () => {},
};

export const createNostrSlice: StateCreator<
  NostrSlice,
  [],
  [],
  NostrSlice
> = (set, get) => {
    
    const nostrDisconnect = () => {
        const relays = get().nostrRelays;
        const pool = get().nostrPool;

        if(!relays) return;
        if(!pool || !pool.close) return;
        pool.close(relays);
    }

    return {
        ...DEFAULT_STATE,
        nostrDisconnect,
    };
};

export const useNostr = create<NostrSlice>()(createNostrSlice);

