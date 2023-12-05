import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { SimplePool } from 'nostr-tools';

const NOSTR_RELAYS = [
    'wss://dev.nostrplayground.com',
    // 'wss://relay.damus.io',
    // 'wss://relay.primal.net',
];

export interface NostrSlice {
    nostrRelays: string[];
    nostrPool: SimplePool;
    nostrDisconnect: () => void;

    nostrTest: string;
    nostrSetTest: (test: string) => void;
}

const DEFAULT_STATE: NostrSlice = {
    nostrRelays: NOSTR_RELAYS,
    nostrPool: new SimplePool(),
    nostrDisconnect: () => {},
    nostrTest: 'testing...',
    nostrSetTest: (state: string) => {},
};

export const createNostrSlice: StateCreator<
  CombinedState & NostrSlice,
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

    const nostrSetTest = (state: string) => {
        set({ nostrTest: state });
    }

    return {
        ...DEFAULT_STATE,
        nostrDisconnect,
        nostrSetTest,
    };
};
