import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';

export interface PostNoteSlice {
   postNoteState: string,
}

const DEFAULT_STATE: PostNoteSlice = {
    postNoteState: 'Test State',
};

export const createPostNoteSlice: StateCreator<
  CombinedState & PostNoteSlice,
  [],
  [],
  PostNoteSlice
> = (set, get) => {
   
    return {
        ...DEFAULT_STATE,
    };
};
