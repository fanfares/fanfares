import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { SimplePool } from 'nostr-tools';
import { WebLNProvider, requestProvider } from "webln";
import { NIP07 } from 'utils';

export interface AccountSlice {
    accountPublicKey: string | null;
    accountNIP07: NIP07 | null;
    accountWebln: WebLNProvider | null;

    accountSetNostr: (nip07: NIP07, publicKey: string) => void;
    accountSetWebln: (webln: WebLNProvider) => void;
}

const DEFAULT_STATE: AccountSlice = {
    accountPublicKey: null,
    accountNIP07: null,
    accountWebln: null,
    accountSetNostr: (nip07, webln) => {},
    accountSetWebln: (webln) => {},
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

    return {
        ...DEFAULT_STATE,
        accountSetNostr,
        accountSetWebln
    };
};
