import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';

export interface UploadPodcastSubmitCallbacks {
    onSuccess?: () => void;
    onError?: () => void;
    clearForm?: () => void;
  }
  

export interface UploadPodcastSlice {
    uploadPodcastTitle: string,
    uploadPodcastDescription: string,

    uploadPodcastSubmit: (callbacks: UploadPodcastSubmitCallbacks) => void,

    uploadPodcastHandleTitle: (title: string) => void,
    uploadPodcastHandleDescription: (description: string) => void,
    uploadPodcastHandleFileChange: (event: any) => void,
}

const DEFAULT_STATE: UploadPodcastSlice = {
    uploadPodcastTitle: '',
    uploadPodcastDescription: '',

    uploadPodcastSubmit: (callbacks: UploadPodcastSubmitCallbacks) => {},
    uploadPodcastHandleTitle: (title: string) => {},
    uploadPodcastHandleDescription: (description: string) => {},
    uploadPodcastHandleFileChange: (event: any) => {},
};

export const createUploadPodcastSlice: StateCreator<
  CombinedState & UploadPodcastSlice,
  [],
  [],
  UploadPodcastSlice
> = (set, get) => {

    const uploadPodcastHandleTitle = (title: string) => {

    }
    
    const uploadPodcastSubmit = (callbacks: UploadPodcastSubmitCallbacks) => {
        const { onSuccess, onError, clearForm } = callbacks;

        const runOnSuccess = onSuccess ? onSuccess : () => {};
        const runOnError = onError ? onError : () => {};
        const runClearForm = clearForm ? clearForm : () => {};

        // 
    }

    return {
        ...DEFAULT_STATE,
        uploadPodcastSubmit,
    };
};
