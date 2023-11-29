import create from 'zustand';
import { NostrSlice, createNostrSlice } from './nostr-slice';

export type CombinedState = NostrSlice;

export const useAppState = create<CombinedState>()((set, get, slice) => {
  return {
    ...createNostrSlice(set, get, slice),
  };
});
