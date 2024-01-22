import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect } from "react";
import { TestSlice, createTestSlice } from "./test-slice";
import { UploadSlice, createUploadSlice } from "./upload-slice";
import { GateCreateSlice, createGateCreateSlice } from "./gate-create-slice";

export type CombinedState = TestSlice & UploadSlice & GateCreateSlice;

export const useAppState = create<CombinedState>()(
  persist(
    (set, get, slice) => {
      return {
        ...createTestSlice(set, get, slice),
        ...createUploadSlice(set, get, slice),
        ...createGateCreateSlice(set, get, slice),
      };
    },
    {
      name: "nostr-app-state", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used

      // WHAT TO PERSIST
      partialize: (state) => ({
        testState: state.testState,
      }),

      // REHYDRATE
      skipHydration: true,
      onRehydrateStorage: (state) => {
        console.log("hydration starts");
        // optional
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished");
          }
        };
      },
    }
  )
);

export function setupAppState() {
  useEffect(() => {
    useAppState.persist.rehydrate();
  }, []);
}


export function useTestState() {
  return useAppState((state) => state.testState);
}