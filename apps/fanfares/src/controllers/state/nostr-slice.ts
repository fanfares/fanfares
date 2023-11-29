import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';

export interface NostrSlice {
    nostrState: string;
}

export const createNostrSlice: StateCreator<
  CombinedState & NostrSlice,
  [],
  [],
  NostrSlice
> = (set, get) => ({
    nostrState: 'nostr'
});
