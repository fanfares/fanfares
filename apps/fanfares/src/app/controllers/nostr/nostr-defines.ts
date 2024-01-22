import { SimplePool } from "nostr-tools";

export const NOSTR_RELAYS = [
    'wss://dev.nostrplayground.com',
    'wss://relay.damus.io',
    'wss://relay.primal.net',
    'wss://nos.lol',
    'wss://nostr.wine',
    'wss://eden.nostr.land'
];

export const PRIMAL_CACHE = 'wss://cache2.primal.net/v1';

export const GATE_SERVER = process.env.NEXT_PUBLIC_GATE_SERVER as string;

export const nostrRelays = NOSTR_RELAYS;
export const nostrPool = new SimplePool();
export const nostrDisconnect = () => {
    nostrPool.close(nostrRelays);
};