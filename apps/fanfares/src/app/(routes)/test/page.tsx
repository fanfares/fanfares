"use client";

import { GateCreateState } from "@/app/controllers/state/gate-create-slice";
import { useAppState } from "@/app/controllers/state/use-app-state";
import { createNoteUnsigned } from "nip108";
import React, { useEffect } from "react";

export default function TestPage() {
const formRef = React.useRef<HTMLFormElement>(null);
  const {
    uploadHandleFileChange,
    uploadIsUploading,
    uploadSubmit,
    uploadUrls,
    gateCreateNoteKeys,
    gateCreateState,
    gateCreateSubmit: gateCreate,
    accountProfile,
    nostrPool,
    nostrRelays,
    postNoteState,
  } = useAppState();

  const handleCreateSubmit = (event: any) => {
    event.preventDefault();

    const pubkey = accountProfile?.pubkey;
    if (!pubkey) {
      alert("You must be logged in to create a gated note");
      return;
    }

    const noteToGate = createNoteUnsigned(
      pubkey,
      "Hi there!",
    );

    gateCreate({
      noteToGate,
      announcementContent: "Hi there!",
      unlockCost: 1000
    })

  }

  const handleFileSubmit = (event: any) => {
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

  useEffect(() => {
      if(gateCreateState === GateCreateState.IDLE && gateCreateNoteKeys.length > 0) {

        nostrPool.list(nostrRelays, [
          {
            ids: gateCreateNoteKeys,
          }
        ]).then((result) => {
          console.log(result);
        })

      }
  }, [gateCreateNoteKeys, gateCreateState])



  return (
    <div>
    	<p>{postNoteState}</p>
      <form onSubmit={handleCreateSubmit} ref={formRef}>
        <p>{gateCreateState}</p>
        {gateCreateNoteKeys.map((key, index) => (
          <p key={index}>{key}</p>
      ))}
        <button type="submit" >
          Create Gated Note
        </button>
      </form>
      <form onSubmit={handleFileSubmit} ref={formRef}>
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
