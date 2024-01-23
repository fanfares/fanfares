import { StateCreator, create } from "zustand";
import { CombinedState } from "./use-app-state";

export interface PlayerPageSlice {
  playerPageGateId: string;
    
  actions: {
    setPlayerPageGateId: (id: string) => void;
  };
}

const DEFAULT_STATE: PlayerPageSlice = {
  playerPageGateId: "Test State",
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
    }

  return {
    ...DEFAULT_STATE,
    actions: {
        setPlayerPageGateId,
    },
  };
};

const usePlayerPage = create<PlayerPageSlice>()(createPlayerPageSlice);

export const usePlayerPageGateId = () => usePlayerPage((state) => state.playerPageGateId);
export const usePlayerPageActions = () => usePlayerPage((state) => state.actions);
