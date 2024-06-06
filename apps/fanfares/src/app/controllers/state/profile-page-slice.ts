import { StateCreator } from 'zustand';

export interface ProfilePageSlice {
    profileState: string;
}

const DEFAULT_STATE: ProfilePageSlice = {
    profileState: 'Test State',
};

export const createTestSlice: StateCreator<
  ProfilePageSlice,
  [],
  [],
  ProfilePageSlice
> = (set, get) => {
    

    return {
        ...DEFAULT_STATE,
    };
};
