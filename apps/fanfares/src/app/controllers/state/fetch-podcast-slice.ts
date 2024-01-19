import { StateCreator } from "zustand"
import { CombinedState } from "./use-app-state"

export interface FetchPodcastSlice {
  fetchPodcast: () => void
}

const DEFAULT_STATE: FetchPodcastSlice = {
  fetchPodcast: () => {},
}

export const createFetchPodcastSlice: StateCreator<
  CombinedState & FetchPodcastSlice,
  [],
  [],
  FetchPodcastSlice
> = (set, get) => {
  const fetchPodcast = () => {
    const pool = get().nostrPool
    const relays = get().nostrRelays
    const publicKey = get().accountPublicKey
    const nip04 = get().accountNIP07?.nip04

    if (!nip04)
      throw new Error("You must have a NIP-04 account to view gated posts")
    if (!pool) throw new Error("No pool")
    if (!relays) throw new Error("No relays")
    if (!publicKey) throw new Error("No public key")
  }

  return {
    ...DEFAULT_STATE,
    fetchPodcast,
  }
}
