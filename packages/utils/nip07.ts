import { EventTemplate, Event as NostrEvent } from 'nostr-tools';

export interface RelayPolicy {
    read: boolean;
    write: boolean;
}

export interface NIP04 {
  encrypt(pubkey: string, plaintext: string): Promise<string>;
  decrypt(pubkey: string, ciphertext: string): Promise<string>;
};

export interface NIP07 {
    getPublicKey(): Promise<string>;
    signEvent(event: EventTemplate): Promise<NostrEvent>;
  
    // Optional methods
    getRelays?(): Promise<{ [url: string]: RelayPolicy }>;
    nip04?: NIP04
}