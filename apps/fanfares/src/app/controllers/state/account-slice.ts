import { StateCreator, create } from 'zustand';
import { CombinedState } from './use-app-state';
import { SimplePool } from 'nostr-tools';
import { WebLNProvider, requestProvider } from "webln";
import { NIP04, NIP07 } from 'utils';
import { NostrProfile, eventToNostrProfile } from 'utils/nostrProfile';

export interface NostrAccount {
    accountPublicKey: string | null;
    accountNIP07: NIP07 | null;
    accountNIP04: NIP04 | null;
}

export interface AccountSlice {
    accountNostr: NostrAccount | null;
    accountProfile: NostrProfile | null;
    accountWebln: WebLNProvider | null;
    actions: {
        accountSetNostr: (nostr: NostrAccount) => void;
        accountSetWebln: (webln: WebLNProvider) => void;
        accountFetchProfile: (
            publicKey: string,
            pool: SimplePool,
            relays: string[],
        ) => void;
    };
}

const DEFAULT_STATE: AccountSlice = {
    accountNostr: null,
    accountWebln: null,
    accountProfile: null,

    actions: {
        accountSetNostr: (nostr) => {},
        accountSetWebln: (webln) => {},
        accountFetchProfile: (
            publicKey,
            pool,
            relays,
        ) => {},
    },
};

export const createAccountSlice: StateCreator<
  AccountSlice,
  [],
  [],
  AccountSlice
> = (set, get) => {

    const accountSetNostr = (nostr: NostrAccount) => {

        // Init function goes here

        set({accountNostr: nostr});
    }

    const accountSetWebln = (webln: WebLNProvider) => {

        // Init function goes here

        set({accountWebln: webln});
    }

    const accountFetchProfile = (
        publicKey: string,
        pool: SimplePool,
        relays: string[],
    ) => {

        pool.get(relays, {
            kinds: [0],
            limit: 1,
            authors: [publicKey]
        }).then((profileEvent)=>{
            if(!profileEvent) return;

            set({
                accountProfile: eventToNostrProfile(publicKey, profileEvent)
            });
        }).catch((err)=>{
            console.log("Failed to get profile event", err);
        })
    }

    return {
        ...DEFAULT_STATE,
        actions: {
            accountSetNostr,
            accountSetWebln,
            accountFetchProfile
        }
    };
};

const useAccountSlice = create<AccountSlice>()(createAccountSlice);

export const useAccountActions = () => useAccountSlice((state) => state.actions);
export const useAccountNostr = () => useAccountSlice((state) => state.accountNostr);
export const useAccountWebln = () => useAccountSlice((state) => state.accountWebln);
export const useAccountProfile = () => useAccountSlice((state) => state.accountProfile);