import { StateCreator } from "zustand";
import { CombinedState } from "./use-app-state";
import { uploadToShdwDrive } from "../../shdw/upload";

export interface UploadSubmitCallbacks {
  onSuccess?: (uploadUrls: string[]) => void;
  onError?: (errorMessage: string) => void;
  clearForm?: () => void;
}

export interface UploadSlice {
  uploadIsUploading: boolean;
  uploadHandleFileChange: (event: any) => void;
  uploadFiles: File[];
  uploadUrls: string[];
  uploadSubmit: (callbacks: UploadSubmitCallbacks) => void;
}

const DEFAULT_STATE: UploadSlice = {
  uploadIsUploading: false,
  uploadHandleFileChange: (event: any) => {},
  uploadFiles: [],
  uploadUrls: [],
  uploadSubmit: () => {},
};

export const createUploadSlice: StateCreator<
  CombinedState & UploadSlice,
  [],
  [],
  UploadSlice
> = (set, get) => {
    
  const uploadHandleFileChange = (event: any) => {
    const fileList = event.target.files as FileList;
    const uploadFiles = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (!file) continue;

      uploadFiles.push(file);
    }

    set({ uploadFiles: uploadFiles });
  };

  const uploadSubmit = (callbacks: UploadSubmitCallbacks) => {
    const { onSuccess, onError, clearForm } = callbacks;

    const runOnSuccess = onSuccess ? onSuccess : () => {};
    const runOnError = onError ? onError : () => {};
    const runClearForm = clearForm ? clearForm : () => {};

    const files = get().uploadFiles;
    const isUploading = get().uploadIsUploading;
    // const prefix = get().accountProfile?.pubkey;
    const prefix = 'test';

    if (!prefix){ runOnError("You must have a NIP-04 account to upload"); return; }
    if (isUploading){ runOnError("Already uploading"); return; }
    if (files.length === 0){ runOnError("No files are selected"); return; }

    set({ uploadIsUploading: true });

    uploadToShdwDrive(files, prefix)
      .then((finalUrls) => {
        set({ uploadUrls: finalUrls, uploadFiles: [] });

        runClearForm();
        runOnSuccess(finalUrls);
      })
      .catch((e) => {
        runOnError(`${e}`);
      })
      .finally(() => {
        set({ uploadIsUploading: false });
      });
  };

  return {
    ...DEFAULT_STATE,
    uploadHandleFileChange,
    uploadSubmit,
  };
};
