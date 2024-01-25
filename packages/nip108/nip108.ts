import {
  getPublicKey,
  finishEvent,
  Event as NostrEvent,
  nip04,
  EventTemplate
} from "nostr-tools";
import { decrypt, encrypt, hashToKey } from "../utils/crypto";
import { getLud16Url, isValidLud16 } from "../utils/lightning";
import { NIP07 } from "utils";

export enum NIP_108_KINDS {
  announcement = 54,
  gate = 55,
  key = 56,
}
export interface CreateNotePostBody {
  gateEvent: NostrEvent<number>;
  lud16: string;
  secret: string;
  cost: number;
}

export interface GatedNote {
    note: NostrEvent<number>;
    iv: string,
    cost: number,
    endpoint: string
    debug?: boolean,
}

export interface KeyNote {
    note: NostrEvent<number>;
    iv: string,
    gate: string,
    announcement: string,
    unlockedSecret?: string,
    debug?: boolean,
}

export interface AnnouncementNote {
  note: NostrEvent<number>;
  gate: string,
  type?: string,
  debug?: boolean,
}

export function eventToGatedNote(event: NostrEvent<number>): GatedNote {
    // Extract tags
    const ivTag = event.tags.find(tag => tag[0] === "iv");
    const costTag = event.tags.find(tag => tag[0] === "cost");
    const endpointTag = event.tags.find(tag => tag[0] === "endpoint");
    const debugTag = event.tags.find(tag => tag[0] === "debug");

    // Construct GatedNote
    const gatedNote: GatedNote = {
        note: event,
        iv: ivTag ? ivTag[1] : "",   // Assuming an empty string as default value
        cost: costTag ? parseInt(costTag[1]) : 0,   // Assuming a default value of 0
        endpoint: endpointTag ? endpointTag[1] : "",   // Assuming an empty string as default value
        debug: debugTag ? debugTag[1] === "true" : false,
    };

    return gatedNote;
}

export function eventToKeyNote(event: NostrEvent<number>): KeyNote {
    // Extract tags
    const ivTag = event.tags.find(tag => tag[0] === "iv");
    const gateTag = event.tags.find(tag => tag[0] === "e" || tag[0] === "g");
    const announcementTag = event.tags.find(tag => tag[0] === "announcement");
    const debugTag = event.tags.find(tag => tag[0] === "debug");

    // Construct GatedNote
    const keyNote: KeyNote = {
        note: event,
        iv: ivTag ? ivTag[1] : "",
        gate: gateTag ? gateTag[1] : "",
        announcement: announcementTag ? announcementTag[1] : "",
        debug: debugTag ? debugTag[1] === "true" : false,
    };

    return keyNote;
}

export function eventToAnnouncementNote(event: NostrEvent<number>): AnnouncementNote {
  // Extract tags
  const gateTag = event.tags.find(tag => tag[0] === "e" || tag[0] === "g");
  const debugTag = event.tags.find(tag => tag[0] === "debug");

  // Construct GatedNote
  const announcementNote: AnnouncementNote = {
      note: event,
      gate: gateTag ? gateTag[1] : "",
      debug: debugTag ? debugTag[1] === "true" : false,
  };

  return announcementNote;
}

export function createGatedNoteUnsigned(
  publicKey: string,
  secret: string,
  costmSats: number,
  endpoint: string,
  payload: NostrEvent<number>,
  debug?: boolean
): EventTemplate<number> {
  const noteToEncrypt = JSON.stringify(payload);
  const noteSecretKey = hashToKey(secret);
  const encryptedNote = encrypt(noteToEncrypt, noteSecretKey);

  const event = {
    kind: NIP_108_KINDS.gate,
    pubkey: publicKey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["iv", encryptedNote.iv],
      ["cost", costmSats.toString()],
      ["endpoint", endpoint],
      ...(debug ? [["debug", "true"]] : [])
    ],
    content: encryptedNote.content,
  };

  return event;
}

export function createNote(
  privateKey: string,
  content: string,
  kind: number = 1,
  tags: string[][] = [],
  debug: boolean = false,
): NostrEvent<number> {

  const event = createNoteUnsigned(
    getPublicKey(privateKey),
    content,
    kind,
    tags,
    debug
  )

  return finishEvent(event, privateKey);
}

export function createNoteUnsigned(
  publicKey: string,
  content: string,
  kind: number = 1,
  tags: string[][] = [],
  debug: boolean = false,
): EventTemplate<number> {

  const event = {
    kind,
    pubkey: publicKey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ...tags,
      ...(debug ? [["debug", "true"]] : []),
    ],
    content: content,
  };

  return event;
}

export function createGatedNote(
  privateKey: string,
  secret: string,
  cost: number,
  endpoint: string,
  payload: NostrEvent<number>
): NostrEvent<number> {

  const event = createGatedNoteUnsigned(
    getPublicKey(privateKey),
    secret,
    cost,
    endpoint,
    payload,
  )

  return finishEvent(event, privateKey);
}

export function createKeyNoteUnsigned(
  publicKey: string,
  encryptedSecret: string,
  gatedNote: NostrEvent<number>,
  announcementNote: NostrEvent<number>,
  debug?: boolean
  ): EventTemplate<number> {

  const event = {
    kind: NIP_108_KINDS.key,
    pubkey: publicKey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["e", gatedNote.id],
      ["announcement", announcementNote.id],
      ...(debug ? [["debug", "true"]] : [])
    ],
    content: encryptedSecret,
  };

  return event;
}

export async function createKeyNote(
  privateKey: string,
  secret: string,
  gatedNote: NostrEvent<number>,
  announcementNote: NostrEvent<number>,
): Promise<NostrEvent<number>> {
  const encryptedSecret = await nip04.encrypt(privateKey, gatedNote.pubkey, secret);

  const event = createKeyNoteUnsigned(getPublicKey(privateKey), encryptedSecret, gatedNote, announcementNote)

  return finishEvent(event, privateKey);
}

export function createAnnouncementNoteUnsigned(
  publicKey: string,
  content: string,
  gatedNote: NostrEvent<number>,
  kind?: number,
  tags?: string[][],
  debug?: boolean
): EventTemplate<number> {

  const event = {
    kind: kind ?? NIP_108_KINDS.announcement,
    pubkey: publicKey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["e", gatedNote.id],
      ...(tags ?? []),
      ...(debug ? [["debug", "true"]] : [])
    ],
    content: content,
  };

  return event;
}

export function createAnnouncementNote(
  privateKey: string,
  content: string,
  gatedNote: NostrEvent<number>,
  kind?: number,
  tags?: string[][],
  debug?: boolean
): NostrEvent<number> {

  const event = createAnnouncementNoteUnsigned(
    getPublicKey(privateKey), 
    content, 
    gatedNote, 
    kind, 
    tags, 
    debug
  )

  return finishEvent(event, privateKey);
}

export function unlockGatedNote(
  gatedNote: NostrEvent<number>,
  secret: string
): NostrEvent<number> {
  // 1. Derive the encryption key from the secret
  const noteSecretKey = hashToKey(secret);

  // 2. Extract the iv and content from the gatedNote
  const ivTag = gatedNote.tags?.find((tag) => tag[0] === "iv");
  const content = gatedNote.content;

  if (!ivTag) {
    throw new Error("IV not found in the gatedNote tags");
  }

  const iv = ivTag[1];

  // 3. Decrypt the content using the derived key and iv
  const decryptedContent = decrypt(iv, content, noteSecretKey);

  // 4. Parse the decrypted content into a VerifiedEvent<number> object
  return JSON.parse(decryptedContent) as NostrEvent<number>;
}

export async function unlockGatedNoteFromKeyNoteNIP07(
  nip07: NIP07,
  keyNote: NostrEvent<number>,
  gatedNote: NostrEvent<number>
): Promise<NostrEvent<number>> {

  if(!nip07.nip04) throw new Error('NIP04 not found in NIP07');

  let decryptedSecret = ''
  // 1. Decrypt key using nip04
  try {
    decryptedSecret = await nip07.nip04.decrypt(gatedNote.pubkey, keyNote.content);

  } catch (error) {
    throw new Error(`Failed to decrypt the key: ${error}`);
  }
  
  // 2. Use the decrypted secret to decrypt the gatedNote
  return unlockGatedNote(gatedNote, decryptedSecret);
}

export async function unlockGatedNoteFromKeyNote(
  privateKey: string,
  keyNote: NostrEvent<number>,
  gatedNote: NostrEvent<number>
): Promise<NostrEvent<number>> {
  // 1. Decrypt key using nip04
  const decryptedSecret = await nip04.decrypt(privateKey, gatedNote.pubkey, keyNote.content);
  
  // 2. Use the decrypted secret to decrypt the gatedNote
  return unlockGatedNote(gatedNote, decryptedSecret);
}

export async function verifyCreateNote(post: CreateNotePostBody, serverEndpoint: string) {
    const { gateEvent: kind42, lud16, secret, cost } = post;
  
    // Check Secret
    if (!secret) throw new Error("Secret needs to exist");
  
    // Check Cost
    if (cost <= 0) throw new Error("Cost needs to be at least 1 mSat");
  
    // Check lud16
    if (!isValidLud16(lud16)) throw new Error(`${lud16} is not a valid lud16`);
  
    const testLud16Url = getLud16Url(lud16);
    const testLud16Response = await fetch(testLud16Url);
    if (testLud16Response.status !== 200)
      throw new Error(
        `${lud16} does not return a valid response ${testLud16Response.toString()}`
      );
  
    // Verify kind42 structure
    const kind = kind42.kind;
    const pubkey = kind42.pubkey;
    const createdAt = kind42.created_at;
    const content = kind42.content;
    const id = kind42.id;
    const tags = kind42.tags;
  
    if (!kind) throw new Error(`Invalid kind42.kind value ${kind42}`);
    if (!pubkey) throw new Error(`Missing kind42.pubkey ${kind42}`);
    if (!createdAt) throw new Error(`Missing kind42.created_at ${kind42}`);
    if (!content) throw new Error(`Missing kind42.content ${kind42}`);
    if (!id) throw new Error(`Missing kind42.id ${kind42}`);
    if (!tags || tags.length === 0) throw new Error(`Missing kind42.tags ${kind42}`);
  
    // Check for specific tags
    const ivTag = kind42.tags.find((tag) => tag[0] === "iv");
    const costTag = kind42.tags.find((tag) => tag[0] === "cost");
    const endpointTag = kind42.tags.find((tag) => tag[0] === "endpoint");
  
    if (!ivTag) throw new Error(`Missing 'iv' tag in  ${kind42}`);
    if (!costTag) throw new Error(`Missing 'cost' tag in  ${kind42}`);
    if (!endpointTag) throw new Error(`Missing 'endpoint' tag in  ${kind42}`);
  
    if(endpointTag[1] !== serverEndpoint) throw new Error(`Expected endpoint: ${serverEndpoint} Got ${endpointTag[1]}`);
  
    const ungatedNote = unlockGatedNote(kind42, secret);
  
    if(!ungatedNote.id) throw new Error(`Secret ${secret} did not decrypt the note ${ungatedNote.toString()}`);
  
  }
