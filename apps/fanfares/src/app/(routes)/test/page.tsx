"use client";

import { GateCreateState } from "@/app/controllers/state/gate-create-slice";
import { useAppState } from "@/app/controllers/state/use-app-state";
import { createNoteUnsigned } from "nip108";
import React, { useEffect } from "react";

export default function TestPage() {
  return (
    <div>
      {TestPostPodcast()}
      {TestPostGatedNote()}
      {TestPostNote()}
    </div>
  );
}

export function TestPostPodcast() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const {
    postPodcastClear,
    postPodcastState,
    postPodcastSubmit,
    postPodcastHandleTitleChange,
    postPodcastTitle,
    accountProfile,
    postPodcastDescription,
    postPodcastLud16,
    postPodcastUnlockCost,
    postPodcastHandleUnlockCostChange,
    postPodcastHandleAudioChange,
    postPodcastHandleImageChange,
    postPodcastHandleLud16Change,
    postPodcastHandleDescriptionChange,
    postPodcastSetLud16
  } = useAppState();

  useEffect(() => {
    if(accountProfile && accountProfile.lud16) {
      postPodcastSetLud16(accountProfile.lud16);
    }
  }, [accountProfile])

  useEffect(() => {
    postPodcastClear();
  }, [postPodcastClear])

  const handlePostSubmit = (event: any) => {
    event.preventDefault();
    postPodcastSubmit({
      onSuccess(ids) {
        console.log(ids);
        alert(`Note posted with id ${ids}`);
      },
      onError(error) {
        alert(`Error posting note: ${error}`);
      },
      onClear() {
        formRef.current?.reset();
      }
    })
  }

  return (
    <div className="flex">
      <form onSubmit={handlePostSubmit} ref={formRef}>
        <p>{postPodcastState}</p>
        <input 
          type="file"
          onChange={postPodcastHandleImageChange}
          accept="image/*"
        />
        <input 
          type="file"
          onChange={postPodcastHandleAudioChange}
          accept="audio/*"
        />
        <input
          className="bg-black"
          type="text"
          onChange={postPodcastHandleLud16Change}
          value={postPodcastLud16}
        />
        <input
          className="bg-black"
          type="text"
          onChange={postPodcastHandleTitleChange}
          value={postPodcastTitle}
        />
        <input
          className="bg-black"
          type="text"
          onChange={postPodcastHandleDescriptionChange}
          value={postPodcastDescription}
        />
        <input
          className="bg-black"
          type="number"
          onChange={postPodcastHandleUnlockCostChange}
          value={postPodcastUnlockCost}
        />
        <button type="submit" >
          Create Podcast
        </button>
      </form>
    </div>
  );
}

export function TestPostGatedNote() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const {
    postGatedNoteClear,
    postGatedNoteState,
    postGatedNoteLud16,
    postGatedNoteSetLud16,
    postGatedNoteHandleLud16Change,
    postGatedNoteHandleAnnouncementContentChange,
    postGatedNoteAnnouncementContent,
    postGatedNoteHandleContentChange,
    postGatedNoteContent,
    postGatedNoteSubmit,
    postGatedNoteHandleUnlockCostChange,
    postGatedNoteUnlockCost,
    accountProfile
  } = useAppState();

  useEffect(() => {
    if(accountProfile && accountProfile.lud16) {
      postGatedNoteSetLud16(accountProfile.lud16);
    }
  }, [accountProfile])

  useEffect(() => {
    postGatedNoteClear();
  }, [postGatedNoteClear])

  const handlePostSubmit = (event: any) => {
    event.preventDefault();
    postGatedNoteSubmit({
      onSuccess(ids) {
        console.log(ids);
        alert(`Note posted with id ${ids}`);
      },
      onError(error) {
        alert(`Error posting note: ${error}`);
      },
      onClear() {
        formRef.current?.reset();
      }
    })
  }

  return (
    <div className="flex">
      <form onSubmit={handlePostSubmit} ref={formRef}>
        <p>{postGatedNoteState}</p>
        <input
          className="bg-black"
          type="text"
          onChange={postGatedNoteHandleLud16Change}
          value={postGatedNoteLud16}
        />
        <input
          className="bg-black"
          type="text"
          onChange={postGatedNoteHandleAnnouncementContentChange}
          value={postGatedNoteAnnouncementContent}
        />
        <input
          className="bg-black"
          type="text"
          onChange={postGatedNoteHandleContentChange}
          value={postGatedNoteContent}
        />
        <input
          className="bg-black"
          type="number"
          onChange={postGatedNoteHandleUnlockCostChange}
          value={postGatedNoteUnlockCost}
        />
        <button type="submit" >
          Create Note
        </button>
      </form>
    </div>
  );
}

export function TestPostNote() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const {
    postNoteClear,
    postNoteState,
    postNoteSubmit,
    postNoteHandleContentChange,
    postNoteContent
  } = useAppState();

  useEffect(() => {
    postNoteClear();
  }, [postNoteClear])

  const handlePostSubmit = (event: any) => {
    event.preventDefault();
    postNoteSubmit({
      onSuccess(id) {
        alert(`Note posted with id ${id}`);
      },
      onError(error) {
        alert(`Error posting note: ${error}`);
      },
      onClear() {
        formRef.current?.reset();
      }
    })
  }

  return (
    <div>

      <form onSubmit={handlePostSubmit} ref={formRef}>
        <p>{postNoteState}</p>
        <input
          className="bg-black"
          type="text"
          onChange={postNoteHandleContentChange}
          value={postNoteContent}
        >
        </input>
        <button type="submit" >
          Create Note
        </button>
      </form>
    </div>
  );
}


// "use client";

// import { GateCreateState } from "@/app/controllers/state/gate-create-slice";
// import { useAppState } from "@/app/controllers/state/use-app-state";
// import { createNoteUnsigned } from "nip108";
// import React, { useEffect } from "react";

// export default function TestPage() {
// const formRef = React.useRef<HTMLFormElement>(null);
//   const {
//     uploadHandleFileChange,
//     uploadIsUploading,
//     uploadSubmit,
//     uploadUrls,
//     gateCreateNoteKeys,
//     gateCreateState,
//     gateCreateSubmit: gateCreate,
//     accountProfile,
//     nostrPool,
//     nostrRelays,
//     postNoteState,
//     postNoteClear,
//   } = useAppState();

//   const handleCreateSubmit = (event: any) => {
//     event.preventDefault();

//     const pubkey = accountProfile?.pubkey;
//     if (!pubkey) {
//       alert("You must be logged in to create a gated note");
//       return;
//     }

//     const noteToGate = createNoteUnsigned(
//       pubkey,
//       "Hi there!",
//     );

//     gateCreate({
//       noteToGate,
//       announcementContent: "Hi there!",
//       unlockCost: 1000
//     })

//   }

//   const handleFileSubmit = (event: any) => {
//     event.preventDefault();
//     uploadSubmit({
//         onSuccess(uploadUrls) {
//             console.log(uploadUrls);
//             formRef.current?.reset();
//         },
//         onError(error) {
//             console.error(error);
//         }
//     });
//   };

//   useEffect(() => {
//       if(gateCreateState === GateCreateState.IDLE && gateCreateNoteKeys.length > 0) {

//         nostrPool.list(nostrRelays, [
//           {
//             ids: gateCreateNoteKeys,
//           }
//         ]).then((result) => {
//           console.log(result);
//         })

//       }
//   }, [gateCreateNoteKeys, gateCreateState])



//   return (
//     <div>

//       <form onSubmit={handleCreateSubmit} ref={formRef}>
//         <p>{gateCreateState}</p>
//         {gateCreateNoteKeys.map((key, index) => (
//           <p key={index}>{key}</p>
//       ))}
//         <button type="submit" >
//           Create Note
//         </button>
//       </form>

//     	<p>{postNoteState}</p>
//       <form onSubmit={handleCreateSubmit} ref={formRef}>
//         <p>{gateCreateState}</p>
//         {gateCreateNoteKeys.map((key, index) => (
//           <p key={index}>{key}</p>
//       ))}
//         <button type="submit" >
//           Create Gated Note
//         </button>
//       </form>
//       <form onSubmit={handleFileSubmit} ref={formRef}>
//         <input
//           multiple
//           type="file"
//           className="border-2 border-black"
//           onChange={uploadHandleFileChange}
//         />
//         <button type="submit" className="border-2 border-black">
//           Submit
//         </button>
//       </form>
//       <p>{uploadIsUploading ? 'Uploading...' : 'Idle'}</p>
//       {uploadIsUploading }
//       {uploadUrls.map((url, index) => (
//         <p key={index}>{url}</p>
//       ))}
//     </div>
//   );
// }
