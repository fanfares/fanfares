import { StateCreator } from 'zustand';

export interface NotePageSlice {
    notePageState: string;
}

const DEFAULT_STATE: NotePageSlice = {
    notePageState: 'Test State',
};

export const createTestSlice: StateCreator<
  NotePageSlice,
  [],
  [],
  NotePageSlice
> = (set, get) => {
    
    return {
        ...DEFAULT_STATE,
    };
};
