import { StateCreator, create } from "zustand";
import { CombinedState } from "./use-app-state";
import { Podcast } from "./podcast-slice";

export interface PlayerPageSlice {
  playerPageGateId: string;
playerPagePodcast: Podcast | null;
  actions: {
    setPlayerPageGateId: (id: string) => void;
  };
}

const DEFAULT_STATE: PlayerPageSlice = {
  playerPageGateId: "Test State",
  playerPagePodcast: null,
  actions: {
    setPlayerPageGateId: (id: string) => {},
  },
};

export const createPlayerPageSlice: StateCreator<
  PlayerPageSlice,
  [],
  [],
  PlayerPageSlice
> = (set, get) => {
    const setPlayerPageGateId = (id: string) => {
        set({ playerPageGateId: id });

        // Fetch podcast
    }

  return {
    ...DEFAULT_STATE,
    actions: {
        setPlayerPageGateId,
    },
  };
};

const usePlayerPage = create<PlayerPageSlice>()(createPlayerPageSlice);

export const usePlayerPodcast = () => usePlayerPage((state) => state.playerPagePodcast);
export const usePlayerPageGateId = () => usePlayerPage((state) => state.playerPageGateId);
export const usePlayerPageActions = () => usePlayerPage((state) => state.actions);
