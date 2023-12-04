import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';

export interface NostrSlice {
    nostrState: string;
    changeNostrState: (newNostrState: string) => void;
}

export const createNostrSlice: StateCreator<
  CombinedState & NostrSlice,
  [],
  [],
  NostrSlice
> = (set, get) => ({
    nostrState: 'nostr',
    changeNostrState: (newNostrState: string) => {
        set({ nostrState: newNostrState });
    },
});
