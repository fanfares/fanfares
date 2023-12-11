import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { SimplePool } from 'nostr-tools';
import { WebLNProvider, requestProvider } from "webln";
import { NIP07 } from 'utils';
import { NostrProfile, eventToNostrProfile } from 'utils/nostrProfile';

export interface AccountSlice {
    accountPublicKey: string | null;
    accountNIP07: NIP07 | null;
    accountWebln: WebLNProvider | null;
    accountProfile: NostrProfile | null;

    accountSetNostr: (nip07: NIP07, publicKey: string) => void;
    accountSetWebln: (webln: WebLNProvider) => void;
    accountFetchProfile: () => void;
}

const DEFAULT_STATE: AccountSlice = {
    accountPublicKey: null,
    accountNIP07: null,
    accountWebln: null,
    accountProfile: null,

    accountSetNostr: (nip07, webln) => {},
    accountSetWebln: (webln) => {},
    accountFetchProfile: () => {},
};

export const createAccountSlice: StateCreator<
  CombinedState & AccountSlice,
  [],
  [],
  AccountSlice
> = (set, get) => {

    const accountSetNostr = (nip07: NIP07, publicKey: string) => {

        // Init function goes here

        set({
            accountPublicKey: publicKey,
            accountNIP07: nip07,
        });
    }

    const accountSetWebln = (webln: WebLNProvider) => {

        // Init function goes here

        set({
            accountWebln: webln,
        });
    }

    const accountFetchProfile = () => {
        const publicKey = get().accountPublicKey;
        const pool = get().nostrPool;
        const relays = get().nostrRelays;

        if(!publicKey) return;

        console.log("Fetching profile for", publicKey);
        console.log("Fetching profile for", relays);

        pool.get(relays, {
            kinds: [0],
            limit: 1,
            authors: [publicKey]
        }).then((profileEvent)=>{
            console.log("Got profile event", profileEvent);
            if(!profileEvent) return;

            set({
                accountProfile: eventToNostrProfile(publicKey, profileEvent)
            });
        }).catch((err)=>{
            console.log("Failed to get profile event", err);
        }).finally(()=>{
            console.log("Finished profile event");
        })
    }

    return {
        ...DEFAULT_STATE,
        accountSetNostr,
        accountSetWebln,
        accountFetchProfile
    };
};
