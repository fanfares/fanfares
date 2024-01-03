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
    uploadPodcastAnnouncement: string,

    uploadPodcastSubmit: (callbacks: UploadPodcastSubmitCallbacks) => void,

    uploadPodcastHandleAnnouncement: (announcement: string) => void,
    uploadPodcastHandleTitle: (title: string) => void,
    uploadPodcastHandleDescription: (description: string) => void,
    uploadPodcastHandleFileChange: (event: any) => void,
}

const DEFAULT_STATE: UploadPodcastSlice = {
    uploadPodcastTitle: '',
    uploadPodcastDescription: '',
    uploadPodcastAnnouncement: '',

    uploadPodcastSubmit: (callbacks: UploadPodcastSubmitCallbacks) => {},

    uploadPodcastHandleAnnouncement: (announcement: string) => {},
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
        set({ uploadPodcastTitle: title });
    }

    const uploadPodcastHandleAnnouncement = (announcement: string) => {
        set({ uploadPodcastAnnouncement: announcement });
    }

    const uploadPodcastHandleDescription = (description: string) => {
        set({ uploadPodcastDescription: description });
    }

    const uploadPodcastHandleFileChange = (event: any) => {
        get().uploadHandleFileChange(event);
    };
    
    const uploadPodcastSubmit = (callbacks: UploadPodcastSubmitCallbacks) => {
        const { onSuccess, onError, clearForm } = callbacks;

        const runOnSuccess = onSuccess ? onSuccess : () => {};
        const runOnError = onError ? onError : () => {};
        const runClearForm = clearForm ? clearForm : () => {};

        const files = get().uploadFiles;
        const isUploading = get().uploadIsUploading;


        // Upload the files

        // Construct the gated post

        // Post the gated post
    }

    return {
        ...DEFAULT_STATE,
        uploadPodcastSubmit,
        uploadPodcastHandleTitle,
        uploadPodcastHandleAnnouncement,
        uploadPodcastHandleDescription,
        uploadPodcastHandleFileChange,
    };
};
