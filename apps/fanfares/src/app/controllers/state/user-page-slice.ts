import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { Event as NostrEvent } from 'nostr-tools';

export interface UserPageSlice {
    userPageNotes: NostrEvent[];
}

const DEFAULT_STATE: UserPageSlice = {
    userPageNotes: [],
};

export const createUserPageSlice: StateCreator<
  CombinedState & UserPageSlice,
  [],
  [],
  UserPageSlice
> = (set, get) => {


    return {
        ...DEFAULT_STATE,
    };
};
