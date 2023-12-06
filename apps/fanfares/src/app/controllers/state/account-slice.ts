import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { SimplePool } from 'nostr-tools';
import { WebLNProvider, requestProvider } from "webln";
import { NIP07 } from 'utils';

export interface AccountSlice {
    accountPublicKey: string | null;
    nip07: NIP07 | null;
}

const DEFAULT_STATE: AccountSlice = {
    accountPublicKey: null,
    nip07: null,
};

export const createNostrSlice: StateCreator<
  CombinedState & AccountSlice,
  [],
  [],
  AccountSlice
> = (set, get) => {
    return {
        ...DEFAULT_STATE,

    };
};
