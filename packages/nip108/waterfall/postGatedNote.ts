import {
  Event as NostrEvent,
  generatePrivateKey,
} from "nostr-tools";
import { CreateNotePostBody, createAnnouncementNoteUnsigned, createGatedNoteUnsigned, createNoteUnsigned } from "../nip108";
import { WaterfallRequirements } from "./waterfall";

export interface PostGatedNoteIds {
    gateNote: string,
    announcementNoteId: string,
}

export type PostGatedNoteState = "IDLE" | "GETTING_PUBLIC_KEY" | "SIGNING_GATED_CONTENT" | "SIGNING_GATE" | "UPLOADING_GATE" | "PUBLISH_GATE" | "SIGNING_ANNOUNCEMENT" | "PUBLISH_ANNOUNCEMENT";

export interface PostGatedNoteInput extends WaterfallRequirements {
  gatedNoteContent: string;
  gatedNoteKind?: number;
  gatedNoteTags?: string[][];

  announcementNoteContent: string;
  announcementNoteKind?: number;
  announcementNoteTags?: string[][];

  gateServer: string;
  costmSats: number;
  lud16: string;

  _state?: PostGatedNoteState;
  _setState: (state: PostGatedNoteState) => void;

  _publicKey?: string;
  _setPublicKey: (publicKey: string) => void;

  _signedGatedNote?: NostrEvent;
  _setSignedGatedNote: (signedNote: NostrEvent) => void;

  _secret?: string;
  _signedGate?: NostrEvent;
  _setSignedGate: (signedNote: NostrEvent, secret: string) => void;

  _didUploadGate?: boolean;
  _gateResponse?: string;
  _setGateResponse: (response: string, didUploadGate: boolean) => void;

  _didPublishGate?: boolean;
    _setDidPublishGate: (didPublishGate: boolean) => void;

  _signedAnnouncement?: NostrEvent;
  _setSignedAnnouncement: (signedNote: NostrEvent) => void;

  debug?: boolean;
}

export async function postGatedNote(
  input: PostGatedNoteInput
): Promise<PostGatedNoteIds> {
  const {
    nip07,
    publish,
    gateServer,
    gatedNoteContent,
    gatedNoteKind,
    gatedNoteTags,
    announcementNoteContent,
    announcementNoteKind,
    announcementNoteTags,
    costmSats,
    lud16,
    debug,
  } = input;
  const {
    _setState,
    _setPublicKey,
    _setSignedGatedNote,
    _setSignedGate,
    _setGateResponse,
    _setDidPublishGate,
    _setSignedAnnouncement,
  } = input;
  let {
    _state,
    _publicKey,
    _secret,
    _signedGatedNote,
    _signedGate,
    _gateResponse,
    _didUploadGate,
    _didPublishGate,
    _signedAnnouncement,
  } = input;

  if (!nip07) throw new Error("Missing NIP07");
  if (!publish) throw new Error("Missing publish");
  if (!gatedNoteContent) throw new Error("Missing gated note content");
  if (!announcementNoteContent)
    throw new Error("Missing announcement note content");
  if (!gateServer) throw new Error("Missing gate server");
  if (!costmSats) throw new Error("Missing cost");
  if (!lud16) throw new Error("Missing lud16");

  switch (_state) {
    case "IDLE": {
      _setState("GETTING_PUBLIC_KEY");
    }
    case "GETTING_PUBLIC_KEY": {

      _publicKey = await nip07.getPublicKey();
      _setPublicKey(_publicKey);
      _setState("SIGNING_GATED_CONTENT");
    }
    case "SIGNING_GATED_CONTENT": {

      if (!_publicKey) {
        _setState("GETTING_PUBLIC_KEY");
        throw new Error("Missing public key");
      }

      const gatedNote = createNoteUnsigned(
        _publicKey,
        gatedNoteContent,
        gatedNoteKind,
        gatedNoteTags,
        debug
      );
      _signedGatedNote = await nip07.signEvent(gatedNote);


      _setSignedGatedNote(_signedGatedNote);
      _setState("SIGNING_GATE");
    }
    case "SIGNING_GATE": {

      if (!_publicKey) {
        _setState("GETTING_PUBLIC_KEY");
        throw new Error("Missing public key");
      }

      if (!_signedGatedNote) {
        _setState("SIGNING_GATED_CONTENT");
        throw new Error("Missing signed gated note");
      }

      _secret = generatePrivateKey();
      const gatedNote = createGatedNoteUnsigned(
        _publicKey,
        _secret,
        costmSats,
        gateServer,
        _signedGatedNote,
        debug
      );

      _signedGate = await nip07.signEvent(gatedNote);


      _setSignedGate(_signedGate, _secret);
      _setState("UPLOADING_GATE");
    }
    case "UPLOADING_GATE": {


        if(!_signedGate){
            _setState("SIGNING_GATE");
            throw new Error("Missing signed gate");
        }

        if(!_secret){
            _setState("SIGNING_GATE");
            throw new Error("Missing secret");
        }


        const postBody: CreateNotePostBody = {
            gateEvent: _signedGate,
            lud16: lud16,
            secret: _secret,
            cost: costmSats,
          };
  
          const response = await fetch(gateServer + "/create", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(postBody),
          });
  
          if (!response.ok) throw new Error("Failed to upload gate");
          _gateResponse = JSON.stringify(await response.json() ?? ''); // More for debugging
          _didUploadGate = true; // Flag we look for

          _setGateResponse(_gateResponse, _didUploadGate);
          _setState("PUBLISH_GATE");
  
    }
    case "PUBLISH_GATE": {

      if(!_signedGate){
            _setState("SIGNING_GATE");
            throw new Error("Missing signed gate");
      }

      if (!_didUploadGate) 
      {
        _setState("UPLOADING_GATE");
        throw new Error("Did not upload gate");
      }

      await publish(_signedGate);

      _didPublishGate = true;
      _setDidPublishGate(_didPublishGate);
      _setState("SIGNING_ANNOUNCEMENT");

    }
    case "SIGNING_ANNOUNCEMENT": {

        if(!_publicKey){
            _setState("GETTING_PUBLIC_KEY");
            throw new Error("Missing public key");
        }

        if(!_signedGate){
            _setState("SIGNING_GATE");
            throw new Error("Missing signed gate");
        }

        if(!_didUploadGate){
            _setState("UPLOADING_GATE");
            throw new Error("Did not upload gate");
        }

        if(!_didPublishGate){
            _setState("PUBLISH_GATE");
            throw new Error("Did not publish gate");
        }

        const announcementNote = createAnnouncementNoteUnsigned(
            _publicKey,
            announcementNoteContent,
            _signedGate,
            announcementNoteKind,
            announcementNoteTags,
            debug
        );

        _signedAnnouncement = await nip07.signEvent(announcementNote);
        _setSignedAnnouncement(_signedAnnouncement);
        _setState("PUBLISH_ANNOUNCEMENT");

    }
    case "PUBLISH_ANNOUNCEMENT": {

        if(!_signedGate){
            _setState("SIGNING_GATE");
            throw new Error("Missing signed gate");
        }

        if(!_signedAnnouncement){
            _setState("SIGNING_ANNOUNCEMENT");
            throw new Error("Missing signed announcement");
        }

        await publish(_signedAnnouncement);
        _setState("IDLE");

        return {
            gateNote: _signedGate.id,
            announcementNoteId: _signedAnnouncement.id,
        }
    }
    default: {
      throw new Error("Invalid state");
    }
  }
}
