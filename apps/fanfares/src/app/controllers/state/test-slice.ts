import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';

export interface TestSlice {
    testState: string;
    testSetState: (state: string) => void,
}

const DEFAULT_STATE: TestSlice = {
    testState: 'Test State',
    testSetState: (state: string) => {},
};

export const createTestSlice: StateCreator<
  CombinedState & TestSlice,
  [],
  [],
  TestSlice
> = (set, get) => {
    
    const testSetState = (state: string) => {
        set({ testState: state });
    }

    return {
        ...DEFAULT_STATE,
        testSetState,
    };
};
