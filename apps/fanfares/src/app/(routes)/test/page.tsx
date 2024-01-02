"use client";

import { useAppState } from "@/app/controllers/state/use-app-state";
import React from "react";

export default function TestPage() {
const formRef = React.useRef<HTMLFormElement>(null);
  const {
    uploadHandleFileChange,
    uploadIsUploading,
    uploadSubmit,
    uploadUrls,
  } = useAppState();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    uploadSubmit({
        onSuccess(uploadUrls) {
            console.log(uploadUrls);
            formRef.current?.reset();
        },
        onError(error) {
            console.error(error);
        }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} ref={formRef}>
        <input
          multiple
          type="file"
          className="border-2 border-black"
          onChange={uploadHandleFileChange}
        />
        <button type="submit" className="border-2 border-black">
          Submit
        </button>
      </form>
      <p>{uploadIsUploading ? 'Uploading...' : 'Idle'}</p>
      {uploadIsUploading }
      {uploadUrls.map((url, index) => (
        <p key={index}>{url}</p>
      ))}
    </div>
  );
}
